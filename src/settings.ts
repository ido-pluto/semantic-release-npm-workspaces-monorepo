import path from 'path';
import {cosmiconfig} from 'cosmiconfig';
import defaults from 'defaults';

const CONFIG_NAME = 'workspaceRelease';

export const SETTINGS = {
    versionTemplate: '^${version}',
    registry: 'https://registry.npmjs.org',
    workspace: path.join(process.cwd(), 'packages'),
    tagFormat: '${name}@${version}',
    release: {
        extends: 'semantic-release-commit-filter',
        ci: true,
        branches: [
            'main', 'master'
        ],
        plugins: defaultPlugins()
    },
    semanticReleaseBin: 'semantic-release',
    semanticReleaseBinArgs: [],
    preConfiguredChangelog: true
};

export async function importSettings() {
    const explorer = cosmiconfig(CONFIG_NAME);
    const result = await explorer.search();

    if (result) {
        Object.assign(SETTINGS, defaults(result.config, SETTINGS));
        SETTINGS.release.plugins = result.config.release.plugins || defaultPlugins();
    }
}

function defaultPlugins() {
    const hasNpmToken = Boolean(process.env.NPM_TOKEN);
    return [
        [
            '@semantic-release/commit-analyzer',
            {
                'preset': 'angular',
                'releaseRules': hasNpmToken ? [
                    {
                        'type': 'docs',
                        'scope': 'README',
                        'release': 'patch'
                    },
                    {
                        'type': 'refactor',
                        'release': 'patch'
                    },
                    {
                        'type': 'style',
                        'release': 'patch'
                    }
                ] : [],
                'parserOpts': {
                    'noteKeywords': [
                        'BREAKING CHANGE',
                        'BREAKING CHANGES',
                        'BREAKING'
                    ]
                }
            }
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                'preset': 'angular',
                'presetConfig': {
                    'header': 'Release Notes',
                    'types': [
                        {
                            'type': 'feat',
                            'section': 'Features'
                        },
                        {
                            'type': 'fix',
                            'section': 'Bug Fixes'
                        },
                        {
                            'type': 'chore',
                            'hidden': true
                        },
                        {
                            'type': 'docs',
                            'hidden': true
                        },
                        {
                            'type': 'style',
                            'hidden': true
                        },
                        {
                            'type': 'refactor',
                            'hidden': true
                        },
                        {
                            'type': 'perf',
                            'hidden': true
                        },
                        {
                            'type': 'test',
                            'hidden': true
                        }
                    ]
                },
                'parserOpts': {
                    'noteKeywords': [
                        'BREAKING CHANGE',
                        'BREAKING CHANGES',
                        'BREAKING'
                    ]
                },
                'writerOpts': {
                    'commitsSort': [
                        'subject',
                        'scope'
                    ]
                }
            }
        ],
        ...(SETTINGS.preConfiguredChangelog ? ['@semantic-release/changelog'] : []),
        ...(hasNpmToken ? ['@semantic-release/npm'] : []),
        ...(SETTINGS.preConfiguredChangelog ? [
            '@semantic-release/github',
            [
                '@semantic-release/git',
                {assets: ['CHANGELOG.md', 'LICENSE']},
            ],
        ] : [])
    ];
}
