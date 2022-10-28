const path = require('path');
require('@babel/register')({extensions: ['.ts']});

async function main() {
  const [node, self, script, ...args] = process.argv;
  const handler = require(path.resolve(__dirname, script)).default;
  if (typeof handler !== 'function') {
    process.stdout.write(help);
    throw new Error(`${script} doesn't export default function`);
  }
  // Send the raw arguments to the script, so that it can use the full
  // functionality of yargs or another way to process command line arguments.
  await handler(args);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
