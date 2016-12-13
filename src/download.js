import fs from 'fs'
import range from 'lodash/range'
import fetch from 'node-fetch'

// Promise.all(generateApiCalls('mrt station', 80)).then(results => {
//   const result = results.reduce((a, v) => a.concat(v), [])
//     .filter(v => v['SEARCHVAL'].match(/MRT STATION, /))
//   console.log(result.length)
//   fs.writeFileSync('data/raw/mrt.json', JSON.stringify(result, null, '\t'))
// })

Promise.all(generateApiCalls('lrt station', 50)).then(results => {
  const result = results.reduce((a, v) => a.concat(v), [])
  console.log(result.length)
  fs.writeFileSync('data/raw/lrt.json', JSON.stringify(result, null, '\t'))
})

function generateApiCalls (searchVal, pages) {
  return range(pages).map(i => {
    const url = 'https://developers.onemap.sg/commonapi/search?searchVal=' + searchVal +
      '&returnGeom=Y&getAddrDetails=Y&pageNum=' + (i + 1)
    return fetch(url)
      .then(res => res.json())
      .then(json => json.results)
  })
}
