const fs = require('fs')
const _sortBy = require('lodash/sortBy')

const nodes = require('./data/processed/mrt_stations.json').data

const tally = {}

function dfs (root) {
  const visited = {}
  const unvisited = []
  unvisited.push([{to: root}, [], -1])

  while (unvisited.length > 0) {
    const [next, path, transfers] = unvisited.pop()
    if (path.some(node => node.to === next.to)) continue
    if (transfers > 3) continue
    path.push(next)
    visited[next.to] = visited[next.to] || []
    visited[next.to].push({
      from: root,
      to: next.to,
      stops: path.length - 1,
      transfers,
      transferAt: getTransferAt(path),
      path: path.slice(1)
    })
    nodes[next.to].adjacent.forEach(adj => {
      if (nodes[adj.station].operational !== 1) return
      unvisited.push([
        {to: adj.station, via: adj.line},
        [...path],
        transfers + (next.via !== adj.line)
      ])
    })
  }

  delete visited[root]

  Object.keys(visited).forEach(key => {
    visited[key] = _sortBy(visited[key], ['transfers', 'stops'])
    const alternatives = []
    visited[key].forEach(test => {
      if (visited[key].some(alt => (
        (alt.transfers <= test.transfers && alt.stops < test.stops) ||
        (alt.transfers < test.transfers && alt.stops <= test.stops)
      ))) return
      alternatives.push(test)
    })
    visited[key] = alternatives
    tally[alternatives.length] = tally[alternatives.length] || 0
    tally[alternatives.length]++
  })

  return visited
}

const routes = Object.keys(nodes).reduce((obj, key) => {
  if (nodes[key].operational !== 1) return obj
  return Object.assign(obj, {[key]: dfs(key)})
}, {})

function getTransferAt (path) {
  const transferAt = []
  for (let i = 1; i < path.length - 1; i++) {
    if (path[i].via !== path[i + 1].via) transferAt.push(path[i].to)
  }
  return transferAt
}

console.log(tally)

fs.writeFileSync('data/shortest.json', JSON.stringify(routes, null, 2))
