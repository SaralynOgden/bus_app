/* eslint-disable no-undef */

'use strict';

(function() {
  window.QUERY_PARAMETERS = {};

  if (window.location.search) {
    window.location.search.substr(1).split('&').forEach((paramStr) => {
      const param = paramStr.split('=');

      window.QUERY_PARAMETERS[param[0]] = param[1];
    });
  }

  const { tripId, busNumber, stopNumber, startTime, endTime } = window.QUERY_PARAMETERS;

  if (!stopNumber) {
   window.location.href = '/';
  }

  const getJSDateFromThisWeek = function(actualTime, dateCreated) {
    const today = new Date(),
      createdDate = new Date(Date.parse(dateCreated));

    moment().add(createdDate.getDay() - today.getDay(), 'days');

    return moment().set({hour: parseInt(actualTime.substring(0,2)), minute: parseInt(actualTime.substring(3,5))}).toDate();
  };

  const w = 600;
  const h = 350;
  const padding = 20;

  // const svg = d3.select('#plots-container')
  //   .append('div')
  //   .classed('svg-container', true)
  //   .attr('id', '#plot1')
  //   .append('svg')
  //   .attr("preserveAspectRatio", "xMinYMin meet")
  //   .attr("viewBox", "0 0 600 350")
  //   .classed("svg-content-responsive", true);
  //
  // const xScale = d3.scale.ordinal()
  //   .domain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  //   .rangeBands([0, w - padding]);
  //
  // const xAxis = d3.svg.axis();
  // xAxis.scale(xScale);
  // xAxis.orient("bottom");

  // const getRandomColor = function() {
  //     var letters = '0123456789ABCDEF';
  //     var color = '#';
  //     for (var i = 0; i < 6; i++ ) {
  //         color += letters[Math.floor(Math.random() * 16)];
  //     }
  //     return color;
  // };

  // render circles based on dataSet points
  // const renderCircles = function(data) {
  //   const circles = svg.selectAll('circle').data(data);
  //
  //   circles.enter().append('circle').attr('r', 2);
  //
  //   circles
  //     .attr('cx', (d) => {
  //     return d[0];
  //     })
  //     .attr('cy', (d) => {
  //       return d[1];
  //     })
  //     .style('fill', black);
  // };
  //
  // renderCircles();

  // appending x and y axis to svg
  // svg.append("g")
  //      .attr("class", "axis")
  //      .attr("transform", "translate(50," + (h - padding) + ")")
  //      .call(xAxis);
  //
  // svg.append("g")
  //     .attr("class", "axis")
  //     .attr("transform", "translate(50, 0)")
  //     .call(yAxis);

  const insertPointsIntoArray = function(actualTime, actualTimeArray, dateCreated) {
    const actualTimeJS = getJSDateFromThisWeek(actualTime, dateCreated),
          days = [107, 224, 340, 455, 572];

    let yMinTime = new Date();
    yMinTime.setHours(actualTimeJS.getHours());
    yMinTime.setMinutes(actualTimeJS.getMinutes() - 20);

    let yMaxTime = new Date();
    yMaxTime.setHours(actualTimeJS.getHours());
    yMaxTime.setMinutes(actualTimeJS.getMinutes() + 20);

    const yScale = d3.time.scale()
        .domain([yMinTime, yMaxTime])
        .range([h - 20, 0 + padding]);

    const yAxis = d3.svg.axis()
        .outerTickSize(0)
        .scale(yScale)
        .orient('left')
        .ticks(5)
        .tickFormat(d3.time.format("%-I:%M %p"));

    actualTimeArray.push([days[actualTimeJS.getDay()], yScale(actualTimeJS)]);
  };

  const getPlotDictionary = function(processedTripData) {
    const plotDictionary = {};

    for (let tripDatum of processedTripData) {
      const scheduledTime = tripDatum.scheduledTime;
      let actualTimeArray;

      if (scheduledTime in plotDictionary) {
        actualTimeArray = plotDictionary[scheduledTime];
      } else {
        actualTimeArray = [];
      }

      insertPointsIntoArray(tripDatum.actualTime, actualTimeArray, tripDatum.createdAt);
      plotDictionary[scheduledTime] = actualTimeArray;
      console.log(actualTimeArray[0]);
    }

    return plotDictionary;
  };

  // const plot = function(plotDictionary) {
  //
  // };

  $.getJSON(`/data/where?tripId=${tripId}&stopNumber=${stopNumber}`)
    .done((processedTripData) => {
      const plotDictionary = getPlotDictionary(processedTripData);
      // console.log(plotDictionary);
      // plot(plotDictionary);

    })
    .fail(() => {
      Materialize.toast('Unable to retrieve data', 3000);
    });
})();
