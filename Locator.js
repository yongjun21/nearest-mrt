const _sortBy = require('lodash/sortBy')
const _omit = require('lodash/omit')
const {flatten} = require('flat')
const Papa = require('papaparse')

const SVY21 = require('./svy21')
const projection = new SVY21()

function Locator (stations) {
  this.lastUpdated = stations.lastUpdated
  this.stations = stations.data
}

Locator.prototype.getNearestStation = function (lnglat, excludeFuture, radius) {
  excludeFuture = !!excludeFuture
  radius = radius || 1000
  const radius2 = Math.pow(radius, 2)
  const [x, y] = projection.forward(lnglat)

  const matches = []
  Object.keys(this.stations).forEach(key => {
    const station = this.stations[key]
    if (excludeFuture && station.operational === 2) return
    let distance2 = Infinity
    station.xy.forEach(coord => {
      const deltaX = x - coord[0]
      const deltaY = y - coord[1]
      const d2 = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
      if (d2 < distance2) distance2 = d2
    })
    if (distance2 > radius2) return
    matches.push({
      station: _omit(station, ['xy']),
      distance: distance2
    })
  })

  const sorted = _sortBy(matches, m => m.distance)
  const result = sorted.map((s, i) => Object.assign({rank: i + 1}, s))
  result.forEach(s => {
    s.distance = Math.round(Math.pow(s.distance, 0.5))
  })

  return {
    query: {lnglat, excludeFuture, radius},
    result,
    accurateAsOf: this.lastUpdated,
    toFlatObjects () {
      return this.result.map(d => flatten(d))
    },
    toTable () {
      const flatObjects = this.toFlatObjects()
      if (flatObjects.length === 0) return []
      const headers = Object.keys(flatObjects[0])
      const rows = flatObjects.map(obj => headers.map(h => obj[h]))
      return [headers, ...rows]
    },
    toCSV () {
      return Papa.unparse(this.toFlatObjects(), {header: true})
    }
  }
}

module.exports = Locator
