# [3.2.0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.1.1...v3.2.0) (2026-01-31)


### Bug Fixes

* **settings:** read workspaces ([466139e](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/466139e7b0478f4bd6a8af15f11ee14d3c68e2c9))
* **scan:** skip node_modules ([3685bb7](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/3685bb75536a5401cb0ef9fcb66fb196e33bfab5))


### Features

* **workspaces:** respect package.json workspaces pattern ([d0354cf](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d0354cf4c6a4c160e3fd313500df05bcd56bfeaa))
* **config:** skipping packages ([8713454](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/87134545e44b341460d30d353c4e76e632306737))
* **config:** support per package config ([12cc4d5](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/12cc4d5ad1e42e4ca9996b1a1c13088b4d67d81d))

## [3.1.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.1.0...v3.1.1) (2025-11-01)

# [3.1.0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.0.1...v3.1.0) (2025-05-22)


### Features

* **workspaces:** respect package.json workspaces pattern ([#11](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/issues/11)) ([d76b2f1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d76b2f123beb0a9e3ba447d87389b5243472cfd8))

# [3.1.0-beta.3](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.1.0-beta.2...v3.1.0-beta.3) (2025-03-14)


### Features

* **config:** support per package config ([12cc4d5](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/12cc4d5ad1e42e4ca9996b1a1c13088b4d67d81d))

# [3.1.0-beta.2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.1.0-beta.1...v3.1.0-beta.2) (2025-03-12)


### Bug Fixes

* **scan:** skip node_modules ([3685bb7](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/3685bb75536a5401cb0ef9fcb66fb196e33bfab5))

# [3.1.0-beta.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.0.1...v3.1.0-beta.1) (2025-03-12)


### Bug Fixes

* **settings:** read workspaces ([466139e](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/466139e7b0478f4bd6a8af15f11ee14d3c68e2c9))


### Features

* **workspaces:** respect package.json workspaces pattern ([d0354cf](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d0354cf4c6a4c160e3fd313500df05bcd56bfeaa))

## [3.0.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.0.0...v3.0.1) (2025-03-06)


### Bug Fixes

* avoid throwing error when package.json does not exist ([d9c7619](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d9c7619d74da913ec6c56bbe6763d2e69947a28d))
* Avoid throwing error when package.json does not exist ([0485d4f](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/0485d4fa8fd05efe4127dcad9ba1b43f4109ec7e))
* Remove redundant fs.access ([92be7bd](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/92be7bde6f39da38098e19256e42b6918dfa87b1))

# [3.0.0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.2.3...v3.0.0) (2025-03-05)


### Bug Fixes

* Fixed issue where incorrect branch is returned in gitlab CI ([10b5fad](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/10b5fad10c4cddf964bc53e3f1f464be066112db))
* issue where incorrect branch is returned in gitlab CI ([daaa4cf](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/daaa4cfc7e82af8861c9be9125d621fb65980eac))
* Linting ([d3e5c8a](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d3e5c8ac4d1523606e1dae461a8c0629aa233f09))
* merge fixes ([47b071c](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/47b071cf3d460646cbaad13d84573b988c0fe529))


### Features

* Beta deployments added ([eb2c75f](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/eb2c75fe49f7deacd998328ec6ab85b851be65c0))
* respect release channels when resolving dependencies ([5190ed2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/5190ed283161b4385afdad73a97733a2568a32ab))
* support prerelease ([d2acfd7](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d2acfd761ca1b10f496cf63ab3f1cee46224ec6f))


### BREAKING CHANGES

* search with dist-tags

# [3.0.0-beta.2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2025-03-05)


### Bug Fixes

* Fixed issue where incorrect branch is returned in gitlab CI ([10b5fad](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/10b5fad10c4cddf964bc53e3f1f464be066112db))
* issue where incorrect branch is returned in gitlab CI ([daaa4cf](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/daaa4cfc7e82af8861c9be9125d621fb65980eac))
* Linting ([d3e5c8a](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d3e5c8ac4d1523606e1dae461a8c0629aa233f09))

# [3.0.0-beta.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.2.3...v3.0.0-beta.1) (2025-03-05)


### Bug Fixes

* merge fixes ([47b071c](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/47b071cf3d460646cbaad13d84573b988c0fe529))


### Features

* Beta deployments added ([eb2c75f](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/eb2c75fe49f7deacd998328ec6ab85b851be65c0))
* respect release channels when resolving dependencies ([5190ed2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/5190ed283161b4385afdad73a97733a2568a32ab))
* support prerelease ([d2acfd7](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/d2acfd761ca1b10f496cf63ab3f1cee46224ec6f))


### BREAKING CHANGES

* search with dist-tags

## [2.2.3](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.2.2...v2.2.3) (2024-07-07)


### Bug Fixes

* **cache:** cli receive arguments ([6070db0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/6070db09fe3e16f7c4e45a792ef6947d2ccc47e0))

## [2.2.2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.2.1...v2.2.2) (2024-07-06)


### Bug Fixes

* **packages:** publish order ([0d74519](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/0d74519a5287c9008c3432a39e9aad9749b0e128))

## [2.2.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.2.0...v2.2.1) (2024-07-06)


### Bug Fixes

* **npm:** skip checking npm for version if not a release package ([6bab1fc](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/6bab1fc142480bb2b9c9bd9766e7a8a7784ff1ae))

# [2.2.0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.1.1...v2.2.0) (2024-07-06)


### Features

* **cache:** cache releases versions ([02f6e22](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/02f6e2237a7f3c5861515408e15b2e4d6b8cbb20))

## [2.1.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.1.0...v2.1.1) (2024-07-01)


### Bug Fixes

* commit ([afef587](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/afef58757a40492502bf02a055432198246dafcd))

# [2.1.0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.0.2...v2.1.0) (2023-12-18)


### Features

* extend default configurations ([481a04a](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/481a04a186e6c857dab7284bfebd637fbc292540))

## [2.0.2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.0.1...v2.0.2) (2023-11-23)


### Bug Fixes

* sleep before next publish ([b859e81](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/b859e8136adeaac5087305e950bf098bfa2ac9aa))

## [2.0.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v2.0.0...v2.0.1) (2023-11-23)


### Bug Fixes

* logs ([69d62c3](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/69d62c385e3f80143c4bb3e2ec66502d19014a76))

# [2.0.0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.1.5...v2.0.0) (2023-11-23)

## [1.1.5](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.1.4...v1.1.5) (2023-11-23)


### Bug Fixes

* breaking changes detection ([279fedb](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/279fedbbddd9506a3b1472060870c93b849bb440))
* typo ([15df477](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/15df47722742af134c22760a725bbacc64ef68e7))

## [1.1.4](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.1.3...v1.1.4) (2023-11-21)


### Bug Fixes

* optional settings ([1720e4f](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/1720e4f128de726bcedf609046528657ddea2c84))

## [1.1.3](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.1.2...v1.1.3) (2023-11-21)


### Bug Fixes

* npmRelease ([5bacd3c](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/5bacd3c36b4087b71f06fa9863ae9a09797ac21a))

## [1.1.2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.1.1...v1.1.2) (2023-11-21)


### Bug Fixes

* **update-packages:** fetch retry ([6b1aaec](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/6b1aaecfcf4048dd9bb8ad68f86743cc6a913434))

## [1.1.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.1.0...v1.1.1) (2023-11-21)


### Bug Fixes

* **settings:** initialization access ([c6e721d](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/c6e721d4a6eb45d3b7e6d9209f892832a650edd2))

# [1.1.0](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.0.2...v1.1.0) (2023-11-21)


### Features

* **settings:** work by default ([36d7df6](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/36d7df6fcf6554a3cfaa66f45f76b4f27227c31c))

## [1.0.2](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.0.1...v1.0.2) (2023-11-20)


### Bug Fixes

* **package:** update local packages ([3da4991](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/3da49918727694ca9fbb0f72893ed314ccbbab99))

## [1.0.1](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/compare/v1.0.0...v1.0.1) (2023-11-20)

# 1.0.0 (2023-11-20)


### Features

* first commit ([3d48f8c](https://github.com/ido-pluto/semantic-release-npm-workspaces-monorepo/commit/3d48f8c2cb1b39ee4d3449f619afc8719ff39b40))
