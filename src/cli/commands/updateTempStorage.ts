import { CommandModule } from 'yargs';
import { readCacheStorage, writeCacheStorage } from '../../storage.js';
import path from 'path';
import fs from 'fs/promises';

type UpdateCacheVersion = {
    name: string;
    version: string;
};

export const UpdateCacheVersionCommand: CommandModule<object, UpdateCacheVersion> = {
    command: "cache [version] <name>",
    describe: "Update the version cache for a package",
    builder(yargs) {
        return yargs
            .positional('version', {
                type: 'string',
                describe: 'The new version of the package',
                demandOption: true
            })
            .option('name', {
                type: 'string',
                describe: 'The name of the package to update, default to the name in the package json of the cwd',
                demandOption: true
            });
    },
    handler: updateCacheVersion,
};

export async function updateCacheVersion({ name, version }: UpdateCacheVersion) {
    const cache = await readCacheStorage();

    if (!name) {
        const packageJSON = path.join(process.cwd(), 'package.json');
        try {
            const packageJSONContent = await fs.readFile(packageJSON, 'utf-8').then(JSON.parse);
            name = packageJSONContent.name;
        } catch {
            throw new Error(`Name is required when not in a package directory`);
        }
    }

    cache[name] = version;

    await writeCacheStorage(cache);
    console.log(`Updated cache for ${name} to ${version}`);
}
