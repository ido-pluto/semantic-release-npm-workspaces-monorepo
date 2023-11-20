export type PackageDependencies = {
    [packageName: string]: string
}

export type PackageJSON = {
    name: string,
    dependencies: PackageDependencies,
    devDependencies: PackageDependencies
    [key: string]: any
}
