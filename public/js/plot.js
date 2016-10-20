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

  const getHumanReadableTime = function(time) {
    let hour;
    const minute = time.substr(2, 3);
    let timeOfDay;

    if (parseInt(time.substr(0, 2)) > 12) {
      timeOfDay = 'pm';
      hour = parseInt(time.substr(0, 2)) - 12;
    } else if (parseInt(time.substr(0, 2)) === 10 || parseInt(time.substr(0, 2)) === 11) {
      timeOfDay = 'am';
      hour = time.substr(0, 2);
    } else {
      timeOfDay = 'am';
      hour = time.substr(1, 1);
    }

    time = `${hour}${minute} ${timeOfDay}`;

    return time;
  };

  const earliestDeparture = getHumanReadableTime(startTime);
  const latestDeparture = getHumanReadableTime(endTime);

  const w = 600;
  const h = 350;
  const padding = 20;

  $('#bus-number').append(` ${busNumber}`);
  $('#stop-number').append(` ${stopNumber}`);
  $('#earliest-departure').append(` ${startTime}`);
  $('#latest-departure').append(` ${endTime}`);

  const getJSDateFromThisWeek = function(actualTime, dateCreated) {
    const today = new Date(),
      createdDate = new Date(Date.parse(dateCreated));

    moment().add(createdDate.getDay() - today.getDay(), 'days');

    return moment().set({hour: parseInt(actualTime.substring(0,2)), minute: parseInt(actualTime.substring(3,5))}).toDate();
  };

  const insertPointsIntoArray = function(actualTime, actualTimeArray, dateCreated) {
    const actualTimeJS = getJSDateFromThisWeek(actualTime, dateCreated),
          days = [107, 224, 340, 455, 572];

    actualTimeArray.push([days[actualTimeJS.getDay()], actualTimeJS]);
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
    }

    return plotDictionary;
  };

  const buildXAxis = function (i, svg, plotDictionary) {
    const xScale = d3.scale.ordinal()
      .domain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
      .rangeBands([0, w - padding]);

    const xAxis = d3.svg.axis();
      xAxis.scale(xScale);
      xAxis.orient("bottom");

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(50," + (h - padding) + ")")
      .call(xAxis);
  };

  const buildYAxis = function(i, svg, plotDictionary, points) {
    let yMinTime = new Date();
    yMinTime.setHours(Object.keys(plotDictionary)[i].substring(0, 2));
    yMinTime.setMinutes(parseInt(Object.keys(plotDictionary)[i].substring(3, 5)) - 20);

    let yMaxTime = new Date();
    yMaxTime.setHours(Object.keys(plotDictionary)[i].substring(0, 2));
    yMaxTime.setMinutes(parseInt(Object.keys(plotDictionary)[i].substring(3, 5)) + 20);

    const yScale = d3.time.scale()
      .domain([yMinTime, yMaxTime])
      .range([h - 20, 0 + padding]);

    const yAxis = d3.svg.axis()
      .outerTickSize(0)
      .scale(yScale)
      .orient('left')
      .ticks(5)
      .tickFormat(d3.time.format("%-I:%M %p"));

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(50, 0)")
      .call(yAxis);

    yScaleTime(points, yScale);
  };

  const yScaleTime = function(points, yScale) {
    for (let i = 0; i < points.length; i++) {
      points[i][1] = yScale(points[i][1]);
    }
  };

  const renderCircles = function(points, svg) {
    const circles = svg.selectAll('circle').data(points);

    circles.enter().append('circle').attr('r', 2);

    circles
      .attr('cx', (d) => d[0])
      .attr('cy', (d) => d[1])
      .style('fill', 'black');
  };

  const buildPlots = function(plotDictionary) {
    let numberOfPlots = Object.keys(plotDictionary).length;
    for (let i = 0; i < numberOfPlots; i++) {
      const svg = d3.select('#plots-container')
        .append('div')
        .classed('svg-container', true)
        .attr('id', `#plot${i}`)
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 350")
        .classed("svg-content-responsive", true);

      const scheduledTime = Object.keys(plotDictionary)[i];
      const points = plotDictionary[scheduledTime];
      buildXAxis(i, svg, plotDictionary);
      buildYAxis(i, svg, plotDictionary, points)
      renderCircles(points, svg);
    }
  };

  $.getJSON(`/data/where?tripId=${tripId}&stopNumber=${stopNumber}`)
    .done((processedTripData) => {
      const plotDictionary = getPlotDictionary(processedTripData);
      buildPlots(plotDictionary);
    })
    .fail(() => {
      Materialize.toast('Unable to retrieve data', 3000);
    });
})();
