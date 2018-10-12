const fs = require('fs')
const axios = require('axios')
const googleapis = require('@st-graphics/backend/client/googleapis')
const _flatten = require('lodash/flatten')

const tables = ['MRT_existing', 'MRT_future']

tables.forEach(key => {
  fetchSheetsData(key).then(data => {
    const queries = data.map(row => {
      return searchOneMap(row.station_name + ' MRT').then(results => {
        row.geolocations = results.filter(row =>
          row.BUILDING.match(/MRT STATION EXIT .$/) ||
          row.BUILDING.match(/MRT STATION {2}\(.*\)$/)
        )
        return row
      })
    })
    return Promise.all(queries)
  }).then(data => {
    fs.writeFileSync(`data/raw/${key}.json`, JSON.stringify(data, null, 2))
  })
})

function fetchSheetsData (key) {
  const params = {
    spreadsheetId: '1tPiO_4drSOmT06z21jBeSCz11xB2WzrOAmpp32c4f8c',
    range: key + '!A1:I'
  }
  return googleapis.sheets.spreadsheets.values.download(params)
    .then(res => res.data.values)
}

function searchOneMap (searchVal, pageNum) {
  const url = 'https://developers.onemap.sg/commonapi/search'
  const options = {
    params: {
      searchVal,
      returnGeom: 'Y',
      getAddrDetails: 'Y',
      pageNum: pageNum || 1
    }
  }

  if (pageNum) return axios.get(url, options).then(res => res.data.results)
  return axios.get(url, options).then(res => {
    const totalPages = Math.ceil(res.data.found / 10)
    const results = []
    results.push(res.data.results)
    for (let i = 2; i <= totalPages; i++) {
      results.push(searchOneMap(searchVal, i))
    }
    return Promise.all(results).then(_flatten)
  })
}
