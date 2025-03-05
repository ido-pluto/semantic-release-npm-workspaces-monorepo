import fs from 'fs/promises';
import { PackageDependencies, PackageJSON } from '../types.js';
import { SETTINGS } from '../settings.js';
import fetchRetry from 'fetch-retry';
import { readCacheStorage } from '../storage.js';
import semver from "semver";
import simpleGit from 'simple-git';
import { BranchObject } from 'semantic-release';

const nodeFetchWithRetry = fetchRetry(fetch);

const FETCH_RETRY_OPTIONS = {
    retries: 3,
    retryDelay: 1000
};

export default class UpdatePackages {
    private _originalPackageContent: PackageJSON;
    private _cacheCurrentBranch: string;
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
                const { version, isPrerelease } = await this.getLatestVersion(key);
                data[key] = this.useVersionTemplate(data[key], version, isPrerelease);
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
     * Get the latest version of package from cache or npm registry
     */
    public async getLatestVersion(packageName: string): Promise<{ version: string, isPrerelease: boolean; }> {
        const cache = await readCacheStorage();
        const cacheVersion = cache[packageName];

        const branchInfo = await this.findBranchInfo();
        const isPrereleaseChannel = Boolean(branchInfo?.prerelease);

        if (cacheVersion) {
            console.log('Cache version for', packageName, 'is', cacheVersion);
            return {
                version: cacheVersion,
                isPrerelease: isPrereleaseChannel
            };
        } else {
            console.log('Cache version for', packageName, 'is not found');
        }

        try {
            const packageSearch = await nodeFetchWithRetry(`${SETTINGS.registry}/${packageName}`, FETCH_RETRY_OPTIONS);
            const packageSearchJson = await packageSearch.json();
            const versions = packageSearchJson["dist-tags"];

            const template = typeof branchInfo?.prerelease === 'string' ? branchInfo.prerelease: (branchInfo?.channel || '');
            const channelNameReplaced = template.replaceAll('${name}', branchInfo?.name || '') || branchInfo?.name || '';

            if (isPrereleaseChannel) {
                const prereleaseVersion = versions[channelNameReplaced];
                if (prereleaseVersion) {
                    return {
                        version: prereleaseVersion,
                        isPrerelease: true
                    };
                }
            }

            return {
                version: versions[channelNameReplaced] ?? versions.latest,
                isPrerelease: false
            };
        } catch (error) {
            console.error(`Failed to get version from NPM for ${packageName}: ${error.message}`);
            return {
                version: '0.0.1',
                isPrerelease: false
            };
        }
    }

    public useVersionTemplate(templateVersion: string, toVersion: string, isPrerelease = false) {
        if (isPrerelease && SETTINGS.preReleaseVersionTemplate) {
            return SETTINGS.preReleaseVersionTemplate.replace('${version}', toVersion);
        }

        const originalVersion = (semver.coerce(templateVersion, { includePrerelease: true }) || templateVersion).toString();
        return templateVersion.replace(originalVersion, toVersion);
    }

    async findBranchInfo(): Promise<BranchObject | null> {
        const branch = this._cacheCurrentBranch ??= (await simpleGit.default().branch()).current;
        return SETTINGS.release.branches.find(x => typeof x === 'object' && x.name === branch) as (BranchObject | null);
    }
}
