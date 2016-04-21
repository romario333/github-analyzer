'use strict';

const _ = require('lodash');
var githubDb = require('./github-db');

class StatsCache {
  constructor() {
    this._cache = {};
  }

  _key(org, repo, what) {
    if (!what) {
      what = repo;
      repo = undefined;
    }
    return repo ? [org, repo, what].join('/') : [org, what].join('/');
  }

  get(org, repo, what) {
    return this._cache[this._key(org, repo, what)];
  }

  put(org, repo, what, data) {
    this._cache[this._key(org, repo, what)] = data;
  }
}

var cache = new StatsCache();

function makeCommentCountsStat(org, repo, commentKind) {
  var counts = {};

  function count(comments) {
    comments = comments.data;

    // count # of comments per user
    comments.forEach(c => {
      if (!counts[c.user.login]) {
        counts[c.user.login] = {user: c.user.login, comments: 0};
      }
      counts[c.user.login].comments++;
    });

    // count # of issues user is commenting on
    var issuesByUser = {};
    comments.forEach(c => {
      var issues = issuesByUser[c.user.login];
      if (!issues) {
        issues = issuesByUser[c.user.login] = []
      }
      issues.push(c.issue_url);
    });
    Object.keys(issuesByUser).forEach(user => {
      counts[user].issues = (counts[user].issues || 0) + _.uniq(issuesByUser[user]).length;
    });
  }

  var findOpts = {kind: commentKind, org};
  if (repo) {
    findOpts.repo = repo;
  }

  return githubDb.find(findOpts).then(docs => {
    docs.forEach(doc => {
      count(doc);
    });

    counts = _.values(counts);
    counts = _.sortBy(counts, ['comments', 'issues', 'user']).reverse();
    return counts;
  });
}

module.exports = {
  getIssueCommentCounts(org, repo) {
    var res = cache.get(org, repo, 'issue-comment-counts');
    if (!res) {
      res = makeCommentCountsStat(org, repo, 'issue-comments');
      cache.put(org, repo, 'issue-comment-counts', res);
    }
    return res;
  },

  getPullCommentCounts(org, repo) {
    var res = cache.get(org, repo, 'pull-comment-counts');
    if (!res) {
      res = makeCommentCountsStat(org, repo, 'pulls-comments');
      cache.put(org, repo, 'pull-comment-counts', res);
    }
    return res;
  },

  getTopCommenters(org, repo) {
    return Promise.all([
      this.getIssueCommentCounts(org, repo),
      this.getPullCommentCounts(org, repo)
    ]).then(res => {
      return {
        topIssueCommenters: _.take(res[0], 20),
        topPullCommenters: _.take(res[1], 20)
      };
    });
  },

  getAvailableReports() {
    return githubDb.getReports();
  }

};
