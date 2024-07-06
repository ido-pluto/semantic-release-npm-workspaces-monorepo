import ScanPublishOrder from './scan-publish-order.js';
import path from 'path';
import UpdatePackages from './update-packages.js';
import {SETTINGS} from '../settings.js';
import npmWhich from 'npm-which';
import {promisify} from 'util';
import {execSync} from 'child_process';

const npmWhichPromise = promisify(npmWhich(process.cwd()));

export default class PublishPackages {
    private _packageScanner: ScanPublishOrder;

    public async scan() {
        this._packageScanner = new ScanPublishOrder();
        await this._packageScanner.scan();
    }

    public async loopPackages() {
        const bin = await npmWhichPromise(SETTINGS.semanticReleaseBin) as string;

        let index = 0;
        for (const packagePath of this._packageScanner.packagesOrderPath) {
            const packageJsonPath = path.join(packagePath, 'package.json');

            const packageUpdater = new UpdatePackages(packageJsonPath, this._packageScanner.packageOrder);
            await PublishPackages._updatePackageJson(packageUpdater);
            await PublishPackages._publishPackage(packagePath, bin);
            await packageUpdater.restoreOriginalPackageJson();
        }
    }

    private static async _updatePackageJson(packageUpdater: UpdatePackages) {
        await packageUpdater.updateDeps();

        packageUpdater.packageContent.release = {
            ...SETTINGS.release,
            tagFormat: SETTINGS.tagFormat.replace('${name}', packageUpdater.packageContent.name)
        };

        await packageUpdater.savePackageJson();
    }

    private static async _publishPackage(packagePath: string, exec: string) {
        console.log(`\n\nRunning semantic release: ${packagePath}\n`);

        const command = [exec].concat(SETTINGS.semanticReleaseBinArgs).join(' ');
        execSync(command, {
            stdio: 'inherit',
            cwd: packagePath
        });
    }
}
