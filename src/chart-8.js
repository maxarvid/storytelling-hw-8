import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 450 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

let maxMinutes = 60
let maxPoints = 30
let maxFG = 10
let max3P = 5
let maxFT = 10
let maxRebounds = 15
let maxAssists = 10
let maxSteals = 5
let maxBlocks = 5

let radius = 160

let radiusScale = d3
  .scaleLinear()
  .domain([0, 10])
  .range([0, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(10 * d.value))
  .angle(d => angleScale(d.name))

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let player = datapoints[0]

  let customPlayer = [
    { name: 'Minutes', value: +player.MP / maxMinutes },
    { name: 'Points', value: +player.PTS / maxPoints },
    { name: 'Field Goals', value: +player.FG / maxFG },
    { name: '3-Point Field Goals', value: +player['3P'] / max3P },
    { name: 'Free Throws', value: +player.FT / maxFT },
    { name: 'Rebounds', value: +player.TRB / maxRebounds },
    { name: 'Assists', value: +player.AST / maxAssists },
    { name: 'Steals', value: +player.STL / maxSteals },
    { name: 'Blocks', value: +player.BLK / maxBlocks }
  ]

  var categories = customPlayer.map(d => d.name)
  angleScale.domain(categories)

  let bands = [2, 4, 6, 8, 10]

  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  container
    .append('mask')
    .attr('id', 'player-stats')
    .append('path')
    .datum(customPlayer)
    .attr('d', line)
    .attr('fill', 'white')
    .attr('stroke', 'none')

  container
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('class', 'scale-band')
    .attr('r', d => radiusScale(d))
    .attr('fill', d => {
      if (d % 4 === 0) {
        return '#F6F6F6'
      } else {
        return 'lightgrey'
      }
    })
    .attr('stroke', 'none')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  container
    .selectAll('.category-text')
    .data(categories)
    .enter()
    .append('text')
    .attr('class', 'category-text')
    .text(d => d)
    .attr('x', 0)
    .attr('y', -radiusScale(10))
    .attr('dy', -15)
    .attr('text-anchor', 'middle')
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('font-size', 10)
    .attr('font-weight', 800)

  container
    .selectAll('.magic-band')
    .data(bands.reverse())
    .enter()
    .append('circle')
    .attr('class', 'scale-band')
    .attr('r', d => radiusScale(d))
    .attr('fill', d => {
      if (d % 4 === 0) {
        return '#F6B947'
      } else {
        return '#BB4D3D'
      }
    })
    .attr('stroke', 'none')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('mask', 'url(#player-stats)')

  container
    .selectAll('.label-band')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-band')
    .text(d => (d * maxMinutes) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('font-size', 12)

  container
    .selectAll('.label-points')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-points')
    .text(d => (d * maxPoints) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('Points') / Math.PI) * 180})`)
    .attr('font-size', 12)

  container
    .selectAll('.label-FG')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-FG')
    .text(d => (d * maxFG) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('Field Goals') / Math.PI) * 180})`)
    .attr('font-size', 12)

  container
    .selectAll('.label-3P')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-3P')
    .text(d => (d * max3P) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('3-Point Field Goals') / Math.PI) * 180})`)
    .attr('font-size', 12)

  container
    .selectAll('.label-FT')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-FT')
    .text(d => (d * maxFT) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('Free Throws') / Math.PI) * 180})`)
    .attr('font-size', 12)

  container
    .selectAll('.label-Rebounds')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-Rebounds')
    .text(d => (d * maxRebounds) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('Rebounds') / Math.PI) * 180})`)
    .attr('font-size', 12)

  container
    .selectAll('.label-Assists')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-Assists')
    .text(d => (d * maxAssists) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('Assists') / Math.PI) * 180})`)
    .attr('font-size', 12)

  container
    .selectAll('.label-Steals')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-Steals')
    .text(d => (d * maxSteals) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('Steals') / Math.PI) * 180})`)
    .attr('font-size', 12)


  container
    .selectAll('.label-blocks')
    .data(bands)
    .enter()
    .append('text')
    .attr('class', 'label-blocks')
    .text(d => (d * maxBlocks) / 10)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .attr('transform', `rotate(${(angleScale('Blocks') / Math.PI) * 180})`)
    .attr('font-size', 12)
}
