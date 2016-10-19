(function() {
  'use strict';

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

  const test = moment().diff(moment().startOf('week'),'days');
  console.log(test);
  const today = new Date();
  const date = moment().add(1, 'days');
  console.log(date.format());


  const getJSDateFromThisWeek = function(actualTime, dateCreated) {
    const today = new Date();

    moment().add(dateCreated.getDay() - today.getDay(), 'days');
    return moment().set({hour: parseInt(actualTime.substring(0,2)), minute: parseInt(actualTime.substring(3,5))})
  };

  const insertPointsIntoArray = function(actualTime, actualTimeArray, dateCreated) {
    const actualTimeJS = getJSDateFromThisWeek(actualTime, dateCreated),
          days = [107, 224, 340, 455, 572];

    actualTimeArray.push([days[actualTimeJS.getDay()], yScale(actualTime)]);
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

      console.log('tripDatum = ')
      console.log(tripDatum);
      insertPointsIntoArray(tripDatum.actualTime, actualTimeArray, tripDatum.createdAt);
      plotDictionary[scheduledTime] = dateArray;
    }

    return plotDictionary;
  };

  $.getJSON(`/data/where?tripId=${tripId}&stopNumber=${stopNumber}`)
    .done((processedTripData) => {
      console.log(processedTripData);
      const plotDictionary = getPlotDictionary(processedTripData);

      console.log(plotDictionary);
    })
    .fail(() => {
      Materialize.toast('Unable to retrieve data', 3000);
    });
})();