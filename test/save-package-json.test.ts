import {describe, expect, it} from 'vitest';
import UpdatePackages from '../src/package-utils/update-packages.js';

const TAB_FIXTURE = `{
\t"name": "@scope/foo",
\t"version": "1.0.0",
\t"dependencies": {
\t\t"@scope/bar": "^1.0.0",
\t\t"three": "0.175.0 - 0.184.0"
\t},
\t"files": ["index.js", "lib/**/*"],
\t"release": {
\t\t"branches": ["main"],
\t\t"plugins": ["@semantic-release/npm"],
\t\t"tagFormat": "@scope/foo@\${version}"
\t}
}
`;

const TWO_SPACE_FIXTURE = `{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "^1.0.0"
  }
}
`;

describe('_buildPatchedPackageJson', () => {
  it('returns byte-identical text when nothing changed', () => {
    const original = JSON.parse(TAB_FIXTURE);
    const current = structuredClone(original);
    const out = UpdatePackages._buildPatchedPackageJson(
      TAB_FIXTURE,
      original,
      current,
    );
    expect(out).toBe(TAB_FIXTURE);
  });

  it('returns byte-identical text when release block is structurally equal but a new object reference', () => {
    const original = JSON.parse(TAB_FIXTURE);
    const current = structuredClone(original);
    current.release = {
      ...original.release,
      branches: [...original.release.branches],
      plugins: [...original.release.plugins],
    };
    const out = UpdatePackages._buildPatchedPackageJson(
      TAB_FIXTURE,
      original,
      current,
    );
    expect(out).toBe(TAB_FIXTURE);
  });

  it('updates only the changed dep version, preserving tabs and inline arrays', () => {
    const original = JSON.parse(TAB_FIXTURE);
    const current = structuredClone(original);
    current.dependencies['@scope/bar'] = '^1.2.3';
    const out = UpdatePackages._buildPatchedPackageJson(
      TAB_FIXTURE,
      original,
      current,
    );
    expect(out).toContain('\t\t"@scope/bar": "^1.2.3"');
    expect(out).toContain('\t"files": ["index.js", "lib/**/*"]');
    expect(out).toContain('\t"version": "1.0.0"');
    expect(out).not.toContain('  "name"');
    expect(out.endsWith('\n')).toBe(true);
  });

  it('replaces the release block when its content differs but keeps tabs elsewhere', () => {
    const original = JSON.parse(TAB_FIXTURE);
    const current = structuredClone(original);
    current.release.tagFormat = 'foo@${version}';
    const out = UpdatePackages._buildPatchedPackageJson(
      TAB_FIXTURE,
      original,
      current,
    );
    expect(out).toContain('"tagFormat": "foo@${version}"');
    expect(out).toContain('\t"name": "@scope/foo"');
    expect(out).toContain('\t"files": ["index.js", "lib/**/*"]');
  });

  it('uses two-space indent when the original file used two spaces', () => {
    const original = JSON.parse(TWO_SPACE_FIXTURE);
    const current = structuredClone(original);
    current.dependencies.bar = '^2.0.0';
    const out = UpdatePackages._buildPatchedPackageJson(
      TWO_SPACE_FIXTURE,
      original,
      current,
    );
    expect(out).toContain('  "bar": "^2.0.0"');
    expect(out).not.toContain('\t');
  });

  it('uses four-space indent when the original file used four spaces', () => {
    const fixture = `{
    "name": "foo",
    "version": "1.0.0",
    "dependencies": {
        "bar": "^1.0.0"
    },
    "release": {
        "branches": ["main"]
    }
}
`;
    const original = JSON.parse(fixture);
    const current = structuredClone(original);
    current.dependencies.bar = '^2.0.0';
    current.release = {branches: ['main', 'beta']};
    const out = UpdatePackages._buildPatchedPackageJson(
      fixture,
      original,
      current,
    );
    expect(out).toContain('        "bar": "^2.0.0"');
    expect(out).not.toContain('\t');
    // Newly emitted release block should also use 4-space indent
    expect(out).toMatch(/\n {4}"release": \{\n {8}"branches":/);
  });

  it('preserves the original key order', () => {
    const original = JSON.parse(TAB_FIXTURE);
    const current = structuredClone(original);
    current.dependencies['@scope/bar'] = '^9.9.9';
    current.release.tagFormat = 'foo@${version}';
    const out = UpdatePackages._buildPatchedPackageJson(
      TAB_FIXTURE,
      original,
      current,
    );
    const order = ['name', 'version', 'dependencies', 'files', 'release'];
    let prev = -1;
    for (const key of order) {
      const idx = out.indexOf(`"${key}"`);
      expect(idx, `${key} should appear after ${order[order.indexOf(key) - 1] ?? 'start'}`).toBeGreaterThan(prev);
      prev = idx;
    }
  });
});
