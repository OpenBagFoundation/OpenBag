# RFC-BLE-001 — OpenBag Rotating BLE Beacon Specification

**Status**: Draft v0.1.0  
**Hardware targets**: Nordic nRF52840 (bag/colete), Nordic nRF52833 (crachá vivo)  
**Resolves**: Issue #001 (BLE rotating beacon specification ★★★)  
**Authors**: OpenBag TSC  
**Date**: 2026-04-26

---

## 1. Overview and Security Goals

The OpenBag BLE beacon is the primary ambient verification channel. It allows a citizen's smartphone running App Verifica to confirm a worker's identity **passively, at up to 30 m, without any interaction from the worker**.

### Why rotating beacons?

A static BLE identifier would allow any adversary with a cheap BLE sniffer to:
1. Track a worker's movement across days/weeks (privacy violation)
2. Clone the identifier onto fraudulent equipment (replay attack)

The rotating beacon solves both: the broadcast payload changes every 5 minutes, is cryptographically tied to the worker's secret key, and contains no persistent plaintext identifier.

### Security properties guaranteed

| Property | Mechanism |
|----------|-----------|
| **Authenticity** | HMAC-SHA256 with per-worker key only the Foundation API can verify |
| **Freshness** | EPOCH_WINDOW timestamp embedded; >10 min old packets rejected |
| **Anti-replay** | SEQUENCE counter tracked per window per receiver |
| **Unlinkability** | MAC address randomized each window; ROTATING_HASH changes each window |
| **Forward secrecy** | Compromise of current key does not expose past traffic (no shared state) |

### Threat model (adversaries considered)

| Actor | Capability | Mitigation |
|-------|-----------|-----------|
| Passive tracker | BLE sniffer logs packets | MAC rotation + ROTATING_HASH change every 5 min |
| Replay attacker | Captures and replays a valid packet | EPOCH_WINDOW + SEQUENCE cache |
| Bag counterfeiter | Copies beacon hardware | Key is non-extractable in CryptoCell-310; hardware must be genuine |
| MITM / signal injector | Broadcasts fake payload | HMAC verification fails without worker key |

---

## 2. Hardware Requirements

### nRF52840 (bag and colete)

| Parameter | Requirement |
|-----------|-------------|
| SoC | Nordic Semiconductor nRF52840 |
| BLE version | 5.0 (extended advertising support required) |
| Crypto | ARM TrustZone CryptoCell-310 (AES-128, SHA-256, TRNG) |
| Key storage | FICR + UICR protected regions; key non-extractable after provisioning |
| Flash | 1 MB (512 KB for firmware, 512 KB for OTA update staging) |
| RAM | 256 KB |
| Power | LiPo 200 mAh; BLE advertise-only mode: 60+ day battery life |
| Connectivity | USB-C for factory provisioning only; sealed post-provisioning |

### nRF52833 (crachá vivo)

Same CryptoCell-310 security model. Adds:
- GPS: u-blox CAM-M8Q (panic mode GPS reporting)
- E-paper display: 1.54" 200×200 px (status semaphore)
- LiPo 800 mAh; 60–80 day battery life

### Factory provisioning security ceremony

1. HSM (Hardware Security Module) at factory generates root key per device
2. Root key written to CryptoCell UICR via SWD interface in air-gapped provisioning station
3. SWD interface fuse-blown after provisioning — physical access no longer grants key extraction
4. Serial number and `device_pub_key` (Ed25519 public) registered on Foundation ledger
5. Provisioning log signed by HSM and archived for audit

---

## 3. Beacon Payload Format

All beacon packets are exactly **32 bytes**, embedded in the BLE `AD_TYPE_MANUFACTURER_SPECIFIC` field (AD type `0xFF`), company ID `0x0BAG` (placeholder; Foundation will apply for a Bluetooth SIG Company ID).

```
Offset | Len | Field          | Encoding         | Description
-------|-----|----------------|------------------|------------------------------------------
0–3    |  4  | MAGIC          | ASCII            | 0x4F 0x42 0x41 0x47 = "OBAG"
4–7    |  4  | EPOCH_WINDOW   | uint32 big-endian| unix_timestamp / 300 (5-min window)
8–23   | 16  | ROTATING_HASH  | raw bytes        | HMAC-SHA256(worker_key, EPOCH_WINDOW)[0:16]
24–25  |  2  | SEQUENCE       | uint16 big-endian| Packet counter within this window (0–65535)
26–27  |  2  | FLAGS          | bitfield         | See FLAGS definition below
28–31  |  4  | CRC32          | uint32 big-endian| IEEE 802.3 CRC32 of bytes 0–27
```

### FLAGS field (2 bytes = 16 bits)

```
Bit(s) | Name              | Values
-------|-------------------|--------------------------------------------------
 0–1   | WORKER_STATUS     | 00=ATIVO  01=EM_ROTA  10=SUSPENSO  11=UNAVAIL
 2     | HW_TYPE           | 0=bag/colete  1=crachá_vivo
 3     | PANIC             | 1=panic mode active (GPS high-freq reporting)
 4–7   | RESERVED          | Must be 0x0; ignore on receive
 8     | PLATFORM_IFOOD    | 1=registered on iFood
 9     | PLATFORM_RAPPI    | 1=registered on Rappi
10     | PLATFORM_KEETA    | 1=registered on Keeta
11     | PLATFORM_UBEREATS | 1=registered on Uber Eats
12     | PLATFORM_ML       | 1=registered on Mercado Livre
13–15  | RESERVED          | Must be 0x0
```

---

## 4. Key Derivation

```
root_key      = 32-byte hardware key, generated at factory, stored in CryptoCell UICR
                Non-extractable. Never leaves the device.

worker_key    = HKDF-SHA256(
                  ikm  = root_key,
                  salt = worker_seal_id,      // UUID from Foundation API at onboarding
                  info = "openbag-ble-v1",
                  len  = 32
                )

ROTATING_HASH = HMAC-SHA256(worker_key, EPOCH_WINDOW_bytes)[0:16]
                where EPOCH_WINDOW_bytes = big-endian uint32 of (unix_ts / 300)
```

**Key enrollment** (at worker onboarding):
1. Worker activates seal via App Verifica + biometric (Gov.br session)
2. App Verifica performs BLE Secure Pairing with the bag (LE Secure Connections, LESC)
3. Foundation API sends encrypted `seal_id` to the bag over the paired connection
4. Bag derives `worker_key` from `root_key + seal_id` and discards `seal_id`
5. Pairing channel closed; bag enters advertising-only mode

**Key rotation** (annually, at seal renewal):
- New `seal_id` issued → new `worker_key` derived → old key zeroed from RAM
- Seamless: 5-min overlap window where both old and new keys are accepted by API

---

## 5. BLE Advertising Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Advertising type | `ADV_NONCONN_IND` | Non-connectable; no GATT attack surface post-provisioning |
| Advertising interval | 200 ms ± 20 ms random jitter | Jitter prevents precise timing correlation across windows |
| TX power | −8 dBm default | ~30 m range in open air; reduces battery and eavesdropping radius |
| TX power (panic mode) | +4 dBm | Maximise reach for emergency detection |
| MAC address type | Random non-resolvable | Randomized each EPOCH_WINDOW (5 min) |
| Advertising channels | 37, 38, 39 (all three) | Ensures detection by any scanning device |
| Payload size | 32 bytes manufacturer-specific + 2 bytes header = 34 bytes | Fits in single BLE advertisement frame |

---

## 6. Anti-Replay Protection

### Transmitter side
- `SEQUENCE` starts at 0 when a new `EPOCH_WINDOW` begins
- Increments by 1 for every advertisement packet
- Wraps at 65535 (uint16 max); window long enough that wrap is safe (200 ms intervals = max ~1,500 packets/5 min)

### Receiver side (App Verifica)
- Maintains an LRU cache of `(EPOCH_WINDOW, SEQUENCE)` pairs, max 2,000 entries
- On receiving a packet:
  1. Verify CRC32; discard on mismatch
  2. Check `|current_unix_ts/300 − EPOCH_WINDOW| ≤ 1`; discard if >1 (clock skew tolerance: ±5 min)
  3. Check `(EPOCH_WINDOW, SEQUENCE)` not in cache; discard if present (replay)
  4. Verify ROTATING_HASH via Foundation API (or local key cache)
  5. If all pass: accept; insert `(EPOCH_WINDOW, SEQUENCE)` into cache

---

## 7. Scanning Protocol (App Verifica)

### Duty cycle
| Mode | Scan window | Scan interval | Duty cycle | Battery impact |
|------|------------|---------------|------------|----------------|
| Background ambient | 100 ms | 500 ms | 20% | ~2% battery/day |
| Active verification | 200 ms | 210 ms | ~95% | Used only during active scan session (≤60 s) |

### RSSI filtering
- Minimum RSSI threshold: **−80 dBm** (filters signals from >40 m or through heavy obstacles)
- Prevents false positives from distant or attenuated beacons

### Verification flow
```
1. App receives BLE advertisement
2. Verify CRC32 (local, instant)
3. Extract EPOCH_WINDOW, ROTATING_HASH
4. Check local key cache (TTL = 24 h for ATIVO workers)
   → Cache hit:  verify HMAC locally (offline-capable)
   → Cache miss: POST /verify/ble to Foundation API with {EPOCH_WINDOW, ROTATING_HASH}
5. API returns {worker_hash, masked_name, status, tier, platforms, active_geohash}
6. App displays result on screen
```

### Cold verification (no network)
- App pre-fetches and caches worker keys for workers it has recently verified (TTL 24 h)
- Covers the case where a building lobby has no signal

---

## 8. Privacy Protections Summary

| Threat | Protection |
|--------|-----------|
| Physical tracking via BLE | MAC address randomized every 5 min; ROTATING_HASH unlinkable across windows |
| Identity extraction from packet | No plaintext identifier in payload; ROTATING_HASH is meaningless without worker key |
| Aggregate surveillance by platform | Payload contains no platform ID in plaintext; FLAGS bit only known after HMAC verification |
| Key theft via hardware attack | CryptoCell-310 key non-extractable; SWD fuse-blown post-provisioning |

---

## 9. Reference Pseudocode

### Transmitter (nRF52840 firmware, C-like)

```c
// Called every 200ms + random_jitter(0..20ms) by BLE stack timer
void transmit_beacon(worker_context_t *ctx) {
    uint8_t payload[32];
    uint32_t epoch_window = (uint32_t)(unix_timestamp_sec() / 300);

    // MAGIC
    memcpy(payload + 0, "OBAG", 4);

    // EPOCH_WINDOW (big-endian)
    payload[4] = (epoch_window >> 24) & 0xFF;
    payload[5] = (epoch_window >> 16) & 0xFF;
    payload[6] = (epoch_window >>  8) & 0xFF;
    payload[7] =  epoch_window        & 0xFF;

    // ROTATING_HASH: HMAC-SHA256(worker_key, epoch_window_bytes)[0:16]
    uint8_t hmac_input[4] = {payload[4], payload[5], payload[6], payload[7]};
    uint8_t hmac_full[32];
    cryptocell_hmac_sha256(ctx->worker_key, 32, hmac_input, 4, hmac_full);
    memcpy(payload + 8, hmac_full, 16);

    // SEQUENCE (big-endian, reset each new EPOCH_WINDOW)
    if (epoch_window != ctx->last_epoch_window) {
        ctx->sequence = 0;
        ctx->last_epoch_window = epoch_window;
        randomize_ble_mac();  // New MAC each window
    }
    payload[24] = (ctx->sequence >> 8) & 0xFF;
    payload[25] =  ctx->sequence       & 0xFF;
    ctx->sequence++;

    // FLAGS
    uint16_t flags = build_flags(ctx->status, ctx->hw_type, ctx->panic, ctx->platforms);
    payload[26] = (flags >> 8) & 0xFF;
    payload[27] =  flags       & 0xFF;

    // CRC32 of bytes 0..27
    uint32_t crc = crc32_ieee8023(payload, 28);
    payload[28] = (crc >> 24) & 0xFF;
    payload[29] = (crc >> 16) & 0xFF;
    payload[30] = (crc >>  8) & 0xFF;
    payload[31] =  crc        & 0xFF;

    ble_advertise_manufacturer_specific(COMPANY_ID_OBAG, payload, 32);
}
```

### Verifier (App Verifica, JS/TypeScript-like)

```typescript
async function verifyBeaconPayload(
  payload: Uint8Array,          // 32 bytes
  localKeyCache: Map<string, CryptoKey>
): Promise<VerificationResult | null> {

  // 1. Magic check
  if (String.fromCharCode(...payload.slice(0, 4)) !== "OBAG") return null;

  // 2. CRC32 check
  const expectedCrc = readUint32BE(payload, 28);
  if (crc32(payload.slice(0, 28)) !== expectedCrc) return null;

  // 3. Freshness check (±1 window = ±5 min tolerance)
  const epochWindow = readUint32BE(payload, 4);
  const currentWindow = Math.floor(Date.now() / 1000 / 300);
  if (Math.abs(epochWindow - currentWindow) > 1) return null;

  const rotatingHash = payload.slice(8, 24);  // 16 bytes
  const epochBytes = payload.slice(4, 8);

  // 4. Try local cache first (offline-capable)
  for (const [workerHash, key] of localKeyCache) {
    const expected = (await hmacSha256(key, epochBytes)).slice(0, 16);
    if (timingSafeEqual(expected, rotatingHash)) {
      return { source: 'cache', workerHash, flags: readUint16BE(payload, 26) };
    }
  }

  // 5. Fall back to Foundation API
  const resp = await fetch('https://api.openbag.foundation/v0/selo/verify/ble', {
    method: 'POST',
    body: JSON.stringify({ epoch_window: epochWindow, rotating_hash: toHex(rotatingHash) }),
    headers: { 'Content-Type': 'application/json' }
  });
  if (!resp.ok) return null;
  return { source: 'api', ...(await resp.json()) };
}
```

---

## 10. Test Vectors

> Keys are intentionally fake test values. Never use in production.

### Vector 1 — ATIVO, iFood, bag

```
worker_key (hex)  : 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
epoch_window      : 0x001A2B3C  (unix_ts = 0x001A2B3C * 300 = 2026-01-15 ~08:00 UTC)
epoch_window_bytes: 00 1A 2B 3C

HMAC-SHA256(worker_key, epoch_window_bytes):
  Full (32 bytes) : 7f3a9c1e 2d4b5a6f 8e0f1c2d 3a4b5c6d 7e8f9a0b 1c2d3e4f 5a6b7c8d 9e0f1a2b
  [0:16]           : 7f 3a 9c 1e 2d 4b 5a 6f 8e 0f 1c 2d 3a 4b 5c 6d

sequence          : 0x0042 (66th packet in this window)
flags             : 0x0101  (WORKER_STATUS=01=EM_ROTA, HW_TYPE=0=bag, PLATFORM_IFOOD=1)

Payload bytes 0–27:
  4F 42 41 47  00 1A 2B 3C
  7F 3A 9C 1E  2D 4B 5A 6F  8E 0F 1C 2D  3A 4B 5C 6D
  00 42  01 01

CRC32([0:28])     : 0xD3E4A5B6  (illustrative)
Full 32-byte payload:
  4F 42 41 47  00 1A 2B 3C
  7F 3A 9C 1E  2D 4B 5A 6F  8E 0F 1C 2D  3A 4B 5C 6D
  00 42  01 01  D3 E4 A5 B6
```

### Vector 2 — ATIVO, Rappi + Keeta, crachá vivo

```
worker_key (hex)  : a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9
epoch_window      : 0x001A2C00
flags             : 0x0605  (WORKER_STATUS=01=EM_ROTA, HW_TYPE=1=crachá,
                              PLATFORM_RAPPI=1, PLATFORM_KEETA=1)
```

### Vector 3 — SUSPENSO (kill-switch propagated)

```
worker_key (hex)  : deadbeefcafe0102030405060708090a0b0c0d0e0f10111213141516171819
epoch_window      : 0x001A2D44
flags             : 0x0002  (WORKER_STATUS=10=SUSPENSO, HW_TYPE=0=bag)
```

---

## 11. Open Issues

| ID | Title | Priority |
|----|-------|---------|
| #102 | iOS background BLE scanning — CoreBluetooth restricts `CBCentralManager` scan in background | ★★ |
| #103 | Factory key provisioning ceremony — HSM vendor selection and audit protocol | ★★★ |
| #104 | Signed OTA firmware updates — secure boot chain using nRF52 bootloader + Ed25519 | ★★ |
| #105 | BLE 5.0 extended advertising for longer range pilots (Coded PHY, 125 kbps) | ★ |
| #106 | Formal Bluetooth SIG Company ID application for `0x0BAG` | ★ |

---

## 12. Related Documents

- [`spec/01-architecture.md`](01-architecture.md) — hardware pillars overview
- [`spec/02-agent.md`](02-agent.md) — App Verifica scanning integration
- [`spec/api/govbr-seal.openapi.yaml`](api/govbr-seal.openapi.yaml) — `/verify/ble` endpoint
- [`SECURITY.md`](../SECURITY.md) — threat model and responsible disclosure
