/* eslint-disable no-undef, max-statements, max-params */
'use strict';

(function() {
  window.QUERY_PARAMETERS = {};

  if (window.location.search) {
    window.location.search.substr(1).split('&').forEach((paramStr) => {
      const param = paramStr.split('=');

      window.QUERY_PARAMETERS[param[0]] = param[1];
    });
  }

  const { tripId, busNumber, stopNumber, startTime, endTime } =
window.QUERY_PARAMETERS;

  if (!stopNumber) {
    window.location.href = '/';
  }

  const getHumanReadableTime = function(time) {
    let hour;
    const hourStr = time.substr(0, 2);
    const minute = time.substr(2, 3);
    let timeOfDay;

    if (parseInt(hourStr) > 12) {
      timeOfDay = 'pm';
      hour = parseInt(hourStr) - 12;
    } else if (parseInt(hourStr) === 10 || parseInt(hourStr) === 11) {
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
  const width = 900;
  const height = 500;
  const padding = 110;

  $('#bus-number').append(` ${busNumber}`);
  $('#stop-number').append(` ${stopNumber}`);
  $('#earliest-departure').append(` ${earliestDeparture}`);
  $('#latest-departure').append(` ${latestDeparture}`);

  const getJSDateFromThisWeek = function(actualTime) {
    const today = new Date();
    const adjustedDate = moment().set({ hour:
      parseInt(actualTime.substring(0, 2)) - 7,
       minute: parseInt(actualTime.substring(3, 5)) }).toDate();

    return moment(adjustedDate).set({ year: today.getFullYear(),
      month: today.getMonth(), date: today.getDate() }).toDate();
  };

  const insertPointsIntoArray = function(actualTime, actualTimeArray,
    dateCreated) {
    const actualTimeJS = getJSDateFromThisWeek(actualTime);
    const days = [190, 350, 508, 664, 824];

    actualTimeArray.push([days[moment(dateCreated).toDate().getDay() - 1],
    actualTimeJS]);
  };

  const getPlotDictionary = function(processedTripData) {
    const plotDictionary = {};

    for (const tripDatum of processedTripData) {
      const scheduledTime = moment(getJSDateFromThisWeek(
        tripDatum.scheduledTime)).format('HH:mm:ss');
      let actualTimeArray;

      if (scheduledTime in plotDictionary) {
        actualTimeArray = plotDictionary[scheduledTime];
      } else {
        actualTimeArray = [];
      }

      insertPointsIntoArray(tripDatum.actualTime, actualTimeArray,
         tripDatum.createdAt);
      plotDictionary[scheduledTime] = actualTimeArray;
    }

    return plotDictionary;
  };

  const buildXAxis = function(i, svg) {
    const xScale = d3.scale.ordinal()
      .domain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
      .rangeBands([padding, width]);
    const xAxis = d3.svg.axis();

    xAxis.scale(xScale)
         .orient('bottom')
         .outerTickSize(0)
         .ticks(5);

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height - padding})`)
      .call(xAxis);
  };

  const yScaleTime = function(points, yScale) {
    for (let i = 0; i < points.length; i++) {
      points[i][1] = yScale(points[i][1]);
    }
  };

  const buildYAxis = function(plotDictionary, i, svg, points) {
    const scheduledTime = new Date();

    scheduledTime.setHours(Object.keys(plotDictionary)[i].substring(0, 2));
    scheduledTime.setMinutes(Object.keys(plotDictionary)[i].substring(3, 5));

    const yMinTime = new Date();

    yMinTime.setHours(Object.keys(plotDictionary)[i].substring(0, 2));
    yMinTime.setMinutes(
      parseInt(Object.keys(plotDictionary)[i].substring(3, 5)) - 20);

    const yMaxTime = new Date();

    yMaxTime.setHours(Object.keys(plotDictionary)[i].substring(0, 2));
    yMaxTime.setMinutes(
      parseInt(Object.keys(plotDictionary)[i].substring(3, 5)) + 20);

    const yScale = d3.time.scale()
      .domain([yMinTime, yMaxTime]).nice()
      .range([height - padding, padding]);

    const yAxis = d3.svg.axis()
      .outerTickSize(0)
      .scale(yScale)
      .orient('left')
      .ticks(5)
      .tickFormat(d3.time.format('%-I:%M %p'));

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis);

    svg.append('svg:line')
        .attr('x1', padding)
        .attr('x2', width)
        .attr('y1', yScale(scheduledTime))
        .attr('y2', yScale(scheduledTime))
        .style('stroke', '#4DA778')
        .style('stroke-dasharray', ('5, 5'))
        .attr('stroke-width', 1);

    yScaleTime(points, yScale);
  };

  const renderCircles = function(points, svg) {
    const circles = svg.selectAll('circle').data(points);

    circles.enter().append('circle').attr('r', 5).attr('class', 'circles');

    circles
      .attr('cx', (datum) => {
        return datum[0];
      })
      .attr('cy', (datum) => {
        return datum[1];
      })
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 1);
  };

  const buildPlots = function(plotDictionary) {
    const numberOfPlots = Object.keys(plotDictionary).length;

    for (let i = 0; i < numberOfPlots; i++) {
      const svg = d3.select('#plots-container')
        .append('div')
        .classed('svg-container', true)
        .attr('id', `#plot${i}`)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('height', height)
        .attr('width', width)
        .classed('svg-content-responsive', true);

      const scheduledTime = Object.keys(plotDictionary)[i];
      const points = plotDictionary[scheduledTime];

      buildXAxis(i, svg);
      buildYAxis(plotDictionary, i, svg, points);
      renderCircles(points, svg);

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${(padding - 80) / 2}, \
          ${height / 2})rotate(-90)`)
        .attr('font-size', 20)
        .text('Time');

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${(width + 100) / 2}, \
          ${height - padding / 2})`)
        .attr('font-size', 20)
        .text('Day');
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
