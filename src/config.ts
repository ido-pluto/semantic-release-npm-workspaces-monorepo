import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs/promises';
import os from 'os';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJSONPath = path.join(dirname, '..', 'package.json');
export const packageJSON = JSON.parse(
  await fs.readFile(packageJSONPath, 'utf-8'),
);

export const cacheStoragePath = path.join(
  os.tmpdir(),
  `${packageJSON.name}-cache-versions.json`,
);
