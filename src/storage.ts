import { cacheStoragePath } from "./config.js";
import fs from "fs/promises";

export async function readCacheStorage(): Promise<Record<string, string>> {
    try {
        return JSON.parse(await fs.readFile(cacheStoragePath, "utf-8"));
    } catch {
        return {};
    }
}

export async function writeCacheStorage(data: Record<string, string>) {
    await fs.writeFile(cacheStoragePath, JSON.stringify(data, null, 2));
}