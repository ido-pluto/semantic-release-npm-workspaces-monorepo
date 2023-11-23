# Semantic Release with NPM Workspaces

Simplify the process of releasing a monorepo with npm workspaces.

Work with:

- Npm workspaces
- Bun workspaces
- Yarn workspaces
- Pnpm workspaces

> Only publish packages that changed.

# Installation

```bash
npm install --save-dev semantic-release-npm-workspaces-monorepo
```

# Usage

Add this to your `package.json` of your workspace root:

```json
{
  "workspaceRelease": {
    "npmRelease": true,
    "release": {
      // semantic-release configuration
    }
  },
  "scripts": {
    "release": "semantic-release-npm-workspaces-monorepo"
  }
}
```

The default configuration of this package is:

```js
settings = {
    versionTemplate: '^${version}',
    registry: 'https://registry.npmjs.org',
    workspace: path.join(process.cwd(), 'packages'),
    tagFormat: '${name}@${version}',
    release: {
        extends: 'semantic-release-commit-filter',
        ci: true,
        branches: [
            "main", "master"
        ],
        plugins: [...]
    },
    semanticReleaseBin: 'semantic-release',
    semanticReleaseBinArgs: [],

    // semantic-release pre-configured plugins
    changelogCommit: true, // create & update CHANGELOG.md
    npmRelease: false // use NPM_TOKEN to publish packages
}
```

### How it works

- It will update all the workspace (local dependencies) to the latest from the registry before running semantic release.
- It will do it by the dependency graph, meaning that it will update the packages in the correct order.
- Use `semantic-release-commit-filter` to filter the commits to only publish packages that changed.

### Pre-configured plugins

If you do not specify the `plugins` property in the `release` object, it will use the following plugins:

- @semantic-release/commit-analyzer
- @semantic-release/release-notes-generator
- @semantic-release/changelog (if `changelogCommit` is set true)
- @semantic-release/npm (if `npmRelease` is set true)
- @semantic-release/github (if `changelogCommit` is set true)
- @semantic-release/git (if `changelogCommit` is set true)

The plugins configure with recommended settings.
Checkout `settings.ts` for more information.

## Examples

Some examples of how to use this package:

- [npm-workspaces-example](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo-example)
- [withastro-utils/utils](https://github.com/withastro-utils/utils)
