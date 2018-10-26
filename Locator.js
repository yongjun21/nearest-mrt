var _sortBy = require('lodash/sortBy')
var _omit = require('lodash/omit')
var {flatten} = require('flat')
var Papa = require('papaparse')

var SVY21 = require('./svy21')
var projection = new SVY21()

function Locator (stations) {
  this.lastUpdated = stations.lastUpdated
  this.stations = stations.data
}

Locator.prototype.getNearestStation = function (lnglat, excludeFuture, radius) {
  var stations = this.stations
  excludeFuture = !!excludeFuture
  radius = radius || 1000
  var radius2 = Math.pow(radius, 2)
  var [x, y] = projection.forward(lnglat)

  var matches = []
  Object.keys(stations).forEach(function (key) {
    var station = stations[key]
    if (excludeFuture && station.operational === 2) return
    var distance2 = Infinity
    function findShorter (target) {
      if (target.x && target.y) {
        var deltaX = x - target.x
        var deltaY = y - target.y
        var d2 = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
        if (d2 < distance2) distance2 = d2
      }
    }
    findShorter(station)
    if (station.locations) {
      station.locations.forEach(findShorter)
    }

    if (distance2 > radius2) return
    matches.push({
      station: _omit(station, ['adjacent']),
      distance: distance2
    })
  })

  var sorted = _sortBy(matches, function (m) { return m.distance })
  var result = sorted.map(function (s, i) {
    return Object.assign({rank: i + 1}, s)
  })
  result.forEach(function (s) {
    s.distance = Math.round(Math.pow(s.distance, 0.5))
  })

  return {
    query: {lnglat, excludeFuture, radius},
    result,
    accurateAsOf: this.lastUpdated,
    toFlatObjects: function () {
      return this.result.map(function (d) {
        d = Object.assign({}, d, {
          station: _omit(d.station, ['locations', 'exchanges'])
        })
        return flatten(d)
      })
    },
    toTable: function () {
      var flatObjects = this.toFlatObjects()
      if (flatObjects.length === 0) return []
      var output = []
      var headers = Object.keys(flatObjects[0])
      output.push(headers)
      flatObjects.forEach(function (obj) {
        var row = headers.map(function (h) { return obj[h] })
        output.push(row)
      })
      return output
    },
    toCSV () {
      return Papa.unparse(this.toFlatObjects(), {header: true})
    }
  }
}

module.exports = Locator
