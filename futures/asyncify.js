(function () {
  "use strict";

  require('require-kiss');

  var Future = require((__dirname ? __dirname + '/' : 'futures') + '/future');

  function asyncify(doStuffSync, context) {
    var future = Future(),
      passenger = future.passable();

    future.setAsap(false);

    function doStuff() {
      var self = ('undefined' !== typeof context ? context : this),
        err,
        data;

      future.setContext(self);

      try {
        data = doStuffSync.apply(self, arguments);
      } catch(e) {
        err = e;
      }

      future.deliver(err, data);

      return passenger;
    }

    doStuff.when = passenger.when;
    doStuff.whenever = passenger.whenever;

    return doStuff;
  }

  module.exports = asyncify;
  provide('futures/asyncify', module.exports);
}());
