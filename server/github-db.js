'use strict';

const _ = require('lodash');
const DataStore = require('nedb');

const db = new DataStore({filename: 'data/github.db', autoload: true});

module.exports = {
  save(doc) {
    return new Promise((resolve, reject) => {
      db.insert(doc, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      });
    });
  },
  find(opts) {
    return new Promise((resolve, reject) => {
      db.find(opts, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      })
    });
  },
  getReports() {
    return new Promise((resolve, reject) => {
      // TODO: just do distinct org repo over all documents for now
      db.find({}, (err, docs) => {
        if (err) reject(err);

        var reports = docs.map(d => {
          return {org: d.org, repo: d.repo};
        });

        var repos = _.uniqBy(reports, d => d.org + '/' + d.repo);
        repos = _.orderBy(repos, ['org', 'repo']);

        var orgs = _.uniqBy(repos.map(r => {return {org: r.org};}), r => r.org);

        resolve({repos: repos, orgs: orgs});
      });
    });
  }
};
