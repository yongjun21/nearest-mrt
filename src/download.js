import fs from 'fs'
import range from 'lodash/range'
import fetch from 'node-fetch'

const url = 'https://developers.onemap.sg/commonapi/search?searchVal=mrt station&returnGeom=Y&getAddrDetails=Y&pageNum='

const apiCalls = range(80).map(i => {
  return fetch(url + (i + 1))
    .then(res => res.json())
    .then(json => json.results)
})

Promise.all(apiCalls).then(results => {
  const result = results.reduce((a, v) => a.concat(v), [])
    .filter(v => v['SEARCHVAL'].match(/MRT STATION, /))
  console.log(result.length)
  fs.writeFileSync('data/raw.json', JSON.stringify(result, null, '\t'))
})
