import fs from 'fs'

const filenames = {
  EWL: 'east_west_line.json',
  NSL: 'north_south_line.json',
  NEL: 'north_east_line.json',
  CCL: 'circle_line.json',
  DTL: 'downtown_line.json',
  TEL: 'thomson_line.json'
}

const stations = {}
const addresses = []

Object.keys(filenames).forEach(key => {
  const arr = require('../data/semi/' + filenames[key])
  arr.forEach(v => {
    const stationName = v['BUILDING']
    let stationCode = v['CODE']
    if (v['FUTURE']) stationCode += ' (Future)'
    if (!(stationName in stations)) {
      stations[stationName] = {
        STATION_CODE: [],
        LINE: {
          EWL: 0,
          NSL: 0,
          NEL: 0,
          CCL: 0,
          DTL: 0,
          TEL: 0
        }
      }
    }
    stations[stationName]['STATION_CODE'].push(stationCode)
    stations[stationName]['LINE'][key] = v['FUTURE'] ? 2 : 1
    addresses.push(v)
  })
})

Object.keys(stations).forEach(stationName => {
  let ones = 0
  let twos = 0
  const mrtLines = stations[stationName]['LINE']
  Object.keys(mrtLines).forEach(line => {
    if (mrtLines[line] === 1) ones++
    if (mrtLines[line] === 2) twos++
  })
  stations[stationName]['OPERATIONAL'] = ones > 0 ? 1 : 2
  if (ones > 1) stations[stationName]['INTERCHANGE'] = 1
  else if (ones + twos > 1) stations[stationName]['INTERCHANGE'] = 2
  else stations[stationName]['INTERCHANGE'] = 0
})

fs.writeFileSync('data/processed/stations.json', JSON.stringify(stations, null, '\t'))
fs.writeFileSync('data/processed/addresses.json', JSON.stringify(addresses, null, '\t'))
