import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

async function exportFiles(): Promise<void> {
  const wasmFileName = 'connect-four.wasm';
  const zkeyFileNAme = 'proving-key.zkey';
  const publicPath = join(__dirname, '../..', 'web', 'public', 'zk');

  const wasmData = readFileSync(join(__dirname, '..', 'build', 'connect-four_js', wasmFileName));
  const keyData = readFileSync(join(__dirname, '..', 'build', zkeyFileNAme));

  if (!existsSync(publicPath)) {
    mkdirSync(publicPath, { recursive: true });
  }

  writeFileSync(join(publicPath, wasmFileName), wasmData);
  writeFileSync(join(publicPath, zkeyFileNAme), keyData);

  console.log(`${wasmFileName} and ${zkeyFileNAme} have been exported to ${publicPath}.`);
}

exportFiles()
  .then(() => {})
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
