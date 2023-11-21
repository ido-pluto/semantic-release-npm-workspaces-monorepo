import fs from 'fs/promises';
import {PackageDependencies, PackageJSON} from '../types.js';
import {SETTINGS} from '../settings.js';
import fetchRetry from 'fetch-retry';

const nodeFetchWithRetry = fetchRetry(fetch);

const FETCH_RETRY_OPTIONS = {
    retries: 3,
    retryDelay: 1000
};

export default class UpdatePackages {
    private _originalPackageContent: PackageJSON;
    public packageContent: PackageJSON;


    /**
     * Update versions of organization packages in `dependencies` and `devDependencies` objects
     */
    public constructor(private _packagePath: string, private _packages: string[]) {
    }

    /**
     * Update versions of organization packages in `dependencies` like object
     */
    private async _updateVersions(data: PackageDependencies = {}) {
        for (const key in data) {
            if (this._packages.includes(key)) {
                const newVersion = await UpdatePackages.getLatestVersion(key);
                data[key] = SETTINGS.versionTemplate.replace('${version}', newVersion);
            }
        }
    }

    private async _readPackageJson() {
        this._originalPackageContent = await fs.readFile(this._packagePath, 'utf-8').then(JSON.parse);
        this.packageContent = structuredClone(this._originalPackageContent);
    }

    public async savePackageJson(content = this.packageContent) {
        await fs.writeFile(this._packagePath, JSON.stringify(content, null, 2));
    }

    public async restoreOriginalPackageJson() {
        await this.savePackageJson(this._originalPackageContent);
    }

    public async updateDeps() {
        await this._readPackageJson();
        await this._updateVersions(this.packageContent.dependencies);
        await this._updateVersions(this.packageContent.devDependencies);
    }

    /**
     * Get the latest version of package from npm registry
     */
    public static async getLatestVersion(packageName: string): Promise<string> {
        const packageSearch = await nodeFetchWithRetry(`${SETTINGS.registry}/-/v1/search?text=${packageName}&size=1`, FETCH_RETRY_OPTIONS);
        const packageSearchJson = await packageSearch.json();
        return packageSearchJson.objects[0].package.version;
    }
}
