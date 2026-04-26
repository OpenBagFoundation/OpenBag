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
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function ok(msg) {
  console.log(chalk.green('✔') + ' ' + msg);
}

function info(msg) {
  console.log(chalk.cyan('ℹ') + ' ' + msg);
}

function warn(msg) {
  console.log(chalk.yellow('⚠') + ' ' + msg);
}

function fail(msg) {
  console.error(chalk.red('✖') + ' ' + msg);
}

function die(msg, code = 1) {
  fail(msg);
  process.exit(code);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// CLI root
// ──────────────────────────────────────────────────────────────────────────────

program
  .name('openbag')
  .description('OpenBag Skill CLI — create, validate, test, and publish skills')
  .version('0.1.0');

// ──────────────────────────────────────────────────────────────────────────────
// openbag skill  (subcommand group)
// ──────────────────────────────────────────────────────────────────────────────

const skill = program.command('skill').description('Manage OpenBag skills');

// ─── skill init ───────────────────────────────────────────────────────────────

skill
  .command('init')
  .description('Interactive wizard to scaffold a new skill directory')
  .option('-d, --dir <path>', 'Target directory (default: current directory)', '.')
  .action(async (opts) => {
    console.log(chalk.bold('\nOpenBag Skill — Init Wizard\n'));

    let answers;
    try {
      answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Skill name (e.g. skill-route):',
          validate: (v) => /^[a-z][a-z0-9-]*$/.test(v) || 'Use lowercase letters, numbers and hyphens only.',
        },
        {
          type: 'input',
          name: 'description',
          message: 'Short description:',
          validate: (v) => v.trim().length > 0 || 'Description is required.',
        },
        {
          type: 'input',
          name: 'author',
          message: 'Author (name or GitHub handle):',
          validate: (v) => v.trim().length > 0 || 'Author is required.',
        },
        {
          type: 'input',
          name: 'version',
          message: 'Initial version:',
          default: '0.1.0',
          validate: (v) => /^\d+\.\d+\.\d+/.test(v) || 'Use semantic versioning (e.g. 0.1.0).',
        },
        {
          type: 'checkbox',
          name: 'permissions',
          message: 'Permissions required by this skill (space to select):',
          choices: [
            { name: 'ble-scan     — scan for Bluetooth Low Energy devices', value: 'ble-scan' },
            { name: 'nfc-read     — read NFC tags', value: 'nfc-read' },
            { name: 'nfc-write    — write NFC tags', value: 'nfc-write' },
            { name: 'location     — access GPS/location data', value: 'location' },
            { name: 'notifications — send local notifications', value: 'notifications' },
            { name: 'network      — make outbound HTTP requests', value: 'network' },
          ],
        },
        {
          type: 'list',
          name: 'category',
          message: 'Skill category:',
          choices: ['core', 'community', 'experimental'],
          default: 'community',
        },
      ]);
    } catch (err) {
      // User cancelled (Ctrl+C)
      console.log('\nAborted.');
      process.exit(0);
    }

    const targetDir = path.resolve(opts.dir, answers.name);

    if (fs.existsSync(targetDir)) {
      die(`Directory already exists: ${targetDir}`);
    }

    // Build manifest
    const manifest = {
      apiVersion: 'openbag.org/v1alpha1',
      kind: 'Skill',
      metadata: {
        name: answers.name,
        version: answers.version,
        description: answers.description,
        author: answers.author,
        category: answers.category,
        license: 'MIT',
      },
      spec: {
        permissions: answers.permissions.length ? answers.permissions : [],
        entrypoint: 'index.js',
        hooks: {
          onInstall: null,
          onUninstall: null,
          onVerify: null,
        },
      },
    };

    // Scaffold directory structure
    ensureDir(targetDir);
    ensureDir(path.join(targetDir, 'test'));

    // SKILL.yaml
    fs.writeFileSync(
      path.join(targetDir, 'SKILL.yaml'),
      yaml.dump(manifest, { lineWidth: 100 })
    );

    // Minimal index.js stub
    const indexStub = `'use strict';
// ${answers.name} — ${answers.description}
// Author: ${answers.author}

module.exports = {
  async onVerify(context) {
    // TODO: implement verification logic
  },
};
`;
    fs.writeFileSync(path.join(targetDir, 'index.js'), indexStub);

    // test/index.js stub
    const testStub = `'use strict';
// Basic smoke test for ${answers.name}
const skill = require('../index.js');

async function run() {
  console.assert(typeof skill.onVerify === 'function', 'onVerify must be a function');
  console.log('All tests passed.');
}

run().catch((err) => { console.error(err); process.exit(1); });
`;
    fs.writeFileSync(path.join(targetDir, 'test', 'index.js'), testStub);

    // README stub
    const readmeStub = `# ${answers.name}

> ${answers.description}

**Author**: ${answers.author}
**Category**: ${answers.category}
**Permissions**: ${answers.permissions.length ? answers.permissions.join(', ') : 'none'}

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
    info(`Files created:\n  ${targetDir}/SKILL.yaml\n  ${targetDir}/index.js\n  ${targetDir}/test/index.js\n  ${targetDir}/README.md`);
    info(`Next steps:\n  cd ${targetDir}\n  openbag skill validate\n  openbag skill test`);
  });

// ─── skill validate ───────────────────────────────────────────────────────────

skill
  .command('validate')
  .description('Validate a SKILL.yaml manifest against the JSON schema')
  .option('-f, --file <path>', 'Path to SKILL.yaml', 'SKILL.yaml')
  .option('-s, --schema <path>', 'Path to JSON schema file',
    path.join(__dirname, '..', 'skill-manifest.schema.json'))
  .action((opts) => {
    const manifestPath = path.resolve(opts.file);

    // Load manifest
    if (!fs.existsSync(manifestPath)) {
      die(`Manifest not found: ${manifestPath}`);
    }

    let manifest;
    try {
      const raw = fs.readFileSync(manifestPath, 'utf8');
      manifest = yaml.load(raw);
    } catch (err) {
      die(`Failed to parse SKILL.yaml: ${err.message}`);
    }

    // Load schema
    if (!fs.existsSync(opts.schema)) {
      warn(`Schema not found at ${opts.schema} — skipping JSON Schema validation.`);
      info('Performing structural checks only...');

      // Minimal structural validation
      const required = ['apiVersion', 'kind', 'metadata', 'spec'];
      const missing = required.filter((k) => !(k in manifest));
      if (missing.length) {
        die(`Manifest is missing required top-level keys: ${missing.join(', ')}`);
      }
      const metaRequired = ['name', 'version', 'description', 'author'];
      const metaMissing = metaRequired.filter((k) => !(k in (manifest.metadata || {})));
      if (metaMissing.length) {
        die(`manifest.metadata is missing keys: ${metaMissing.join(', ')}`);
      }
      ok(`${manifestPath} — structural check passed (no schema file found for full validation)`);
      return;
    }

    let schema;
    try {
      schema = JSON.parse(fs.readFileSync(opts.schema, 'utf8'));
    } catch (err) {
      die(`Failed to parse schema: ${err.message}`);
    }

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(manifest);

    if (!valid) {
      fail(`${manifestPath} — validation FAILED`);
      (validate.errors || []).forEach((e) => {
        console.error(chalk.red('  ✖') + ` ${e.instancePath || '(root)'}: ${e.message}`);
      });
      process.exit(1);
    }

    ok(`${manifestPath} — valid`);
  });

// ─── skill test ───────────────────────────────────────────────────────────────

skill
  .command('test')
  .description('Run skill tests from the test/ directory')
  .option('-d, --dir <path>', 'Skill directory to test', '.')
  .action((opts) => {
    const skillDir = path.resolve(opts.dir);
    const testDir = path.join(skillDir, 'test');

    if (!fs.existsSync(testDir)) {
      die(`No test/ directory found in ${skillDir}`);
    }

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
    if (anyFailed) {
      die('One or more tests failed.');
    } else {
      ok('All tests passed.');
    }
  });

// ─── skill publish ────────────────────────────────────────────────────────────

skill
  .command('publish')
  .description('Publish a skill to the ClawHub-BR registry')
  .option('-f, --file <path>', 'Path to SKILL.yaml', 'SKILL.yaml')
  .action((opts) => {
    console.log(chalk.bold('\nOpenBag Skill — Publish to ClawHub-BR\n'));

    const manifestPath = path.resolve(opts.file);
    if (!fs.existsSync(manifestPath)) {
      die(`Manifest not found: ${manifestPath}`);
    }

    let manifest;
    try {
      manifest = yaml.load(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err) {
      die(`Failed to parse SKILL.yaml: ${err.message}`);
    }

    const name = manifest?.metadata?.name || '(unknown)';
    const version = manifest?.metadata?.version || '(unknown)';

    info(`Skill: ${chalk.bold(name)} @ ${version}`);

    console.log(`
${chalk.yellow('ClawHub-BR registry publishing is not yet automated.')}

To publish this skill manually:

  1. Fork the registry repository:
     ${chalk.cyan('https://github.com/openbag/clawhub-br')}

  2. Add your skill under ${chalk.bold(`registry/${name}/`)}:
       ${chalk.bold('SKILL.yaml')}   — the manifest you just validated
       ${chalk.bold('README.md')}    — usage documentation
       ${chalk.bold('index.js')}     — skill entrypoint

  3. Open a Pull Request with the title:
       ${chalk.bold(`[skill] add ${name} v${version}`)}

  4. A Foundation TSC member will review and merge within 5 business days.

For automated publishing (coming soon), you will need:
  - A ClawHub-BR API token (${chalk.cyan('https://clawhub-br.openbag.org/tokens')})
  - Set environment variable: ${chalk.bold('CLAWHUB_TOKEN=<your-token>')}
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
      info('No skills directory found. No skills installed yet.');
      info(`Skills are installed to: ${skillsDir}`);
      return;
    }

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory());

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

      const meta = manifest?.metadata || {};
      const version = meta.version || '?';
      const desc = meta.description || '';
      const category = meta.category || 'community';
      const categoryColor = category === 'core' ? chalk.blue : category === 'experimental' ? chalk.yellow : chalk.green;

      console.log(
        `  ${chalk.bold(entry.name.padEnd(24))}` +
        `${categoryColor(category.padEnd(14))}` +
        `v${version.padEnd(10)}` +
        `${desc}`
      );
      count++;
    }

    console.log('');
    ok(`${count} skill(s) listed.`);
  });

// ──────────────────────────────────────────────────────────────────────────────
// Parse
// ──────────────────────────────────────────────────────────────────────────────

program.parseAsync(process.argv).catch((err) => {
  fail(`Unexpected error: ${err.message}`);
  process.exit(1);
});
