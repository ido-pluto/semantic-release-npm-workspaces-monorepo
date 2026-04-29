import ScanPublishOrder from './scan-publish-order.js';
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
    const bin = (await npmWhichPromise(SETTINGS.semanticReleaseBin)) as string;

    for (const packagePath of this._packageScanner.packagesOrderPath) {
      const packageUpdater = new UpdatePackages(
        packagePath,
        this._packageScanner.packageOrder,
      );

      if (packageUpdater.settings.skip) {
        console.log(`Skipping package: ${packagePath}`);
        continue;
      }

      await PublishPackages._updatePackageJson(packageUpdater);
      await PublishPackages._publishPackage(
        packagePath,
        bin,
        packageUpdater.settings,
      );
      await packageUpdater.restoreOriginalPackageJson();
    }
  }

  private static async _updatePackageJson(packageUpdater: UpdatePackages) {
    await packageUpdater.updateDeps();

    packageUpdater.packageContent.release = {
      ...packageUpdater.settings.release,
      tagFormat: packageUpdater.settings.tagFormat.replace(
        '${name}',
        packageUpdater.packageContent.name,
      ),
    };

    await packageUpdater.savePackageJson();
  }

  private static async _publishPackage(
    packagePath: string,
    exec: string,
    settings = SETTINGS,
  ) {
    console.log(`\n\nRunning semantic release: ${packagePath}\n`);

    const command = [exec].concat(settings.semanticReleaseBinArgs).join(' ');
    execSync(command, {
      stdio: 'inherit',
      cwd: packagePath,
    });
  }
}
