const fs = require('fs')
const _sortBy = require('lodash/sortBy')

const stations = require('./data/processed/mrt_stations.json').data

const tally = {}

function dfs (root) {
  const visited = {}
  const unvisited = []
  unvisited.push([{to: root}, [], {
    stops: 0,
    transfers: 0,
    transferAt: [],
    travelTime: 0
  }])

  while (unvisited.length > 0) {
    const [next, path, metrics] = unvisited.pop()
    if (path.some(node => node.to === next.to)) continue
    if (metrics.transfers > 3) continue
    path.push(next)
    visited[next.to] = visited[next.to] || []
    visited[next.to].push(Object.assign({
      from: root,
      to: next.to,
      path: path.slice(1)
    }, metrics))
    stations[next.to].adjacent.forEach(adj => {
      if (stations[adj.station].operational !== 1) return
      unvisited.push([
        {to: adj.station, via: adj.line},
        [...path],
        getMetrics(metrics, adj, next)
      ])
    })
  }

  delete visited[root]

  Object.keys(visited).forEach(key => {
    visited[key] = _sortBy(visited[key], 'travelTime')
    const alternatives = visited[key].filter(test => {
      return !(visited[key].some(alt => (
        (alt.transfers <= test.transfers && alt.stops < test.stops) ||
        (alt.transfers < test.transfers && alt.stops <= test.stops)
      )))
    }).filter((row, i, arr) => row.travelTime <= arr[0].travelTime * 1.2)
    visited[key] = alternatives
    tally[alternatives.length] = tally[alternatives.length] || 0
    tally[alternatives.length]++
    if (alternatives.length > 1) console.log(root, key)
  })

  return visited
}

const routes = Object.keys(stations).reduce((obj, key) => {
  if (stations[key].operational !== 1) return obj
  return Object.assign(obj, {[key]: dfs(key)})
}, {})

function getMetrics (metrics, adj, last) {
  const isTransfer = last.via && (last.via !== adj.line)
  if (!isTransfer) {
    return {
      stops: metrics.stops + 1,
      transfers: metrics.transfers,
      transferAt: metrics.transferAt,
      travelTime: metrics.travelTime + adj.duration
    }
  }
  // console.log(stations[last.to])
  const transfer = stations[last.to].transfers
    .find(row => row.from === last.via && row.to === adj.line)
  const transferTime = (transfer.distance > 100 ? 10
                     : transfer.distance > 0 ? 5
                     : 0) + 2
  return {
    stops: metrics.stops + 1,
    transfers: metrics.transfers + 1,
    transferAt: metrics.transferAt.concat(last.to),
    travelTime: metrics.travelTime + adj.duration + transferTime
  }
}

console.log(tally)

fs.writeFileSync('data/shortest.json', JSON.stringify(routes, null, 2))
