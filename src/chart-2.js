import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// Grab & create SVG
var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Creating the machinery for pie chart and some scales
var pie = d3.pie().value(function(d) {
  return d.minutes
})

let radius = 80

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var colorScale = d3.scaleOrdinal().range(['pink', 'cyan', 'magenta', 'mauve'])

var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.5)

// Reading in the data
d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Ready function go!
function ready(datapoints) {
  // console.log('data is', datapoints)

  // Creating a domain for our xPositionScale
  var pieNames = datapoints.map(d => d.project)
  xPositionScale.domain(pieNames)

  // Nesting the data by project
  var nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  // console.log(pie(nested[0].values))
  // console.log(nested)

  svg
    .selectAll('.project-pies')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'project-pies')
    .attr('transform', d => {
      return `translate(${xPositionScale(d.key)},${height / 2})`
    })
    .each(function(d) {
      var container = d3.select(this)

      // The pies
      container
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      // console.log(d.key)
      // The pie labels
      container
        .append('text')
        .datum(nested)
        .text(d.key)
        .attr('x', 0)
        .attr('y', radius)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'hanging')
        .attr('dy', 10)
    })
}
