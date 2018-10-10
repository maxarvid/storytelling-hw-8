import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }

let height = 330 - margin.top - margin.bottom
let width = 275 - margin.left - margin.right

let container = d3.select('#chart-9')

let maxMinutes = 60
let maxPoints = 30
let maxFG = 10
let max3P = 5
let maxFT = 10
let maxRebounds = 15
let maxAssists = 10
let maxSteals = 5
let maxBlocks = 5

let longTeamNames = {
  CLE: 'Cleveland Cavaliers',
  GSW: 'Golden State Warriors',
  SAS: 'San Antonio Spurs',
  MIN: 'Minnesota Timberwolves',
  MIL: 'Milwaukee Bucks',
  PHI: 'Philadelphia 76ers',
  OKC: 'Oklahoma City Thunder',
  NOP: 'New Orleans Pelicans',
  HOU: 'Houston Rockets'
}

let radius = 100

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
  var nested = d3
    .nest()
    .key(d => d.Name)
    .entries(datapoints)

  container
    .selectAll('.player-stats')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('class', 'player-stats')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    .each(function(d) {
      var svg = d3.select(this)

      let player = d.values[0]

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

      console.log(longTeamNames[d.values[0].Team])

      let bands = [2, 4, 6, 8, 10]

      svg
        .append('text')
        .text(d => d.key)
        .attr('x', 0)
        .attr('y', -height / 2)
        .attr('text-anchor', 'middle')

      svg
        .append('text')
        .text(d => longTeamNames[d.values[0].Team])
        .attr('x', 0)
        .attr('y', -height / 2)
        .attr('dy', 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)

      svg
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
            return '#e8e7e5'
          }
        })
        .attr('stroke', 'none')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      svg
        .append('mask')
        .attr('id', d => `${d.key.replace(' ', '-')}`)
        .append('path')
        .datum(customPlayer)
        .attr('d', line)
        .attr('fill', 'white')
        .attr('stroke', 'none')

      svg
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

      svg
        .append('g')
        .attr('class', d.values[0].Team)
        .selectAll('.magic-band')
        .data(bands.reverse())
        .enter()
        .append('circle')
        .attr('class', 'magic-band')
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
        .attr('mask', `url(#${d.key.replace(' ', '-')})`)

      svg
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
        .attr('font-size', 8)

      svg
        .append('text')
        .text('0')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 8)

      svg
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
        .attr('font-size', 8)

      svg
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
        .attr(
          'transform',
          `rotate(${(angleScale('Field Goals') / Math.PI) * 180})`
        )
        .attr('font-size', 8)

      svg
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
        .attr(
          'transform',
          `rotate(${(angleScale('3-Point Field Goals') / Math.PI) * 180})`
        )
        .attr('font-size', 8)

      svg
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
        .attr(
          'transform',
          `rotate(${(angleScale('Free Throws') / Math.PI) * 180})`
        )
        .attr('font-size', 8)

      svg
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
        .attr(
          'transform',
          `rotate(${(angleScale('Rebounds') / Math.PI) * 180})`
        )
        .attr('font-size', 8)

      svg
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
        .attr('font-size', 8)

      svg
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
        .attr('font-size', 8)

      svg
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
        .attr('font-size', 8)
    })
}
