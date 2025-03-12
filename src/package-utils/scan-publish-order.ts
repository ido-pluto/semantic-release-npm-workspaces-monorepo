import fs from 'fs/promises';
import {PackageJSON} from '../types.js';
import {SETTINGS} from '../settings.js';
import {glob} from 'glob';

type PackageContentMap = {
  [packagePath: string]: PackageJSON;
};

export default class ScanPublishOrder {
  private _packageContentMap: PackageContentMap = {};

  /**
   * Package name by dependency order
   */
  private _packageOrder: string[] = [];

  public get packageOrder(): string[] {
    return [...this._packageOrder];
  }

  /**
   * Packages paths by dependency order
   */
  public get packagesOrderPath(): string[] {
    const entries = Object.entries(this._packageContentMap);
    return this._packageOrder.map(packageName => {
      const packageFound = entries.find(
        ([, packageContent]) => packageContent.name === packageName,
      );
      return packageFound[0];
    });
  }

  public constructor(private _scanLocations = SETTINGS.workspaces) {}

  private async _readAllPackages() {
    const locations = this._scanLocations.map(location => {
      if (location.at(-1) !== '/') {
        location += '/';
      }

      location += 'package.json';
      return location;
    });

    const packages = await glob(locations, {
      ignore: '**/node_modules/**',
      nodir: true,
      stat: true,
      withFileTypes: true,
    });

    for (const packageJsonState of packages) {
      if (!packageJsonState.isFile()) continue;
      const packagePath = packageJsonState.parent.fullpath();

      try {
        this._packageContentMap[packagePath] = await fs
          .readFile(packageJsonState.fullpath(), 'utf-8')
          .then(JSON.parse);
      } catch (error) {
        console.warn(`Skipping package at ${packagePath}: ${error.message}`);
      }
    }
  }

  private async _orderByDependencies() {
    let somethingChanged = true;

    while (somethingChanged) {
      somethingChanged = false;
      for (const content of Object.values(this._packageContentMap)) {
        if (this._packageOrder.includes(content.name)) {
          continue;
        }

        if (this._checkOkToBeNextInOrder(content.dependencies)) {
          this._packageOrder.push(content.name);
          somethingChanged = true;
        }
      }
    }
  }

  /**
   * Check if all package dependencies already in order
   */
  private _checkOkToBeNextInOrder(dependencies = {}) {
    const monorepoIncludesDeps = Object.values(this._packageContentMap).map(
      x => x.name,
    );
    for (const [key] of Object.entries(dependencies)) {
      if (
        monorepoIncludesDeps.includes(key) &&
        !this._packageOrder.includes(key)
      ) {
        return false;
      }
    }
    return true;
  }

  private _assertMissingPackages() {
    const missingPackages = Object.values(this._packageContentMap).filter(
      content => !this._packageOrder.includes(content.name),
    );
    if (missingPackages.length) {
      throw new Error(
        `Missing packages: ${missingPackages.map(content => content.name).join(', ')}, probably circular dependencies`,
      );
    }
  }

  public async scan() {
    await this._readAllPackages();
    await this._orderByDependencies();
    this._assertMissingPackages();
  }
}
