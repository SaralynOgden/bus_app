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

  const insertPointsIntoArray = function(actualTime, actualTimeArray, dateCreated) {
    const actualTimeJS = getJSDateFromThisWeek(actualTime, dateCreated),
          days = [107, 224, 340, 455, 572];
    console.log(actualTimeJS);

    actualTimeArray.push([days[actualTimeJS.getDay()], 5]); // yScale(actualTime)
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
      plotDictionary[scheduledTime] = dateArray;
    }

    return plotDictionary;
  };

  const plot = function(plotDictionary) {

  };

  $.getJSON(`/data/where?tripId=${tripId}&stopNumber=${stopNumber}`)
    .done((processedTripData) => {
      const plotDictionary = getPlotDictionary(processedTripData);

      console.log(plotDictionary);

      plot(plotDictionary);
    })
    .fail(() => {
      Materialize.toast('Unable to retrieve data', 3000);
    });
})();
