import { build } from 'esbuild';
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const outDir = process.argv.includes('--playground')
  ? resolve(root, 'playground/public/interactivity')
  : resolve(root, 'dist/interactivity');

mkdirSync(outDir, { recursive: true });

const blockLibBase = resolve(
  root,
  'node_modules/@wordpress/block-library/build-module'
);

const blockEntries = [
  resolve(blockLibBase, 'accordion/view.mjs'),
  resolve(blockLibBase, 'image/view.mjs'),
  resolve(blockLibBase, 'tabs/view.mjs'),
  resolve(blockLibBase, 'file/view.mjs'),
];

const entryFile = resolve(outDir, '_entry.mjs');

async function main() {
  console.log(`Building interactivity bundle to ${outDir}`);

  const imports = blockEntries
    .map((entry) => `import ${JSON.stringify(entry)};`)
    .join('\n');
  writeFileSync(entryFile, imports, 'utf8');

  try {
    await build({
      entryPoints: [entryFile],
      bundle: true,
      format: 'esm',
      target: 'es2022',
      minify: true,
      outfile: resolve(outDir, 'interactivity.js'),
      define: { 'globalThis.SCRIPT_DEBUG': 'false' },
      ignoreAnnotations: true,
    });
    console.log('  interactivity.js');
  } finally {
    unlinkSync(entryFile);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
