import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// Grab & create SVG
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Creating the machinery for pie chart and some scales
var pie = d3.pie().value(function(d) {
  return d.minutes
})

let radius = 100

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var labelArc = d3
  .arc()
  .innerRadius(radius + 5)
  .outerRadius(radius + 5)

var colorScale = d3.scaleOrdinal().range(['pink', 'cyan', 'magenta', 'mauve'])

// Reading in the data
d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Ready function go!
function ready(datapoints) {
  // console.log(pie(datapoints)[0].data.task)
  // centering it all on the svg
  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // The chart itself
  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task))

  // Slapping on the text.
  // console.log(labelArc.centroid(pie(datapoints)[0]))

  container
    .selectAll('text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
    .attr('text-anchor', d => {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}
