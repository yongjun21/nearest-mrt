const fs = require('fs')

const existing = require('./data/raw/MRT_existing.json')
const future = require('./data/raw/MRT_future.json')
const alternate = require('./data/raw/MRT_alternate.json')

const SVY21 = require('./svy21')
const projection = new SVY21()

const lastUpdated = 1539273600000

const stations = {}

let prevRow = null

function clean (row, future) {
  const name = row.station_name.toUpperCase()
  if (!(name in stations)) {
    let longitude, latitude
    let x, y
    if (future) {
      longitude = row.geolocations[0] && +row.geolocations[0].LONGITUDE
      latitude = row.geolocations[0] && +row.geolocations[0].LATITUDE
      x = row.geolocations[0] && +row.geolocations[0].X
      y = row.geolocations[0] && +row.geolocations[0].Y
    } else {
      const match = alternate.find(row => row.name.trim().toUpperCase() === name)
      longitude = match.lng
      latitude = match.lat
      ;[x, y] = projection.forward([match.lng, match.lat])
    }
    stations[name] = {
      name,
      code: row.station_codes,
      longitude,
      latitude,
      x,
      y,
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
      adjacent: []
    }
  }
  const line = row.line.match(/\(([A-Z]*)\)$/)[1]
  stations[name].line[line] = future ? 2 : 1
  if (prevRow && row.line === prevRow.line) {
    const prevName = prevRow.station_name.toUpperCase()
    stations[prevName].adjacent.push({station: name, line, direction: 1})
    stations[name].adjacent.push({station: prevName, line, direction: 2})
  }
  prevRow = row
}

existing.forEach(row => clean(row, false))
future.forEach(row => clean(row, true))

const hardcodedLinks = [
  ['TANAH MERAH', 'EXPO', 'CGL'],
  ['BAYFRONT', 'PROMENADE', 'CCL'],
  ['EXPO', 'XILIN', 'DTL'],
  ['PUNGGOL', 'PUNGGOL COAST', 'NEL'],
  ['HARBOURFRONT', 'KEPPEL', 'CCL'],
  ['CHOA CHU KANG', 'BUKIT PANJANG', 'BPLRT']
]

hardcodedLinks.forEach(link => {
  const orig = link[0].toUpperCase()
  const dest = link[1].toUpperCase()
  const line = link[2]
  stations[orig].adjacent.push({station: dest, line, direction: 1})
  stations[dest].adjacent.push({station: orig, line, direction: 2})
})

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
