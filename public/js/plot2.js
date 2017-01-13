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
      hour = hourStr;
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

  // Takes the data from the stop_# table and creates a dictionary of the form:
  // dictionary = {
  //    'scheduledTime1' : ['actualTime1', 'actualTime2'],
  //    'scheduledTime2' : ['actualTime1', 'actualTime2']
  // }
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

  

  $.getJSON(`/data/where?tripId=${tripId}&stopNumber=${stopNumber}`)
    .done((processedTripData) => {
      const plotDictionary = getPlotDictionary(processedTripData);

      buildPlots(plotDictionary);
    })
    .fail(() => {
      Materialize.toast('Unable to retrieve data', 3000);
    });
})();
