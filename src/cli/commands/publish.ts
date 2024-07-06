import { CommandModule } from 'yargs';
import { importSettings } from '../../settings.js';
import PublishPackages from '../../package-utils/publish-packages.js';

export const PublishCommand: CommandModule<object> = {
    command: "$0",
    describe: "Run semantic-release on the monorepo",
    handler: publishMonorepo,
};

export async function publishMonorepo() {
    await importSettings();

    const publish = new PublishPackages();
    await publish.scan();
    await publish.loopPackages();
}
