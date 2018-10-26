var Locator = require('./Locator')

var stations = require('./data/processed/mrt_stations.json')

var locator = new Locator(stations)

module.exports = function (lnglat, excludeFuture, radius) {
  return locator.getNearestStation(lnglat, excludeFuture, radius)
}
