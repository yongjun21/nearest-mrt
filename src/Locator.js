import proj4 from 'proj4'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import stringify from 'csv-stringify/lib/sync'

const SVY21 = '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs'
const SVY21proj = proj4('WGS84', SVY21)

export default class {
  constructor (stations, addresses) {
    this.lastUpdated = stations.lastUpdated
    this.stations = stations.data
    this.addresses = addresses.data
  }

  getNearestStation (lnglat, excludeFuture = false, radius = 1000) {
    const [x, y] = SVY21proj.forward(lnglat)

    const matches = []
    this.addresses.forEach(address => {
      if (excludeFuture && address['FUTURE']) return
      const deltaX = x - address['X']
      const deltaY = y - address['Y']
      if (Math.abs(deltaX) > radius) return
      if (Math.abs(deltaY) > radius) return
      const distance2 = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
      if (distance2 > Math.pow(radius, 2)) return
      matches.push({
        station: this.stations[address['BUILDING']],
        distance: distance2,
        address: {
          x: address['X'],
          y: address['Y'],
          longitude: address['LONGITUDE'],
          latitude: address['LATITUDE']
        }
      })
    })

    const deduped = uniqBy(matches, m => m.station)
    const sorted = sortBy(deduped, m => m.distance)
    const result = sorted.map((s, i) => Object.assign(
      {rank: i + 1},
      s,
      {distance: Math.round(Math.pow(s.distance, 0.5))}
    ))

    return {
      query: {lnglat, excludeFuture, radius},
      result,
      accurateAsOf: this.lastUpdated,
      toFlatObjects () {
        return this.result.map(flattenObject)
      },
      toTable () {
        const flatObjects = this.toFlatObjects()
        if (flatObjects.length === 0) return []
        const headers = Object.keys(flatObjects[0])
        const rows = flatObjects.map(obj => headers.map(h => obj[h]))
        return [headers, ...rows]
      },
      toCSV () {
        return stringify(this.toFlatObjects(), {header: true})
      }
    }
  }
}

function flattenObject (obj) {
  const flattened = {}

  function checkoutPath (path, node) {
    if (typeof node === 'object' && Object.keys(node).length > 0) {
      if (node instanceof Array) {
        flattened[path.join('.')] = node.join(' ')
      } else {
        for (let key in node) {
          checkoutPath(path.concat([key]), node[key])
        }
      }
    } else {
      flattened[path.join('.')] = node
    }
  }

  checkoutPath([], obj)
  return flattened
}
