import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

async function exportFiles(): Promise<void> {
  const wasmFileName = 'connect_four.wasm';
  const zkeyFileNAme = 'proving_key.zkey';
  const publicPath = join(__dirname, '../..', 'apps', 'web', 'public', 'zk');

  const wasmData = readFileSync(
    join(__dirname, '..', 'build', 'connect_four_js', wasmFileName)
  );
  const keyData = readFileSync(join(__dirname, '..', 'build', zkeyFileNAme));

  if (!existsSync(publicPath)) {
    mkdirSync(publicPath, { recursive: true });
  }

  writeFileSync(join(publicPath, wasmFileName), wasmData as any);
  writeFileSync(join(publicPath, zkeyFileNAme), keyData as any);

  console.log(
    `${wasmFileName} and ${zkeyFileNAme} have been exported to ${publicPath}.`
  );
}

exportFiles()
  .then(() => {})
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
