'use strict';

const log = require('winston');
log.level = 'debug'; // TODO: configurable
const request = require('request-promise');
const parseLinkHeader = require('parse-link-header');
const githubDb = require('./github-db');

if (!process.env.GITHUB_ANALYZER_ACCESS_TOKEN) {
  throw new Error('GITHUB_ANALYZER_ACCESS_TOKEN environment variable not set. Go to https://github.com/settings/tokens to generate personal access token.');
}

var github = request.defaults({
  baseUrl: 'https://api.github.com',
  headers: {
    'User-Agent': 'romario333/github-analyzer'
  },
  json: true,
  resolveWithFullResponse: true,
  auth: {
    user: process.env.GITHUB_ANALYZER_USER,
    pass: process.env.GITHUB_ANALYZER_ACCESS_TOKEN
  }
});

function fetchList(uri) {
  log.info(`Going to fetch list at ` + uri);
  var list = [];

  function processListResult(response) {
    var link = parseLinkHeader(response.headers.link);

    list = list.concat(response.body);

    if (link && link.next) {
      log.info(`going to fetch next page ${link.next.page} / ${link.last.page}`);
      return github({baseUrl: null, url: link.next.url}).then(processListResult);
    }
    return list;
  }

  return github(uri).then(processListResult);
}


module.exports = {
  fetchDataForOrg(org) {
    // TODO: should I support user here?
    fetchList(`/orgs/${org}/repos`)
      .then(repos => {
        repos = repos.map(r => r.name);
        // fetch repos in series
        var series = Promise.resolve();
        repos.forEach(repo => {
          series = series.then(() => {
            return this.fetchDataForRepo(org, repo);
          })
        });
      })
      .catch(err => {throw err});
  },

  fetchDataForRepo(org, repo) {
    // TODO: make this more robust, if it fails in the middle, save what you have and try to resume
    // TODO: fetch should be able to resume, if you see that latest entry has link to next page, use it

    return fetchList(`/repos/${org}/${repo}/issues/comments`)
      .then(data => {
        return githubDb.save({kind: 'issue-comments', org, repo, data});
      })
      .then(() => fetchList(`/repos/${org}/${repo}/pulls/comments`))
      .then(data => {
        return githubDb.save({kind: 'pulls-comments', org, repo, data});
      })
      .catch(err => {throw err});
  }
};
