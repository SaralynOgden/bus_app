(function() {
  'use strict';

  const { stopNumber, busNumber, startTime, endTime } = window.QUERY_PARAMETERS;

  if (!stopNumber) {
    window.location.href = '/';
  }



  $.getJSON(`/data/where?tripId=${tripId}&$stopNumber=${stopNumber}`)
  .done((rows) => {


  })
  .fail(() => {
    Materialize.toast('Unable to retrieve data', 3000);
  });
)();

// on time is 8:30 am

// const data = [
//   { day: 'Monday', actualTime: '8:30 am'},
//   { day: 'Tuesday', actualTime: '8:25 am'},
//   { day: 'Wednesday', actualTime: '8:27 am'},
//   { day: 'Thursday', actualTime: '8:32 am'},
//   { day: 'Friday', actualTime: '8:30 am'}
// ];

// const w = $('#plot1').width();
// const h = 500;
// const padding = 20;
//
// const svg = d3.select('#plot1').append('svg')
//   .attr('width', w)
//   .attr('height', h);
//
// const xScale = d3.scale.ordinal()
//   .domain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
//   .rangeBands([0, w]);
//
// const xAxis = d3.svg.axis();
// xAxis.scale(xScale);
// xAxis.orient("bottom");
//
// var customTimeFormat = d3.time.format.multi([
//   ["%-I:%M %p", function(d) { return d.getMinutes() }],
//   ["%-I", function(d) { console.log(d); return d.getHours(); }]
// ]);
//
// // var margin = {top: 250, right: 40, bottom: 250, left: 40},
// //     width = 960 - margin.left - margin.right,
// //     height = 500 - margin.top - margin.bottom;
//
// // Example: Bus scheduled_time -> 8:30 am
//
// // calculating min domain: scheduled_time - 20 minutes in new Date() format
// // calculating max domain: scheduled_time + 20 minutes in new Date() format
// var y = d3.time.scale()
//     .domain([new Date(2016, 9, 18, 8, 10), new Date(2016, 9, 18, 8, 50)])
//     .range([480, 20]);
//
// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient('left')
//     // can make this 1 min and up.
//     .ticks(d3.time.minute, 5)
//     .tickFormat(customTimeFormat);
//
// svg.append("g")
//      .attr("class", "axis")
//      .attr("transform", "translate(50," + (h - padding) + ")")
//      .call(xAxis);
//
// svg.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(50, 0)")
//     .call(yAxis);
>>>>>>> b67620d52bc495eafba408153b7e19b6f0fab7ca
