import {applyEdits, FormattingOptions, modify} from 'jsonc-parser';
import {PackageJSON} from '../types.js';
import {isDeepStrictEqual} from 'node:util';

function detectFormattingOptions(text: string): FormattingOptions {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const indent = text.match(/\n([ \t]+)["{[]/);

  if (!indent) {
    return {tabSize: 2, insertSpaces: true, eol};
  }

  return {tabSize: indent[1].length, insertSpaces: indent[1][0] !== '\t', eol};
}

export function editPackageJson(
  rawText: string,
  original: PackageJSON,
  current: PackageJSON,
): string {
  const formattingOptions = detectFormattingOptions(rawText);
  let text = rawText;

  for (const depKey of ['dependencies', 'devDependencies'] as const) {
    const currentDeps = current[depKey] || {};
    const originalDeps = original[depKey] || {};

    for (const name in currentDeps) {
      if (currentDeps[name] !== originalDeps[name]) {
        const edits = modify(text, [depKey, name], currentDeps[name], {
          formattingOptions,
        });
        text = applyEdits(text, edits);
      }
    }
  }

  if (!isDeepStrictEqual(current.release, original.release)) {
    const edits = modify(text, ['release'], current.release, {
      formattingOptions,
    });
    text = applyEdits(text, edits);
  }

  return text;
}
