const fs = require('fs')
const _mean = require('lodash/mean')

const existing = require('./data/raw/MRT_existing.json')
const future = require('./data/raw/MRT_future.json')

const lastUpdated = 1539273600000

const stations = {}

function clean (row, future) {
  const name = row.station_name.toUpperCase()
  if (!(name in stations)) {
    stations[name] = {
      name,
      code: row.station_codes,
      longitude: _mean(row.geolocations.map(loc => +loc.LONGITUDE)),
      latitude: _mean(row.geolocations.map(loc => +loc.LATITUDE)),
      x: _mean(row.geolocations.map(loc => +loc.X)),
      y: _mean(row.geolocations.map(loc => +loc.Y)),
      line: {
        NSL: 0,
        EWL: 0,
        CGL: 0,
        NEL: 0,
        CCL: 0,
        DTL: 0,
        TEL: 0,
        JRL: 0
      },
      xy: row.geolocations.map(loc => ([+loc.X, +loc.Y]))
    }
  }
  const line = row.line.match(/\((.*)\)/)[1]
  stations[name].line[line] = future ? 2 : 1
}

existing.forEach(row => clean(row, false))
future.forEach(row => clean(row, true))

Object.keys(stations).forEach(name => {
  let ones = 0
  let twos = 0
  const mrtLines = stations[name].line
  Object.keys(mrtLines).forEach(line => {
    if (mrtLines[line] === 1) ones++
    if (mrtLines[line] === 2) twos++
  })
  stations[name].operational = ones > 0 ? 1 : 2
  if (ones > 1) stations[name].interchange = 1
  else if (ones + twos > 1) stations[name].interchange = 2
  else stations[name].interchange = 0
})

const processed = {lastUpdated, data: {}}
Object.keys(stations).sort().forEach(key => {
  processed.data[key] = stations[key]
})

fs.writeFileSync('data/processed/mrt_stations.json', JSON.stringify(processed, null, 2))
