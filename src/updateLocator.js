/* global fetch */
import 'isomorphic-fetch'
import Locator from './Locator'

const url = 'https://nearestmrt.daburu.xyz/processed/'
const headers = {Accept: 'application/json'}

function fetchJSON (filename) {
  return fetch(url + filename, headers).then(res => res.json())
}

export default function () {
  return Promise.all([fetchJSON('stations.json'), fetchJSON('addresses.json')])
    .then(sources => {
      const locator = new Locator(...sources)
      return function (lnglat, excludeFuture, radius) {
        return locator.getNearestStation(lnglat, excludeFuture, radius)
      }
    })
}
