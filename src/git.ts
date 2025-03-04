import { exec } from 'child_process';
import { promisify } from 'util';
import { SETTINGS } from './settings.js';

const execAsync = promisify(exec);

/**
 * Gets the current Git branch name of the repository
 */
export async function getCurrentGitBranch(): Promise<string> {
    const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD');
    return stdout.trim();
}

/**
 * Find the prerelease channel for the given branch name
 */
export function findPrereleaseChannel(branchName: string): string | null {
    if (!Array.isArray(SETTINGS.release.branches)) {
        return null;
    }

    interface BranchConfig {
        name: string;
        channel?: string;
        prerelease?: string;
        [key: string]: any;
    }

    for (const branch of SETTINGS.release.branches) {
        if (typeof branch === 'string') continue;

        if (branch && typeof branch === 'object') {
            const branchConfig = branch as BranchConfig;
            if (branchConfig.name === branchName && branchConfig.channel)  return branchConfig.channel;
        }
    }

    return null;
}
