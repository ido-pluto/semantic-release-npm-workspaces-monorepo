#!/usr/bin/env node

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {PublishCommand} from './commands/publish.js';
import {UpdateCacheVersionCommand} from './commands/updateTempStorage.js';
import {packageJSON} from '../config.js';

const yarg = yargs(hideBin(process.argv));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
yarg
  .scriptName(packageJSON.name)
  .command(UpdateCacheVersionCommand)
  .command(PublishCommand)
  .demandCommand(1)
  .strict()
  .strictCommands()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .version(packageJSON.version)
  .parse();
