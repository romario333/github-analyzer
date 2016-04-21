'use strict';

const express = require('express');
const githubStats = require('./github-stats');

module.exports = function() {

  var router = express.Router();

  router.get('/stats', (req, res) => {
    githubStats.getAvailableReports()
      .then(reports => {
        res.send(reports);
      })
      .catch(err => {
        next(err);
      })
  });

  function getStats(req, res, next) {
    githubStats.getTopCommenters(req.params.org, req.params.repo)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        next(err);
      });
  }

  router.get('/stats/:org', getStats);

  router.get('/stats/:org/:repo', getStats);

  return router;
};
