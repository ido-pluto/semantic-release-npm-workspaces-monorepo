# Semantic Release with NPM Workspaces

Help you use semantic release with npm workspaces.

# Installation

```bash
npm install --save-dev semantic-release-npm-workspaces-monorepo
```

# Usage

Add this to your `package.json` of your workspace root:

```json
{
  "workspaceRelease": {
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
    },
    semanticReleaseBin: 'semantic-release',
    semanticReleaseBinArgs: []
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
- @semantic-release/npm (if `NPM_TOKEN` is set)
- @semantic-release/github
- @semantic-release/git

The plugins configure with recommended settings.
Checkout `settings.ts` for more information.
