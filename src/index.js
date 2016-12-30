import Locator from './Locator'

import stations from '../data/processed/mrt_stations.json'

const locator = new Locator(stations)

module.exports = function (lnglat, excludeFuture, radius) {
  return locator.getNearestStation(lnglat, excludeFuture, radius)
}
