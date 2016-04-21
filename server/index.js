const path = require('path');
const express = require('express');

module.exports = function() {
  var app = express();

  app.use(express.static('client/build'));
  app.use('/api', require('./api')(app));

  // Basic error handler
  app.use(function (err, req, res, next) {
    console.error(err.stack ? err.stack : err);
    // If our routes specified a specific response, then send that. Otherwise,
    // send a generic message so as not to leak anything.
    res.status(500).send(err.response || 'Something broke!');
  });


  var server = app.listen(process.env.PORT || 8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  });
};

