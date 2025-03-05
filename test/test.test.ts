import { describe, it, expect } from 'vitest';
import UpdatePackages from '../src/package-utils/update-packages';
import semver from 'semver';
import { SETTINGS } from '../src/settings';

describe('UpdatePackages', () => {
  it('should return latest version for current branch', async () => {
    const latestVersion = await UpdatePackages.getLatestVersion('typescript');
    expect(semver.valid(latestVersion)).toBeTruthy();
    expect(semver.prerelease(latestVersion)).toBeNull();
  });

  it('should return latest version for beta branch', async () => {
    SETTINGS.release.branches = ['main', { name: 'beta', channel: 'beta', prerelease: 'beta' }] as any;
    const latestVersion = await UpdatePackages.getLatestVersion('typescript', 'beta');
    expect(semver.valid(latestVersion)).toBeTruthy();
    expect(semver.prerelease(latestVersion)).not.toBeNull();
    expect(semver.prerelease(latestVersion)?.[0]).toBe('beta');
  });

  it('should return latest stable version for beta branch when beta version is not available', async () => {
    SETTINGS.release.branches = ['main', { name: 'beta', channel: 'beta', prerelease: 'beta' }] as any;
    const latestVersion = await UpdatePackages.getLatestVersion('lodash', 'beta');
    expect(semver.valid(latestVersion)).toBeTruthy();
    expect(semver.prerelease(latestVersion)).toBeNull();
    console.log(latestVersion);
  });

  it('should return latest version for beta branch', async () => {
    SETTINGS.release.branches = ['main'];
    const latestVersion = await UpdatePackages.getLatestVersion('typescript', 'beta');
    expect(semver.valid(latestVersion)).toBeTruthy();
    expect(semver.prerelease(latestVersion)).toBeNull();
  });

});
