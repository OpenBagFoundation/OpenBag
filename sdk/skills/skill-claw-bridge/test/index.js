'use strict';

const skill = require('../index.js');

const mockContext = {
  storage: (() => {
    const store = {};
    return {
      get: async (k) => store[k] || null,
      set: async (k, v) => { store[k] = v; },
    };
  })(),
  notifications: { local: async () => {} },
  agent: {
    did: 'did:openbag:worker:test123',
    getReputationTier: async () => ({ level: 'prata', label: 'Prata' }),
    writeReputationEvent: async () => {},
    issueVerifiableCredential: async (payload) => ({
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'OpenBagCivicTierCredential'],
      credentialSubject: payload.credentialSubject,
      proof: { type: 'Ed25519Signature2020', proofValue: 'TEST_ONLY' },
    }),
  },
  event: { previous_tier: 'bronze', new_tier: 'prata' },
};

async function run() {
  console.log('Testing skill-claw-bridge...');

  await skill.onInstall(mockContext);
  const state = await mockContext.storage.get('bridge_state');
  console.assert(state !== null, 'bridge_state should be initialised');
  console.assert(state.openclaw_vc === null, 'openclaw_vc should start null');
  console.log('  ✓ on_install initialises bridge state');

  await skill.onFirstRun(mockContext);
  console.log('  ✓ on_first_run fires without error');

  // on_wake with no VC should be a no-op
  await skill.onWake(mockContext);
  console.log('  ✓ on_wake no-ops when no OpenClaw VC present');

  // Inject a mock OpenClaw VC and test sync
  await mockContext.storage.set('bridge_state', {
    ...state,
    openclaw_vc: {
      credentialSubject: { level: 'forager' },
    },
  });
  await skill.onWake(mockContext);
  console.log('  ✓ on_wake syncs tier when OpenClaw VC present');

  // Test tier change export
  const result = await skill.onTierChange(mockContext);
  console.assert(result.exported_vc, 'should export a VC on tier change');
  console.assert(
    result.exported_vc.credentialSubject.openbag_tier === 'prata',
    'exported VC should contain new tier'
  );
  console.log('  ✓ on_tier_change exports updated VC');

  console.log('\nAll tests passed. ✅');
}

run().catch((err) => { console.error(err); process.exit(1); });
