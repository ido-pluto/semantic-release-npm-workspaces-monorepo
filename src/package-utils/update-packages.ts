import fs from 'fs/promises';
import {PackageDependencies, PackageJSON} from '../types.js';
import {generatePackageSettings, SETTINGS} from '../settings.js';
import fetchRetry from 'fetch-retry';
import {readCacheStorage} from '../storage.js';
import semver from 'semver';
import * as simpleGit from 'simple-git';
import {BranchObject} from 'semantic-release';
import micromatch from 'micromatch';
import path from 'path';

const nodeFetchWithRetry = fetchRetry(fetch);

const FETCH_RETRY_OPTIONS = {
  retries: 3,
  retryDelay: 1000,
};

export default class UpdatePackages {
  /**
   * @internal
   */
  static _cacheCurrentBranch: string;
  private _originalPackageContent: PackageJSON;
  private readonly _packageJSONPath: string;
  public readonly settings: typeof SETTINGS;
  public packageContent: PackageJSON;

  /**
   * Update versions of organization packages in `dependencies` and `devDependencies` objects
   */
  public constructor(
    packagePath: string,
    private _packages: string[],
  ) {
    this._packageJSONPath = path.join(packagePath, 'package.json');

    const relativePath = path.relative(process.cwd(), packagePath);
    this.settings = generatePackageSettings(relativePath);
  }

  /**
   * Update versions of organization packages in `dependencies` like object
   */
  private async _updateVersions(data: PackageDependencies = {}) {
    for (const key in data) {
      if (this._packages.includes(key)) {
        const {version, isPrerelease} = await UpdatePackages.getLatestVersion(
          key,
          this.settings,
        );
        data[key] = this.useVersionTemplate(data[key], version, isPrerelease);
      }
    }
  }

  private async _readPackageJson() {
    this._originalPackageContent = await fs
      .readFile(this._packageJSONPath, 'utf-8')
      .then(JSON.parse);
    this.packageContent = structuredClone(this._originalPackageContent);
  }

  public async savePackageJson(content = this.packageContent) {
    await fs.writeFile(this._packageJSONPath, JSON.stringify(content, null, 2));
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
  public static async getLatestVersion(
    packageName: string,
    settings = SETTINGS,
  ): Promise<{version: string; isPrerelease: boolean}> {
    const cache = await readCacheStorage();
    const cacheVersion = cache[packageName];

    const branchInfo = await this.findBranchInfo(settings);
    const isPrereleaseChannel = Boolean(branchInfo?.prerelease);

    if (cacheVersion) {
      console.log('Cache version for', packageName, 'is', cacheVersion);
      return {
        version: cacheVersion,
        isPrerelease: isPrereleaseChannel,
      };
    } else {
      console.log('Cache version for', packageName, 'is not found');
    }

    try {
      const packageSearch = await nodeFetchWithRetry(
        `${settings.registry}/${packageName}`,
        FETCH_RETRY_OPTIONS,
      );
      const packageSearchJson = await packageSearch.json();
      const versions = packageSearchJson['dist-tags'];

      const template =
        typeof branchInfo?.prerelease === 'string'
          ? branchInfo.prerelease
          : branchInfo?.channel || '';
      const channelNameReplaced =
        template.replaceAll('${name}', branchInfo?.name || '') ||
        branchInfo?.name ||
        '';

      if (isPrereleaseChannel) {
        const prereleaseVersion = versions[channelNameReplaced];
        if (prereleaseVersion) {
          return {
            version: prereleaseVersion,
            isPrerelease: true,
          };
        }
      }

      return {
        version: versions[channelNameReplaced] ?? versions.latest,
        isPrerelease: false,
      };
    } catch (error) {
      console.error(
        `Failed to get version from NPM for ${packageName}: ${error.message}`,
      );
      return {
        version: '0.0.1',
        isPrerelease: false,
      };
    }
  }

  public useVersionTemplate(
    templateVersion: string,
    toVersion: string,
    isPrerelease = false,
  ) {
    if (isPrerelease && this.settings.preReleaseVersionTemplate) {
      return this.settings.preReleaseVersionTemplate.replace(
        '${version}',
        toVersion,
      );
    }

    const originalVersion = (
      semver.coerce(templateVersion, {includePrerelease: true}) ||
      templateVersion
    ).toString();
    return templateVersion.replace(originalVersion, toVersion);
  }

  static async findBranchInfo(
    settings = SETTINGS,
  ): Promise<BranchObject | null> {
    const ciBranch =
      process.env.CI_COMMIT_BRANCH ||
      process.env.GITHUB_REF_NAME ||
      process.env.CIRCLE_BRANCH ||
      process.env.TRAVIS_BRANCH ||
      process.env.BITBUCKET_BRANCH;
    const branch = (this._cacheCurrentBranch ??=
      ciBranch || (await simpleGit.simpleGit().branch()).current);
    return settings.release.branches.find(
      x => typeof x === 'object' && micromatch.isMatch(branch, x.name),
    ) as BranchObject | null;
  }
}
