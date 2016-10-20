'use strict';

// monday x coordinate = 107
// tuesday x coordinate = 224
// wednesday x coordinate = 340
// thursday x coordiante = 455
// friday x coordinate = 572

var data = {
	scheduledTime1: {
    scheduledTime: new Date(1970, 10, 10, 10, 0),

    days: [
            [new Date(2016, 9, 19, 10, 10), new Date(2016, 9, 19, 10, 14), new Date(2016, 9, 19, 10, 12)],

            [new Date(2016, 9, 19, 10, 14), new Date(2016, 9, 19, 10, 18), new Date(2016, 9, 19, 10, 8)],

            [new Date(2016, 9, 19, 10, 14), new Date(2016, 9, 19, 10, 12), new Date(2016, 9, 19, 10, 13)],

            [new Date(2016, 9, 19, 10, 14), new Date(2016, 9, 19, 10, 18), new Date(2016, 9, 19, 10, 8)],

            [new Date(2016, 9, 19, 10, 14), new Date(2016, 9, 19, 10, 12), new Date(2016, 9, 19, 10, 13)]
          ]
  },

  scheduledTime2: {
    scheduledTime: new Date(1970, 10, 10, 10, 20),

    days: [
            [new Date(2016, 9, 19, 10, 5), new Date(2016, 9, 19, 10, 7), new Date(2016, 9, 19, 8, 24)],

            [new Date(2016, 9, 19, 10, 12), new Date(2016, 9, 19, 10, 09), new Date(2016, 9, 19, 10, 23)],

            [new Date(2016, 9, 19, 8, 19), new Date(2016, 9, 19, 10, 27), new Date(2016, 9, 19, 10, 24)],

            [new Date(2016, 9, 19, 10, 24), new Date(2016, 9, 19, 10, 22), new Date(2016, 9, 19, 10, 23)],

            [new Date(2016, 9, 19, 10, 24), new Date(2016, 9, 19, 10, 23), new Date(2016, 9, 19, 10, 22)]
          ]
  }
};

const scheduledTime = data.scheduledTime1.scheduledTime;

console.log(scheduledTime);

let yMinTime = new Date();
yMinTime.setHours(scheduledTime.getHours());
yMinTime.setMinutes(scheduledTime.getMinutes() - 20);
console.log(yMinTime);
let yMaxTime = new Date();
yMaxTime.setHours(scheduledTime.getHours());
yMaxTime.setMinutes(scheduledTime.getMinutes() + 20);

var d = new Date();

d.setHours(d.getHours())
var d1 = new Date();

var d2 = new Date(2016, 9, 17, 10, 24);
console.log(d);
console.log(d1);
console.log(d2);

const w = 600;
const h = 350;
const padding = 20;

const svg = d3.select('#plots-container')
  .append('div')
  .classed('svg-container', true)
  .attr('id', '#plot1')
  .append('svg')
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 350")
  .classed("svg-content-responsive", true);

const xScale = d3.scale.ordinal()
  .domain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  .rangeBands([0, w - padding]);

const xAxis = d3.svg.axis();
xAxis.scale(xScale);
xAxis.orient("bottom");

const getRandomColor = function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// min domain: scheduled_time - 20 minutes in new Date() format
// max domain: scheduled_time + 20 minutes in new Date() format
var yScale = d3.time.scale()
    .domain([yMinTime, yMaxTime])
    .range([h - 20, 0 + padding]);

var yAxis = d3.svg.axis()
    .outerTickSize(0)
    .scale(yScale)
    .orient('left')
    .ticks(5)
    .tickFormat(d3.time.format("%-I:%M %p"));

// points corresponding to when bus actually came
// const dataSet = [
//     [107, yScale(data.scheduledTime1.days[0][0])],
//     [107, yScale(data.scheduledTime1.days[0][1])],
//     [107, yScale(data.scheduledTime1.days[0][2])],
//     [224, yScale(data.scheduledTime1.days[1][0])],
//     [224, yScale(data.scheduledTime1.days[1][1])],
//     [224, yScale(data.scheduledTime1.days[1][2])],
//     [340, yScale(data.scheduledTime1.days[2][0])],
//     [340, yScale(data.scheduledTime1.days[2][1])],
//     [340, yScale(data.scheduledTime1.days[2][2])]
// ];

//
// const someFunction = function() {
//   for (let scheduledTime in scheduledTimes) {
//     getDataPoints(scheduledTime);
//   }
// }
//
// const getDataPoints = function(scheduledTime) {
//   const dayXValues = { Mon: 107, Tues: 224, Wed: 340, Thurs: 455, Fri: 572 };
//
//   for (let day in scheduledTime.actualTimes) {
//     for (let time in daysTimes) {
//       dataSet.push([dayXValues[day], yScale(time)]);
//     }
//   }
// }

const dataSet = [];

const insertDataPoint = function(data) {
  for (let i = 0; i < Object.keys(data).length; i++) {
    for (let j = 0; j < data.scheduledTime2.days.length; j++) {
      for (let k = 0; k < data.scheduledTime2.days[j].length; k++) {
        if (j === 0) {
          dataSet.push([107, yScale(data.scheduledTime2.days[j][k])]);
        } else if (j === 1) {
          dataSet.push([224, yScale(data.scheduledTime2.days[j][k])]);
        } else if (j === 2) {
          dataSet.push([340, yScale(data.scheduledTime2.days[j][k])]);
        } else if (j === 3) {
          dataSet.push([455, yScale(data.scheduledTime2.days[j][k])]);
        } else if (j === 4) {
          dataSet.push([572, yScale(data.scheduledTime2.days[j][k])]);
        }
      }
    }
  }
};

insertDataPoint(data);

// render circles based on dataSet points
const renderCircles = function(dataPoints, color) {
  const circles = svg.selectAll('circle').data(dataPoints);

  circles.enter().append('circle').attr('r', 2);

  circles
    .attr('cx', (d) => {
    return d[0];
    })
    .attr('cy', (d) => {
      return d[1];
    })
    .style('fill', color);
};

renderCircles(dataSet, getRandomColor);

// appending x and y axis to svg
svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(50," + (h - padding) + ")")
     .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(50, 0)")
    .call(yAxis);
