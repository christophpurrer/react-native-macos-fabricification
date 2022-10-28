/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

const path = require('path');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
});

const help = `\
Usage: node babel-register <script> [arguments...]

'script' should be a TypeScript file that exports a function

  export default function MyCommand(args: string[]) {
    ...
  }

The exported function could be 'async', in which case we'll wait
for it to resolve and properly report rejected promises.

`;

async function main() {
  const [node, self, script, ...args] = process.argv;

  if (!script || script === '-h' || script === '--help') {
    process.stdout.write(help);
    process.exit(0);
  }

  const handler = require(path.resolve(__dirname, script)).default;
  if (typeof handler !== 'function') {
    process.stdout.write(help);
    throw new Error(`${script} doesn't export default function`);
  }

  // Send the raw arguments to the script, so that it can use the full
  // functionality of yargs or another way to process command line arguments.
  await handler(args);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
