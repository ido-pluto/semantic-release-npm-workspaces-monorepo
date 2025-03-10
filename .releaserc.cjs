module.exports = {
    "branches": [
        "main",
        {
            "name": "beta",
            "prerelease": true
        }
    ],
    "ci": true,
    "plugins": [
        [
            "@semantic-release/commit-analyzer",
            {
                "preset": "angular",
                "releaseRules": [
                    {
                        'breaking': true,
                        'release': 'major'
                    },
                    {
                        'revert': true,
                        'release': 'patch'
                    },
                    {
                        'type': '*!',
                        'release': 'major'
                    },
                    {
                        'type': 'breaking',
                        'release': 'major'
                    },
                    {
                        "type": "docs",
                        "scope": "README",
                        "release": "patch"
                    },
                    {
                        "type": "refactor",
                        "release": "patch"
                    },
                    {
                        "type": "style",
                        "release": "patch"
                    },
                    {
                        'type': 'types',
                        'release': 'patch'
                    }
                ],
                "parserOpts": {
                    "noteKeywords": [
                        "BREAKING CHANGE",
                        "BREAKING CHANGES",
                        "BREAKING"
                    ]
                }
            }
        ],
        [
            "@semantic-release/release-notes-generator",
            {
                "preset": "angular",
                "presetConfig": {
                    "header": "Release Notes",
                    "types": [
                        {
                            "type": "feat",
                            "section": "Features"
                        },
                        {
                            "type": "fix",
                            "section": "Bug Fixes"
                        },
                        {
                            "type": "chore",
                            "hidden": true
                        },
                        {
                            "type": "docs",
                            "hidden": true
                        },
                        {
                            "type": "style",
                            "hidden": true
                        },
                        {
                            "type": "refactor",
                            "hidden": true
                        },
                        {
                            "type": "perf",
                            "hidden": true
                        },
                        {
                            "type": "test",
                            "hidden": true
                        }
                    ]
                },
                "parserOpts": {
                    "noteKeywords": [
                        "BREAKING CHANGE",
                        "BREAKING CHANGES",
                        "BREAKING"
                    ]
                },
                "writerOpts": {
                    "commitsSort": [
                        "subject",
                        "scope"
                    ]
                }
            }
        ],
        "@semantic-release/changelog",
        "@semantic-release/npm",
        "@semantic-release/github",
        [
            '@semantic-release/git',
            {assets: ['CHANGELOG.md', 'LICENSE']},
        ],
    ]
};
