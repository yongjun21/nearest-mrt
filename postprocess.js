const fs = require('fs')

const polyline = require('@mapbox/polyline')

const SVY21 = require('./svy21')
const projection = new SVY21()

const hardcodedTransfers = {
  'CHOA CHU KANG': [{
    from: 'NSL',
    to: 'BPLRT',
    distance: 46
  }, {
    from: 'BPLRT',
    to: 'NSL',
    distance: 46
  }],
  'BUKIT PANJANG': [{
    from: 'DTL',
    to: 'BPLRT',
    distance: 175
  }, {
    from: 'BPLRT',
    to: 'DTL',
    distance: 175
  }]
}

// postProcessAdjacents()
postProcessStations()

function postProcessAdjacents () {
  const adjacents = require('./data/raw/adjacents.json')
  const estTravelTime = require('./data/raw/estTravelTime.json')
  Object.keys(adjacents).forEach(pair => {
    const reversed = pair.split('.').reverse().join('.')
    if (adjacents[reversed]) return
    adjacents[reversed] = Object.assign({}, adjacents[pair])
    const geometry = polyline.decode(adjacents[pair].geometry).reverse()
    adjacents[reversed].geometry = polyline.encode(geometry)
  })
  Object.keys(estTravelTime).forEach(pair => {
    adjacents[pair] = adjacents[pair] || {}
    adjacents[pair].duration = estTravelTime[pair]
  })
  fs.writeFileSync('data/raw/adjacents.json', JSON.stringify(adjacents, null, 2))
}

function postProcessStations () {
  const {lastUpdated, data: stations} = require('./data/processed/mrt_stations.json')
  const adjacents = require('./data/raw/adjacents.json')
  const coordinates = require('./data/raw/coordinates.json')
  Object.keys(stations).forEach(key => {
    stations[key].adjacent.forEach(adj => {
      const pair = key + '.' + adj.station
      Object.assign(adj, adjacents[pair])
    })
    if (stations[key].operational !== 1) return
    const locations = []
    stations[key].code.split(' ').forEach(code => {
      // Tanah Merah Station special case
      const key = 'FERRY:' + (code === 'CG' ? 'EW4' : code)
      if (key in coordinates) {
        const [x, y] = projection.forward(coordinates[key])
        locations.push({
          platform: code,
          longitude: coordinates[key][0],
          latitude: coordinates[key][1],
          x,
          y
        })
      }
    })
    stations[key].locations = locations
    const transfers = []
    locations.forEach(a => {
      locations.forEach(b => {
        if (a === b) return
        const distance = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
        // Average walking speed = 83.333 metres per min
        // const walkingTime = Math.ceil(distance * 1.5 / 83.333)
        transfers.push({
          from: getLine(a.platform),
          to: getLine(b.platform),
          distance
          // walkingTime
        })
      })
    })
    stations[key].transfers = transfers
  })
  Object.keys(hardcodedTransfers).forEach(key => {
    stations[key].transfers = stations[key].transfers || []
    stations[key].transfers.push(...hardcodedTransfers[key])
  })

  Object.keys(stations).forEach(key => {
    clean(stations[key])
    stations[key].adjacent.forEach(clean)
    if (stations[key].locations) stations[key].locations.forEach(clean)
    if (stations[key].transfers) stations[key].transfers.forEach(clean)
  })
  const processed = {lastUpdated, data: stations}
  fs.writeFileSync('data/processed/mrt_stations.json', JSON.stringify(processed, null, 2))
}

function clean (obj) {
  if ('longitude' in obj) obj.longitude = round(obj.longitude, 7)
  if ('latitude' in obj) obj.latitude = round(obj.latitude, 7)
  if ('x' in obj) obj.x = round(obj.x, 2)
  if ('y' in obj) obj.y = round(obj.y, 2)
  if ('distance' in obj) obj.distance = round(obj.distance)
}

function getLine (code) {
  const prefix = code.slice(0, 2)
  // Circle Line Extension special case
  return prefix === 'CE' ? 'CCL' : (prefix + 'L')
}

function round (v, dp = 0) {
  if (isNaN(v)) return v
  return +(v.toFixed(dp))
}
