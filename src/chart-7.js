import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

let parseTime = d3.timeParse('%H:%M')

let radius = 300

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90000])
  .range([0, radius])

var angleScale = d3.scaleLinear().range([0, Math.PI * 2])

let averageBirths = 40000

var line = d3
  .radialArea()
  .innerRadius(radiusScale(averageBirths))
  .outerRadius(d => radiusScale(d.total))
  .angle(d => angleScale(d.datetime))

var colorScaleCool = d3.scaleSequential(d3.interpolateCool).domain([0, 90000])

var colorScaleWarm = d3.scaleSequential(d3.interpolateOranges).domain([0, 90000])

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.time)
  })

  var datetimeList = datapoints.map(d => d.datetime)
  angleScale.domain(d3.extent(datetimeList))

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'white')

  var times = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ]

  holder
    .selectAll('.timeText')
    .data(times)
    .enter()
    .append('text')
    .text(d => {
      if (d === '00:00') {
        return d.replace('00:00', 'Midnight')
      } else {
        return d.replace(':00', '')
      }
    })
    .attr('x', 0)
    .attr('y', -radiusScale(50000))
    .attr('transform', d => {
      let degrees = (angleScale(parseTime(d)) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('text-anchor', 'middle')
    .attr('fill', 'lightgrey')
    .attr('font-size', '12')
    .lower()

  holder
    .selectAll('.timeDots')
    .data(times)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', 'lightgrey')
    .attr('cx', 0)
    .attr('cy', -radiusScale(55000))
    .attr('transform', d => {
      let degrees = (angleScale(parseTime(d)) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .lower()

  holder
    .append('circle')
    .attr('r', radiusScale(55000))
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('stroke-width', 2)
    .lower()

  let bands = d3.range(0, 90000, 2000).reverse()

  holder
    .selectAll('.colorBands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', d => {
      if (d <= averageBirths) {
        return colorScaleCool(d)
      } else {
        return colorScaleWarm(d)
      }
    })
    .attr('mask', 'url(#births)')

  holder
    .append('text')
    .attr('x', 0)
    .attr('y', -20)
    .text('EVERYONE!')
    .attr('text-anchor', 'middle')
    .attr('font-weight', '600')
  holder
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .text('is born at 8am')
    .attr('text-anchor', 'middle')
  holder
    .append('text')
    .attr('x', 0)
    .attr('y', 20)
    .text('(read Macbeth for details)')
    .attr('text-anchor', 'middle')
}
