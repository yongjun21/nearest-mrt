const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const querystring = require('querystring')
const FormData = require('form-data')

const Promise = require('bluebird')

const stations = require('./data/processed/mrt_stations.json').data
const coordinates = {}

// fetchAdjacents()
// fetchEstTravelTime()

function fetchAdjacents () {
  const adjacents = newAdjacents()
  return getOneMapToken().then(token => {
    return Promise.map(Object.keys(adjacents), pair => {
      if (adjacents[pair]) return
      const [orig, dest] = pair.split('.')
      return queryOneMap(orig, dest, token).then(result => {
        if (!result) console.log(orig, dest)
        adjacents[pair] = result
        return Promise.delay(1000)
      }).catch(() => console.log(500, orig, dest))
    }, {concurrency: 4}).then(() => {
      fs.writeFileSync('data/raw/adjacents.json', JSON.stringify(adjacents, null, 2))
      fs.writeFileSync('data/raw/coordinates.json', JSON.stringify(coordinates, null, 2))
    })
  })
}

function fetchEstTravelTime () {
  const adjacents = newAdjacents()
  return getStationValue().then(values => {
    return Promise.map(Object.keys(adjacents), pair => {
      const [orig, dest] = pair.split('.')
      return queryTransitLink(orig, dest, values)
        .then(est => {
          adjacents[pair] = est
        })
    }, {concurrency: 8})
  }).then(() => {
    fs.writeFileSync('data/raw/estTravelTime.json', JSON.stringify(adjacents, null, 2))
  })
}

function queryOneMap (orig, dest, token) {
  const url = 'https://developers.onemap.sg/privateapi/routingsvc/route'
  const config = {
    params: {
      token,
      start: stations[orig].latitude + ',' + stations[orig].longitude,
      end: stations[dest].latitude + ',' + stations[dest].longitude,
      routeType: 'pt',
      mode: 'TRANSIT',
      date: '2018-10-23',
      time: '12:10:00'
    }
  }
  return axios.get(url, config)
    .then(res => {
      const itineraries = res.data.plan.itineraries.filter(iter => {
        return iter.legs.every(leg => leg.mode === 'WALK' || leg.mode === 'SUBWAY')
      })
      if (itineraries.length <= 0) return null
      const journey = itineraries[0].legs.filter(step => step.mode === 'SUBWAY')
      if (journey.length <= 0) return null
      const step = journey[0]
      if (step.from.name.slice(0, -12) !== orig) return null
      if (step.to.name.slice(0, -12) !== dest) return null
      coordinates[step.from.stopId] = [step.from.lon, step.from.lat]
      return {
        distance: step.distance,
        geometry: step.legGeometry.points
      }
    })
}

function queryTransitLink (orig, dest, values) {
  const url = 'https://www.transitlink.com.sg/eservice/eguide/rail_info.php'
  const data = querystring.stringify({
    mrtcode_start: values[orig],
    mrtcode_end: values[dest]
  })
  return axios.post(url, data)
    .then(res => cheerio.load(res.data))
    .then($ => {
      const $table = $('.eguide-table table').eq(1)
      const $td = $table.find('td[rowspan="4"]').eq(1)
      return +$td.text().trim()
    })
}

function getOneMapToken () {
  const url = 'https://developers.onemap.sg/privateapi/auth/post/getToken'
  const form = new FormData()
  form.append('email', process.env.ONEMAP_EMAIL)
  form.append('password', process.env.ONEMAP_PASSWORD)
  return axios.post(url, form, {headers: form.getHeaders()})
    .then(res => res.data.access_token)
}

function getStationValue () {
  const url = 'https://www.transitlink.com.sg/eservice/eguide/rail_idx.php'
  return axios.get(url).then(res => cheerio.load(res.data))
    .then($ => {
      const results = {}
      $('select[name="mrtcode_start"] option').slice(1).each(function () {
        const $option = $(this)
        const text = $option.text().trim()
        const key = text.match(/(.*) \[.*\]$/)[1].toUpperCase()
        const value = $option.attr('value')
        results[key] = value
      })
      return results
    })
}

function newAdjacents () {
  const adjacents = {}
  Object.keys(stations).forEach(orig => {
    if (stations[orig].operational !== 1) return
    stations[orig].adjacent.forEach(adj => {
      const dest = adj.station
      if (stations[dest].operational !== 1) return
      const key = [orig, dest].join('.')
      adjacents[key] = null
    })
  })
  return adjacents
}
