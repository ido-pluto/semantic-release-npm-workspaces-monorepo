import path from 'path';
import {cosmiconfig} from 'cosmiconfig';
import defaults from 'defaults';
import {BranchObject} from 'semantic-release';
import fs from 'fs/promises';
import micromatch from 'micromatch';

const CONFIG_NAME = 'workspaceRelease';

export const SETTINGS = {
  preReleaseVersionTemplate: '${version}',
  registry: 'https://registry.npmjs.org',
  workspaces: ['packages'],
  tagFormat: '${name}@${version}',
  release: {
    extends: 'semantic-release-commit-filter',
    ci: true,
    branches: [
      'main',
      'master',
      {
        name: 'beta',
        prerelease: true,
      },
    ] as (string | BranchObject)[],
    plugins: [],
  },
  semanticReleaseBin: 'semantic-release',
  semanticReleaseBinArgs: [],
  changelogCommit: true,
  npmRelease: false,
  extendsReleaseRules: [],
  extendsNoteGeneratorTypes: [],
  extendsDefaultPlugins: [],
  perPackageConfig: {},
  autoCreatedPlugins: false,
  skip: false,
};

export async function importSettings() {
  const explorer = cosmiconfig(CONFIG_NAME);
  const result = await explorer.search();

  try {
    const workspacePackageJsonPath = path.join(
      result.filepath,
      '..',
      'package.json',
    );
    const {workspaces} = JSON.parse(
      await fs.readFile(workspacePackageJsonPath, 'utf8'),
    );
    SETTINGS.workspaces = workspaces;
  } catch (error) {
    console.warn('Could not read workspaces from package.json');
  }

  if (result) {
    Object.assign(SETTINGS, defaults(result.config, SETTINGS));
    SETTINGS.release.plugins = result.config?.release?.plugins;
  }

  if (!SETTINGS.release.plugins) {
    SETTINGS.release.plugins = createPlugins();
    SETTINGS.autoCreatedPlugins = true;
  }
}

export function generatePackageSettings(packageLocation: string) {
  const pattern = Object.keys(SETTINGS.perPackageConfig).find(pattern =>
    micromatch.isMatch(packageLocation, pattern),
  );
  const customConfig = SETTINGS.perPackageConfig[pattern];

  if (!customConfig) {
    return SETTINGS;
  }

  const newConfig = structuredClone(SETTINGS);
  Object.assign(newConfig, customConfig);
  newConfig.release = Object.assign({}, SETTINGS.release, customConfig.release);

  if (newConfig.autoCreatedPlugins && !customConfig?.release?.plugins) {
    newConfig.release.plugins = createPlugins(newConfig);
  }

  return newConfig;
}

function createPlugins(settings = SETTINGS) {
  return [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          ...settings.extendsReleaseRules,
          {
            breaking: true,
            release: 'major',
          },
          {
            revert: true,
            release: 'patch',
          },
          {
            type: '*!',
            release: 'major',
          },
          {
            type: 'breaking',
            release: 'major',
          },
          ...(settings.npmRelease
            ? [
                {
                  type: 'docs',
                  scope: 'README',
                  release: 'patch',
                },
                {
                  type: 'refactor',
                  release: 'patch',
                },
                {
                  type: 'style',
                  release: 'patch',
                },
                {
                  type: 'types',
                  release: 'patch',
                },
              ]
            : []),
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        presetConfig: {
          header: 'Release Notes',
          types: [
            ...SETTINGS.extendsNoteGeneratorTypes,
            {
              type: 'feat',
              section: 'Features',
            },
            {
              type: 'fix',
              section: 'Bug Fixes',
            },
            {
              type: 'chore',
              hidden: true,
            },
            {
              type: 'docs',
              hidden: true,
            },
            {
              type: 'style',
              hidden: true,
            },
            {
              type: 'refactor',
              hidden: true,
            },
            {
              type: 'perf',
              hidden: true,
            },
            {
              type: 'test',
              hidden: true,
            },
          ],
        },
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        writerOpts: {
          commitsSort: ['subject', 'scope'],
        },
      },
    ],
    ...(settings.changelogCommit ? ['@semantic-release/changelog'] : []),
    ...(settings.npmRelease ? ['@semantic-release/npm'] : []),
    ...(settings.changelogCommit
      ? [
          '@semantic-release/github',
          ['@semantic-release/git', {assets: ['CHANGELOG.md', 'LICENSE']}],
        ]
      : []),
    ...settings.extendsDefaultPlugins,
    [
      '@semantic-release/exec',
      {
        publishCmd:
          'npx -y semantic-release-npm-workspaces-monorepo cache ${nextRelease.version}',
      },
    ],
  ];
}
