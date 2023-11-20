#!/usr/bin/env node

import {importSettings} from './settings.js';
import PublishPackages from './package-utils/publish-packages.js';

async function main() {
    await importSettings();

    const publish = new PublishPackages();
    await publish.scan();
    await publish.loopPackages();
}

await main();


