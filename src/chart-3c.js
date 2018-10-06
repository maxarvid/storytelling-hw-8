import * as d3 from 'd3'

var margin = { top: 30, left: 20, right: 0, bottom: 0 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.5)

var pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

let radius = 100

var radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([0, radius])

var arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.data.low_temp))
  .outerRadius(d => radiusScale(d.data.high_temp))
  .cornerRadius(0)

var colorScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range(['blue', 'pink'])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log('data is', datapoints)

  var cityNames = datapoints.map(d => d.city)
  xPositionScale.domain(cityNames)

  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  // console.log(nested)

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

      container
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.high_temp))
      container
        .append('circle')
        .attr('r', 3)
        .attr('opacity', 0.5)

      container
        .append('text')
        .datum(nested)
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('y', radius * 1.5)
    })
}
