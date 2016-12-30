/* global fetch */
import 'isomorphic-fetch'
import Locator from './Locator'

const url = 'https://nearestmrt.daburu.xyz/processed/mrt_stations.json'

export default function () {
  return fetch(url)
    .then(res => res.json())
    .then(data => {
      const locator = new Locator(data)
      return function (lnglat, excludeFuture, radius) {
        return locator.getNearestStation(lnglat, excludeFuture, radius)
      }
    })
}
