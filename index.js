'use strict';

const program = require('commander');
const pkg = require('./package.json');
const server = require('./server');
const githubFetch = require('./server/github-fetch');

program
  .version(pkg.version)
  .usage('<command>');

program
  .command('start')
  .description('Starts application.')
  .action(start);

program
  .command('fetch <organization> [repository]')
  .description('Fetches data from GitHub.')
  .action(fetch);

function start() {
  server();
}

function fetch(org, repo) {
  if (!repo) {
    githubFetch.fetchDataForOrg(org);
  } else {
    githubFetch.fetchDataForRepo(org, repo);
  }
}

program.parse(process.argv);

if (!program.args.length) program.help();
