import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

var pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

let radius = 200

var radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([0, radius])

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp))
  .cornerRadius(5)

var colorScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range(['blue', 'pink'])

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log('data is', datapoints)
  // console.log(pie(datapoints))

  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.high_temp))

  let title = 'NYC high temperatures, by month'

  container
    .datum(title)
    .append('text')
    .text(title)
    .attr('x', 0)
    .attr('y', -radius / 2)
    .attr('dy', -15)
    .attr('text-anchor', 'middle')
    .attr('font-weight', '600')

  container
    .append('circle')
    .attr('r', 3)
    .attr('opacity', 0.5)
}
