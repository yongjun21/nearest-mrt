import fs from 'fs'

const lastUpdated = 1480435200000

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
    if (v['FUTURE']) stationCode += '(Future)'
    if (!(stationName in stations)) {
      stations[stationName] = {
        name: stationName,
        code: [],
        latitude: [],
        longitude: [],
        x: [],
        y: [],
        line: {
          EWL: 0,
          NSL: 0,
          NEL: 0,
          CCL: 0,
          DTL: 0,
          TEL: 0
        }
      }
    }
    stations[stationName].latitude.push(v['LATITUDE'])
    stations[stationName].longitude.push(v['LONGITUDE'])
    stations[stationName].x.push(v['X'])
    stations[stationName].y.push(v['Y'])
    stations[stationName].code.push(stationCode)
    stations[stationName].line[key] = v['FUTURE'] ? 2 : 1

    addresses.push(Object.assign({}, v, {
      X: +v['X'],
      Y: +v['Y'],
      LATITUDE: +v['LATITUDE'],
      LONGITUDE: +v['LONGITUDE']
    }))
  })
})

Object.keys(stations).forEach(stationName => {
  let ones = 0
  let twos = 0
  const mrtLines = stations[stationName].line
  Object.keys(mrtLines).forEach(line => {
    if (mrtLines[line] === 1) ones++
    if (mrtLines[line] === 2) twos++
  })
  stations[stationName].operational = ones > 0 ? 1 : 2
  if (ones > 1) stations[stationName].interchange = 1
  else if (ones + twos > 1) stations[stationName].interchange = 2
  else stations[stationName].interchange = 0

  let latitude = 0;
  for(var i = 0; i < stations[stationName].latitude.length; i++) {
    latitude += stations[stationName].latitude[i];
  }
  stations[stationName].latitude = latitude / stations[stationName].latitude.length;

  let longitude = 0;
  for(var i = 0; i < stations[stationName].longitude.length; i++) {
    longitude += stations[stationName].longitude[i];
  }
  stations[stationName].longitude = longitude / stations[stationName].longitude.length;

  let x = 0;
  for(var i = 0; i < stations[stationName].x.length; i++) {
    x += stations[stationName].x[i];
  }
  stations[stationName].x = x / stations[stationName].x.length;

  let y = 0;
  for(var i = 0; i < stations[stationName].y.length; i++) {
    y += stations[stationName].y[i];
  }
  stations[stationName].y = y / stations[stationName].y.length;

})

fs.writeFileSync('data/processed/stations.json',
  JSON.stringify({lastUpdated, data: stations}, null, '\t'))
fs.writeFileSync('data/processed/addresses.json',
  JSON.stringify({lastUpdated, data: addresses}, null, '\t'))
