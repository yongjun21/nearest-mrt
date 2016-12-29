import Locator from './Locator'

import stations from '../data/processed/stations.json'
import addresses from '../data/processed/addresses.json'

const locator = new Locator(stations, addresses)

module.exports = function (lnglat, excludeFuture, radius) {
  return locator.getNearestStation(lnglat, excludeFuture, radius)
}
