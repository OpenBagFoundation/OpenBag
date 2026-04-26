#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ──────────────────────────────────────────────────────────────────────────────
// Constants — OpenClaw-aligned permission scopes and lifecycle hooks
// ──────────────────────────────────────────────────────────────────────────────

const PERMISSION_CHOICES = [
  { name: 'read:reputation_tier    — read worker reputation tier', value: 'read:reputation_tier' },
  { name: 'read:platform_list      — read platform affiliations', value: 'read:platform_list' },
  { name: 'read:status_current     — read current worker status', value: 'read:status_current' },
  { name: 'read:academy_progress   — read Academy learning progress', value: 'read:academy_progress' },
  { name: 'read:rewards_balance    — read rewards/points balance', value: 'read:rewards_balance' },
  { name: 'read:route_current      — read active delivery route', value: 'read:route_current' },
  { name: 'write:agent_inbox       — write messages to agent inbox', value: 'write:agent_inbox' },
  { name: 'write:reputation_event  — emit reputation events', value: 'write:reputation_event' },
  { name: 'write:route_event       — emit route lifecycle events', value: 'write:route_event' },
  { name: 'write:academy_event     — emit Academy completion events', value: 'write:academy_event' },
  { name: 'ble:scan                — scan for BLE devices (beacon detection)', value: 'ble:scan' },
  { name: 'ble:advertise           — advertise BLE beacon', value: 'ble:advertise' },
  { name: 'ble:pair_hardware       — pair with OpenBag hardware (NFC bag/e-paper)', value: 'ble:pair_hardware' },
  { name: 'nfc:read                — read NFC tags', value: 'nfc:read' },
  { name: 'nfc:write               — write NFC tags', value: 'nfc:write' },
  { name: 'location:geohash5       — location at ~5km precision (city-level)', value: 'location:geohash5' },
  { name: 'location:geohash7       — location at ~150m precision (neighborhood)', value: 'location:geohash7' },
  { name: 'location:exact          — exact GPS coordinates', value: 'location:exact' },
  { name: 'notifications:local     — local push notifications', value: 'notifications:local' },
  { name: 'notifications:push      — remote push notifications', value: 'notifications:push' },
  { name: 'storage:encrypted_local — encrypted SQLCipher local store', value: 'storage:encrypted_local' },
  { name: 'biometric:verify        — device biometric confirmation (FaceID/fingerprint)', value: 'biometric:verify' },
  { name: 'camera:qr_only          — camera access for QR scanning only', value: 'camera:qr_only' },
  { name: 'camera:photo            — full camera photo access', value: 'camera:photo' },
];

const HOOK_DESCRIPTIONS = {
  on_install:    'Runs once after install (setup, DB migration)',
  on_first_run:  'Runs on first agent boot after install (onboarding)',
  on_uninstall:  'Runs before removal (cleanup local state)',
  on_wake:       'Runs each time the agent wakes (periodic heartbeat)',
  on_verify:     'Runs when a citizen triggers a verification event',
  on_panic:      'Runs when panic mode is activated (core-sensitive only)',
  on_route_start:'Runs when worker starts a delivery route',
  on_route_end:  'Runs when worker ends a delivery route',
  on_tier_change:'Runs when worker reputation tier changes',
};

const HOOK_CHOICES = Object.entries(HOOK_DESCRIPTIONS).map(([k, v]) => ({
  name: `${k.padEnd(18)} — ${v}`,
  value: k,
}));

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function ok(msg)   { console.log(chalk.green('✔') + ' ' + msg); }
function info(msg) { console.log(chalk.cyan('ℹ') + ' ' + msg); }
function warn(msg) { console.log(chalk.yellow('⚠') + ' ' + msg); }
function fail(msg) { console.error(chalk.red('✖') + ' ' + msg); }

function die(msg, code = 1) {
  fail(msg);
  process.exit(code);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function loadManifest(filePath) {
  if (!fs.existsSync(filePath)) die(`Manifest not found: ${filePath}`);
  try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    die(`Failed to parse SKILL.yaml: ${err.message}`);
  }
}

function loadSchema(schemaPath) {
  if (!fs.existsSync(schemaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  } catch (err) {
    die(`Failed to parse schema: ${err.message}`);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// CLI root
// ──────────────────────────────────────────────────────────────────────────────

program
  .name('openbag')
  .description('OpenBag Skill CLI — create, validate, test, and publish skills')
  .version('0.2.0');

const skill = program.command('skill').description('Manage OpenBag skills');

// ─── skill init ───────────────────────────────────────────────────────────────

skill
  .command('init')
  .description('Interactive wizard to scaffold a new skill directory (OpenClaw SKILL.yaml format)')
  .option('-d, --dir <path>', 'Target directory (default: current directory)', '.')
  .action(async (opts) => {
    console.log(chalk.bold('\nOpenBag Skill — Init Wizard (OpenClaw format)\n'));

    let answers;
    try {
      answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Skill identifier (must start with "skill-", e.g. skill-route):',
          validate: (v) => /^skill-[a-z0-9][a-z0-9-]{1,40}$/.test(v)
            || 'Must match: skill-[a-z0-9][a-z0-9-]{1,40}',
        },
        {
          type: 'input',
          name: 'display_name',
          message: 'Display name (human-readable, max 60 chars):',
          validate: (v) => (v.trim().length > 0 && v.length <= 60) || 'Required, max 60 chars.',
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description (20–600 chars, shown in ClawHub-BR):',
          validate: (v) => (v.trim().length >= 20 && v.length <= 600)
            || 'Must be 20–600 characters.',
        },
        {
          type: 'input',
          name: 'author_name',
          message: 'Author name:',
          validate: (v) => v.trim().length > 0 || 'Required.',
        },
        {
          type: 'input',
          name: 'author_email',
          message: 'Author email:',
          validate: (v) => /^.+@.+$/.test(v.trim()) || 'Enter a valid email.',
        },
        {
          type: 'input',
          name: 'version',
          message: 'Initial version:',
          default: '0.1.0',
          validate: (v) => /^\d+\.\d+\.\d+/.test(v) || 'Use semver (e.g. 0.1.0).',
        },
        {
          type: 'list',
          name: 'license',
          message: 'License (SPDX):',
          choices: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'MPL-2.0', 'AGPL-3.0-or-later', 'GPL-3.0-or-later'],
          default: 'MIT',
        },
        {
          type: 'list',
          name: 'category',
          message: 'Category:',
          choices: [
            { name: 'community    — published on ClawHub-BR', value: 'community' },
            { name: 'experimental — early-stage / unstable', value: 'experimental' },
            { name: 'core         — Foundation-maintained (requires TSC approval)', value: 'core' },
          ],
          default: 'community',
        },
        {
          type: 'list',
          name: 'maturity',
          message: 'Maturity level:',
          choices: ['alpha', 'beta', 'stable'],
          default: 'alpha',
        },
        {
          type: 'checkbox',
          name: 'permissions',
          message: 'Permissions required (space to select, principle of least privilege):',
          choices: PERMISSION_CHOICES,
        },
        {
          type: 'checkbox',
          name: 'hooks',
          message: 'Lifecycle hooks to implement (space to select):',
          choices: HOOK_CHOICES,
        },
        {
          type: 'input',
          name: 'docs',
          message: 'Documentation URL (leave blank to skip):',
        },
        {
          type: 'input',
          name: 'repository',
          message: 'Repository URL (leave blank to skip):',
        },
      ]);
    } catch {
      console.log('\nAborted.');
      process.exit(0);
    }

    const targetDir = path.resolve(opts.dir, answers.name);
    if (fs.existsSync(targetDir)) die(`Directory already exists: ${targetDir}`);

    // Build flat OpenClaw-aligned manifest
    const hooksObj = {};
    for (const h of (answers.hooks || [])) {
      hooksObj[h] = `scripts/${h}.js`;
    }

    const manifest = {
      name: answers.name,
      version: answers.version,
      license: answers.license,
      authors: [`${answers.author_name} <${answers.author_email}>`],
      display_name: answers.display_name,
      description: answers.description,
      category: answers.category,
      maturity: answers.maturity,
      permissions: answers.permissions || [],
      dependencies: { agent: '>= 0.5.0' },
      hooks: Object.keys(hooksObj).length ? hooksObj : undefined,
    };

    if (answers.docs) manifest.docs = answers.docs;
    if (answers.repository) manifest.repository = answers.repository;

    // Scaffold
    ensureDir(targetDir);
    ensureDir(path.join(targetDir, 'test'));
    if (answers.hooks && answers.hooks.length) {
      ensureDir(path.join(targetDir, 'scripts'));
    }

    // SKILL.yaml
    fs.writeFileSync(
      path.join(targetDir, 'SKILL.yaml'),
      yaml.dump(manifest, { lineWidth: 100, noRefs: true })
    );

    // Hook stubs
    for (const h of (answers.hooks || [])) {
      const stub = `'use strict';
// Hook: ${h} — ${HOOK_DESCRIPTIONS[h]}
module.exports = async function ${h.replace(/_([a-z])/g, (_, c) => c.toUpperCase())}(context) {
  // TODO: implement ${h} logic
};
`;
      fs.writeFileSync(path.join(targetDir, 'scripts', `${h}.js`), stub);
    }

    // index.js stub
    const indexStub = `'use strict';
// ${answers.name} — ${answers.display_name}
module.exports = {
${(answers.hooks || []).map(h => `  ${h.replace(/_([a-z])/g, (_, c) => c.toUpperCase())}: require('./scripts/${h}.js'),`).join('\n')}
};
`;
    fs.writeFileSync(path.join(targetDir, 'index.js'), indexStub);

    // test stub
    const testStub = `'use strict';
const skill = require('../index.js');

async function run() {
  // TODO: add tests for ${answers.name}
  console.log('Smoke test passed.');
}

run().catch((err) => { console.error(err); process.exit(1); });
`;
    fs.writeFileSync(path.join(targetDir, 'test', 'index.js'), testStub);

    // README stub
    const permsDisplay = answers.permissions.length ? answers.permissions.join('\n- ') : 'none';
    const readmeStub = `# ${answers.display_name}

> ${answers.description}

**Skill ID**: \`${answers.name}\`
**Category**: ${answers.category} | **Maturity**: ${answers.maturity}
**License**: ${answers.license}

## Permissions

- ${permsDisplay}

## Installation

\`\`\`
openbag skill install ${answers.name}
\`\`\`

## Usage

<!-- describe how this skill works -->
`;
    fs.writeFileSync(path.join(targetDir, 'README.md'), readmeStub);

    console.log('');
    ok(`Skill scaffolded at ${chalk.bold(targetDir)}`);
    info(`Next steps:\n  cd ${targetDir}\n  openbag skill validate\n  openbag skill test`);
  });

// ─── skill validate ───────────────────────────────────────────────────────────

skill
  .command('validate')
  .description('Validate SKILL.yaml against the OpenClaw-aligned JSON schema')
  .option('-f, --file <path>', 'Path to SKILL.yaml', 'SKILL.yaml')
  .option('-s, --schema <path>', 'Path to JSON schema',
    path.join(__dirname, '..', 'skill-manifest.schema.json'))
  .action((opts) => {
    const manifestPath = path.resolve(opts.file);
    const manifest = loadManifest(manifestPath);
    const schema = loadSchema(opts.schema);

    if (!schema) {
      warn(`Schema not found at ${opts.schema} — performing structural check only.`);
      const required = ['name', 'version', 'license', 'description', 'category', 'permissions'];
      const missing = required.filter((k) => !(k in manifest));
      if (missing.length) die(`Missing required fields: ${missing.join(', ')}`);
      ok(`${manifestPath} — structural check passed`);
      return;
    }

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    if (!validate(manifest)) {
      fail(`${manifestPath} — validation FAILED`);
      (validate.errors || []).forEach((e) => {
        console.error(chalk.red('  ✖') + ` ${e.instancePath || '(root)'}: ${e.message}`);
      });
      process.exit(1);
    }

    ok(`${manifestPath} — valid`);

    // Semantic warnings
    if (manifest.category === 'community' && !manifest.docs) {
      warn('community skills should include a docs URL (docs: https://...)');
    }
    if (manifest.category === 'core' && !manifest.audit_url) {
      warn('core skills must include audit_url for TSC review');
    }
    const hardwareWrite = (manifest.permissions || []).filter(p =>
      p.startsWith('ble:advertise') || p.startsWith('nfc:write') || p.startsWith('ble:pair_hardware')
    );
    if (hardwareWrite.length && manifest.category === 'community') {
      warn(`Hardware write permissions (${hardwareWrite.join(', ')}) require extra review for community skills`);
    }
    if (manifest.maturity === 'stable' && manifest.category !== 'core') {
      info('stable maturity on a community skill — consider submitting to core review');
    }
  });

// ─── skill test ───────────────────────────────────────────────────────────────

skill
  .command('test')
  .description('Run skill tests from the test/ directory')
  .option('-d, --dir <path>', 'Skill directory', '.')
  .action((opts) => {
    const skillDir = path.resolve(opts.dir);
    const testDir = path.join(skillDir, 'test');

    if (!fs.existsSync(testDir)) die(`No test/ directory found in ${skillDir}`);

    const testFiles = fs.readdirSync(testDir).filter((f) => f.endsWith('.js'));
    if (!testFiles.length) {
      warn('No .js test files found in test/');
      process.exit(0);
    }

    info(`Running ${testFiles.length} test file(s) from ${testDir}\n`);

    const { execFileSync } = require('child_process');
    let anyFailed = false;

    for (const file of testFiles) {
      const filePath = path.join(testDir, file);
      process.stdout.write(chalk.bold(`  ${file} `));
      try {
        execFileSync(process.execPath, [filePath], { stdio: 'inherit', cwd: skillDir });
        ok('passed');
      } catch {
        fail('FAILED');
        anyFailed = true;
      }
    }

    console.log('');
    if (anyFailed) die('One or more tests failed.');
    else ok('All tests passed.');
  });

// ─── skill publish ────────────────────────────────────────────────────────────

skill
  .command('publish')
  .description('Publish a skill to the ClawHub-BR registry')
  .option('-f, --file <path>', 'Path to SKILL.yaml', 'SKILL.yaml')
  .option('-s, --schema <path>', 'Path to JSON schema',
    path.join(__dirname, '..', 'skill-manifest.schema.json'))
  .action((opts) => {
    console.log(chalk.bold('\nOpenBag Skill — Publish to ClawHub-BR\n'));

    const manifestPath = path.resolve(opts.file);
    const manifest = loadManifest(manifestPath);

    // Validate before publish
    const schema = loadSchema(opts.schema);
    if (schema) {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema);
      if (!validate(manifest)) {
        fail('Manifest validation failed — fix errors before publishing:');
        (validate.errors || []).forEach((e) => {
          console.error(chalk.red('  ✖') + ` ${e.instancePath || '(root)'}: ${e.message}`);
        });
        process.exit(1);
      }
      ok('Manifest valid');
    }

    const name = manifest.name || '(unknown)';
    const version = manifest.version || '(unknown)';
    const category = manifest.category || 'community';

    info(`Skill: ${chalk.bold(name)} @ ${version} [${category}]`);

    console.log(`
${chalk.yellow('ClawHub-BR registry publishing is not yet automated.')}

To publish this skill manually:

  1. Fork the registry:
     ${chalk.cyan('https://github.com/openbagfoundation/clawhub-br')}

  2. Add your skill under ${chalk.bold(`registry/${name}/`)}:
       ${chalk.bold('SKILL.yaml')}  — validated manifest
       ${chalk.bold('README.md')}   — usage documentation
       ${chalk.bold('index.js')}    — skill entrypoint (or entrypoint from manifest)

  3. Open a Pull Request titled:
       ${chalk.bold(`[skill] add ${name} v${version}`)}

  4. A Foundation TSC member reviews within 5 business days.
     core-sensitive skills require a public security audit URL.

For automated publishing (roadmap Q3):
  - Set env var: ${chalk.bold('CLAWHUB_TOKEN=<your-token>')}
  - Re-run: ${chalk.bold('openbag skill publish')}
`);
  });

// ─── skill list ───────────────────────────────────────────────────────────────

skill
  .command('list')
  .description('List skills installed under ~/.openbag/skills/')
  .action(() => {
    const skillsDir = path.join(os.homedir(), '.openbag', 'skills');

    if (!fs.existsSync(skillsDir)) {
      info('No skills directory found.');
      info(`Skills install path: ${skillsDir}`);
      return;
    }

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory());

    if (!entries.length) {
      info('No skills installed.');
      return;
    }

    console.log(chalk.bold(`\nInstalled skills (${skillsDir}):\n`));

    let count = 0;
    for (const entry of entries) {
      const manifestPath = path.join(skillsDir, entry.name, 'SKILL.yaml');
      if (!fs.existsSync(manifestPath)) {
        warn(`  ${entry.name}  — SKILL.yaml missing`);
        continue;
      }

      let manifest;
      try {
        manifest = yaml.load(fs.readFileSync(manifestPath, 'utf8'));
      } catch {
        warn(`  ${entry.name}  — failed to parse SKILL.yaml`);
        continue;
      }

      const version = manifest.version || '?';
      const category = manifest.category || 'community';
      const maturity = manifest.maturity || 'alpha';
      const displayName = manifest.display_name || manifest.name || entry.name;
      const catColor = category === 'core' ? chalk.blue
        : category === 'core-sensitive' ? chalk.red
        : category === 'experimental' ? chalk.yellow
        : chalk.green;
      const matColor = maturity === 'stable' ? chalk.green
        : maturity === 'beta' ? chalk.cyan
        : chalk.gray;

      console.log(
        `  ${chalk.bold((displayName).padEnd(28))}` +
        `${catColor(category.padEnd(16))}` +
        `${matColor(maturity.padEnd(10))}` +
        `v${version}`
      );
      count++;
    }

    console.log('');
    ok(`${count} skill(s) listed.`);
  });

// ─── skill info ───────────────────────────────────────────────────────────────

skill
  .command('info')
  .description('Show full details for a skill manifest')
  .option('-f, --file <path>', 'Path to SKILL.yaml', 'SKILL.yaml')
  .action((opts) => {
    const manifestPath = path.resolve(opts.file);
    const manifest = loadManifest(manifestPath);

    const name = manifest.name || '(unknown)';
    const displayName = manifest.display_name || name;
    const version = manifest.version || '?';
    const category = manifest.category || 'community';
    const maturity = manifest.maturity || 'alpha';

    console.log(chalk.bold(`\n${displayName}  (${name})\n`));
    console.log(`  Version:     ${version}`);
    console.log(`  Category:    ${category}`);
    console.log(`  Maturity:    ${maturity}`);
    console.log(`  License:     ${manifest.license || '?'}`);

    if (manifest.authors && manifest.authors.length) {
      console.log(`  Authors:     ${manifest.authors.join(', ')}`);
    }

    console.log(`\n  ${manifest.description || ''}`);

    if (manifest.permissions && manifest.permissions.length) {
      console.log(chalk.bold('\n  Permissions:'));
      manifest.permissions.forEach((p) => console.log(`    - ${p}`));
    } else {
      console.log('\n  Permissions: none');
    }

    if (manifest.hooks && Object.keys(manifest.hooks).length) {
      console.log(chalk.bold('\n  Hooks:'));
      Object.entries(manifest.hooks).forEach(([k, v]) => {
        console.log(`    ${k.padEnd(18)} → ${v || 'null'}`);
      });
    }

    if (manifest.dependencies) {
      console.log(chalk.bold('\n  Dependencies:'));
      if (manifest.dependencies.agent) {
        console.log(`    agent: ${manifest.dependencies.agent}`);
      }
      if (manifest.dependencies.skills) {
        Object.entries(manifest.dependencies.skills).forEach(([k, v]) => {
          console.log(`    ${k}: ${v}`);
        });
      }
    }

    if (manifest.docs) console.log(`\n  Docs:        ${manifest.docs}`);
    if (manifest.repository) console.log(`  Repository:  ${manifest.repository}`);
    if (manifest.audit_url) console.log(`  Audit:       ${manifest.audit_url}`);

    console.log('');
  });

// ──────────────────────────────────────────────────────────────────────────────
// Parse
// ──────────────────────────────────────────────────────────────────────────────

program.parseAsync(process.argv).catch((err) => {
  fail(`Unexpected error: ${err.message}`);
  process.exit(1);
});
