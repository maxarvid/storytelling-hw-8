import * as d3 from 'd3'

var margin = { top: 30, left: 20, right: 20, bottom: 30 }
var height = 450 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.5)

let radius = 80

let radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([30, radius])

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var cityNames = datapoints.map(d => d.city)
  xPositionScale.domain(cityNames)

  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  // console.log(nested)

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('font-weight', '600')
    .attr('font-size', '24')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
  svg
    .append('text')
    .text('in cities around the world')
    .attr('font-size', '16')
    .attr('x', width / 2)
    .attr('y', 8)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'hanging')

  svg
    .selectAll('.city-temps')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'city-temps')
    .attr('transform', d => {
      return `translate(${xPositionScale(d.key)},${height / 2})`
    })
    .each(function(d) {
      var container = d3.select(this)
      var datapoints = d.values
      datapoints.push(datapoints[0])

      container
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'rgb(0, 0, 255, 0.5')

      let bands = [20, 40, 60, 80, 100]

      container
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke', 'lightgrey')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      let bandLabels = [20, 60, 100]

      container
        .selectAll('.scale-text')
        .data(bandLabels)
        .enter()
        .append('text')
        .text(d => d + '°')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)
        .attr('text-anchor', 'middle')
        .attr('font-size', 8)
        .lower()

      container
        .append('text')
        .datum(d)
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-weight', '600')
        .attr('font-size', '14')
    })
}
