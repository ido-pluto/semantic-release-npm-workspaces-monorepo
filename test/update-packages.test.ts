import {beforeAll, describe, expect, it} from 'vitest';
import UpdatePackages from '../src/package-utils/update-packages.js';
import semver from 'semver';
import {SETTINGS} from '../src/settings.js';

describe('UpdatePackages', () => {
    beforeAll(() => {
        SETTINGS.release.branches = ['main', {name: 'beta', channel: 'beta', prerelease: 'beta'}];
    });

    it('latest version for current branch', async () => {
        UpdatePackages._cacheCurrentBranch = 'main';
        const latestVersion = await UpdatePackages.getLatestVersion('typescript');
        expect(semver.valid(latestVersion.version)).toBeTruthy();
        expect(semver.prerelease(latestVersion.version)).toBeNull();
    });

    it('latest version for beta branch', async () => {
        UpdatePackages._cacheCurrentBranch = 'beta';
        const latestVersion = await UpdatePackages.getLatestVersion('typescript');
        expect(latestVersion.isPrerelease).toBeTruthy();
        expect(semver.valid(latestVersion.version)).toBeTruthy();
        expect(semver.prerelease(latestVersion.version)).not.toBeNull();
        expect(semver.prerelease(latestVersion.version)?.[0]).toBe('beta');
    });

    it('latest version for beta branch - no beta dist-tags', async () => {
        UpdatePackages._cacheCurrentBranch = 'beta';
        const latestVersion = await UpdatePackages.getLatestVersion('lodash');
        expect(latestVersion.isPrerelease).toBeFalsy();
        expect(semver.valid(latestVersion.version)).toBeTruthy();
        expect(semver.prerelease(latestVersion.version)).toBeNull();
    });

    it('latest version for beta branch - no beta configuration', async () => {
        UpdatePackages._cacheCurrentBranch = 'beta';
        SETTINGS.release.branches = ['main'];
        const latestVersion = await UpdatePackages.getLatestVersion('typescript');
        expect(latestVersion.isPrerelease).toBeFalsy();
        expect(semver.valid(latestVersion.version)).toBeTruthy();
        expect(semver.prerelease(latestVersion.version)).toBeNull();
    });
});
