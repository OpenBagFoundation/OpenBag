# Spec 08 — Gateway do Agente · Agent Gateway

> **Resumo (PT-BR):** O Gateway do Agente é o plano de controle entre o shell do OpenBag Agent e todas as skills instaladas. Ele aplica permissões declaradas no SKILL.yaml, roteia mensagens, gerencia o barramento de eventos e fornece acesso sandboxed ao hardware e armazenamento local. Nenhuma skill pode acessar diretamente APIs do dispositivo, rede ou outras skills sem passar pelo Gateway — garantindo o princípio de mínimo privilégio exigido pela LGPD e pela arquitetura de segurança do projeto.

**Status**: Draft | **Version**: 0.1.0 | **Date**: 2026-04

---

## 1. Overview

The **Agent Gateway** is the control plane that sits between the OpenBag Agent shell and all installed Skills. It enforces permissions, routes messages, manages the event bus, and provides sandboxed access to hardware and local storage. No Skill may directly access device APIs, the network, or other Skills without going through the Gateway.

```
┌─────────────────────────────────────────────────────┐
│                  OpenBag Agent Shell                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Skill A │  │  Skill B │  │    Skill C        │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │             │                  │             │
│  ─────┴─────────────┴──────────────────┴──────────  │
│                  Agent Gateway                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Permission│  │ Event Bus│  │  Channel Router   │  │
│  │Enforcer  │  │          │  │                   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Hardware  │  │Encrypted │  │  IPC Broker       │  │
│  │Abstraction│  │  Store   │  │                   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
         │              │              │
    BLE/NFC          SQLCipher      HTTP(S)
```

---

## 2. Core Principles

| Principle | Implementation |
|-----------|---------------|
| Least privilege | Skills declare permissions in SKILL.yaml; Gateway grants only declared scopes |
| Fail-closed | Any undeclared access attempt → immediate skill suspension + audit log |
| Local-first | All data stays on device unless a skill explicitly holds `http:` permission |
| Auditability | Every Gateway action is appended to an append-only audit log (SQLCipher) |
| Sandboxing | Each skill runs in an isolated JS context (Hermes/V8) with no global leakage |

---

## 3. Subsystems

### 3.1 Permission Enforcer

The Permission Enforcer intercepts all capability requests before dispatching them to the hardware or network layer.

**Enforcement flow:**

```
Skill calls gateway.request(capability, params)
        │
        ▼
  Is capability in skill's declared permissions?
        │ NO → throw PermissionDeniedError, log violation
        │ YES
        ▼
  Is this permission user-approved? (install-time consent)
        │ NO → prompt user, await approval or denial
        │ YES
        ▼
  Rate-limit check (per-skill, per-capability)
        │ EXCEEDED → throw RateLimitError
        │ OK
        ▼
  Dispatch to hardware/network/storage subsystem
```

**Error codes:**

| Code | Meaning |
|------|---------|
| `PERM_DENIED` | Capability not declared in SKILL.yaml |
| `PERM_NOT_APPROVED` | User has not approved this permission |
| `PERM_RATE_LIMIT` | Rate limit exceeded for this capability |
| `PERM_SUSPENDED` | Skill suspended due to repeated violations |

### 3.2 Event Bus

The Event Bus is the primary communication channel between the Agent shell, Skills, and lifecycle hooks.

**Event types:**

```typescript
type AgentEvent =
  | { type: 'agent.wake';        payload: { timestamp: number } }
  | { type: 'agent.sleep';       payload: { timestamp: number } }
  | { type: 'route.start';       payload: RouteStartPayload }
  | { type: 'route.end';         payload: RouteEndPayload }
  | { type: 'verify.triggered';  payload: VerifyPayload }
  | { type: 'panic.activated';   payload: PanicPayload }
  | { type: 'tier.changed';      payload: TierChangePayload }
  | { type: 'skill.message';     payload: { from: string; body: unknown } }
  | { type: 'inbox.message';     payload: InboxPayload }
```

**Bus guarantees:**
- Events are delivered to all subscribers within 200ms on-device
- Event order within a type is FIFO
- No event crosses skill sandbox boundaries without Gateway mediation
- `panic.activated` events bypass all rate limits and are delivered synchronously

### 3.3 Channel Router

The Channel Router manages all outbound communication (HTTP, BLE, NFC) and all inbound responses.

**HTTP routing:**

Skills with `http:domain/path/*` permissions can only reach the declared domain and path prefix. The router:
1. Validates the target URL against declared permission patterns (glob match)
2. Injects the worker's platform API key if the target matches a platform domain
3. Enforces a default 10s timeout (overridable up to 30s with `long_request: true`)
4. Strips cookies and sets `X-OpenBag-Skill: <skill-name>` on all outbound requests

**BLE routing:**

Skills with `ble:scan` receive filtered beacon events. Only beacon frames matching the OpenBag MAGIC `0x4F424147` (spec 07) are forwarded. Raw BLE frames are never exposed to skills.

### 3.4 Hardware Abstraction Layer (HAL)

The HAL provides a uniform API over the physical hardware regardless of platform (Android/iOS/embedded).

```typescript
interface GatewayHAL {
  // BLE
  ble: {
    startScan(filter: BLEFilter): AsyncIterator<BLEAdvertisement>;
    stopScan(): void;
    advertise(payload: Uint8Array, intervalMs: number): void;
    stopAdvertise(): void;
    pairHardware(deviceId: string): Promise<PairedDevice>;
  };

  // NFC
  nfc: {
    read(): Promise<NFCRecord[]>;
    write(records: NFCRecord[]): Promise<void>;
  };

  // Location
  location: {
    getGeohash(precision: 5 | 7 | 'exact'): Promise<string | GeolocationCoordinates>;
  };

  // Camera
  camera: {
    scanQR(): Promise<string>;
    capturePhoto(): Promise<Blob>;
  };

  // Biometric
  biometric: {
    verify(reason: string): Promise<boolean>;
  };
}
```

### 3.5 Encrypted Local Store

All persistent skill data is stored in a shared SQLCipher database, partitioned by skill namespace. Skills access storage only through the Gateway — they never hold the encryption key.

**Key derivation:**

```
master_key = PBKDF2(device_secret + worker_DID, salt, 310000 iterations, SHA-256)
skill_key  = HKDF(master_key, info="openbag-skill-" + skill_name, 32 bytes)
```

**Storage API:**

```typescript
interface GatewayStorage {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
  transaction(ops: StorageOp[]): Promise<void>;
}
```

**Constraints:**
- Max 10 MB per skill namespace
- All keys are UTF-8 strings ≤ 256 bytes
- Values are JSON-serializable (or Uint8Array for binary blobs)
- Write operations are atomic; no partial writes on crash

### 3.6 IPC Broker

Skills can call other installed skills via the IPC Broker. The calling skill must declare `ipc:skill-<target-name>` in its permissions.

```typescript
interface GatewayIPC {
  call(target: string, method: string, params: unknown): Promise<unknown>;
  emit(target: string, event: string, payload: unknown): Promise<void>;
}
```

IPC calls are mediated: the Gateway checks that both caller and callee are installed, active, and that the caller has the `ipc:skill-<target>` permission. The callee receives the call in its own sandbox with no access to the caller's memory.

---

## 4. Lifecycle Hook Dispatch

When an Agent event fires, the Gateway dispatches to all skills that have registered the corresponding hook:

```
Agent event fires
      │
      ▼
Gateway looks up all skills with matching hook entry in SKILL.yaml
      │
      ▼
For each skill (parallel):
  load script at hooks.<hook_name> path
  create isolated execution context
  inject gateway proxy (permission-scoped)
  call exported function with (context, event.payload)
  await result with timeout (5s default, 30s for on_install/on_uninstall)
      │ TIMEOUT → log, continue (non-blocking hooks)
      │ ERROR   → log, mark skill as unhealthy if 3+ consecutive failures
      ▼
Aggregate results, fire completion event on bus
```

**Hook timeout table:**

| Hook | Timeout | Blocking |
|------|---------|----------|
| `on_install` | 30s | Yes |
| `on_first_run` | 30s | Yes |
| `on_uninstall` | 30s | Yes |
| `on_wake` | 5s | No |
| `on_verify` | 10s | Yes |
| `on_panic` | 2s | Yes (synchronous) |
| `on_route_start` | 5s | No |
| `on_route_end` | 5s | No |
| `on_tier_change` | 5s | No |

---

## 5. Audit Log

Every permission check, IPC call, and hook dispatch is written to a tamper-evident append-only audit log stored in SQLCipher.

**Log entry schema:**

```typescript
interface AuditEntry {
  id:         string;    // UUID v4
  ts:         number;    // Unix ms
  skill:      string;    // skill-name
  action:     'permission_check' | 'ipc_call' | 'hook_dispatch' | 'violation';
  capability: string;    // e.g. "ble:scan"
  result:     'allowed' | 'denied' | 'rate_limited' | 'error';
  detail?:    string;
}
```

Log entries older than 90 days are pruned automatically. Workers may export their audit log at any time (Art. 18 LGPD portability right).

---

## 6. Security Considerations

### Sandbox Escape Prevention
- Hermes/V8 isolates with `--no-expose-wasm` and `--jitless` flags where available
- No `require()` / `import()` from skill code — only gateway proxy APIs
- `process`, `global`, `__dirname` are masked in skill contexts

### DoS Protection
- Each skill is allocated max 20% CPU (enforced by scheduler)
- Memory cap: 32 MB per skill context
- `on_wake` hooks fire at most every 60 seconds per skill
- HTTP requests: max 10 concurrent, max 1 MB response body

### Kill Switch
- Gateway checks Gov.br Seal API `/kill-switch` endpoint on each agent wake
- If a skill is listed in the kill-switch response, it is immediately suspended and flagged for reinstallation

---

## 7. Implementation Notes

- **React Native target**: Gateway is implemented as a native module exposing a JSI bridge
- **Flutter target**: Gateway is a platform channel with Dart bindings
- **Embedded target** (OpenBag Hardware v1): Gateway runs as a RTOS task on the nRF5340
- Reference implementation: `sdk/gateway/` (planned Q3 2026)

---

## References

- [Spec 02 — Agent](02-agent.md)
- [Spec 03 — Skills](03-skills.md)
- [Spec 07 — BLE Beacon](07-ble-beacon.md)
- [Spec 09 — ClawHub-BR](09-clawhub-br.md)
- [LGPD Analysis](../docs/LGPD-analysis.md)
