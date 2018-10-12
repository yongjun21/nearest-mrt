const Locator = require('./Locator')

const stations = require('./data/processed/mrt_stations.json')

const locator = new Locator(stations)

module.exports = function (lnglat, excludeFuture, radius) {
  return locator.getNearestStation(lnglat, excludeFuture, radius)
}
