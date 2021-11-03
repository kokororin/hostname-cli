#!/usr/bin/env node
const os = require('os');
const yargs = require('yargs');

const main = inputArgv => {
  if (!inputArgv) {
    return 1;
  }

  const argv = yargs(inputArgv)
    .describe('ip-address', 'addresses for the host name')
    .describe('all-ip-addresses', 'all addresses for the host')
    .describe('version', 'print version number and exit')
    .help('help')
    .alias('h', 'help')
    .alias('i', 'ip-address')
    .alias('I', 'all-ip-addresses')
    .alias('v', 'version').argv;

  if (argv.i || inputArgv.length === 0) {
    console.log(os.hostname());
    return 0;
  }

  if (argv.I) {
    const nets = os.networkInterfaces();
    const results = [];

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
          results.push(net.address);
        }
      }
    }

    console.log(results.join(' '));
    return 0;
  }
};

const exitCode = main(process.argv.slice(2));

process.on('exit', () => {
  process.exit(exitCode);
});
