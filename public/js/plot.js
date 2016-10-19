(function() {
  'use strict';

  const { stopNumber, busNumber, startTime, endTime } = window.QUERY_PARAMETERS;

  if (!stopNumber) {
    window.location.href = '/';
  }

  const getJSDateInPDT = function(sqlDate) {
    const year = sqlDate.substring(0, 4),
          month = sqlDate.substring(5, 7) - 1,
          date = sqlDate.substring(8, 10),
          hour = sqlDate.substring(11, 13),
          minute = sqlDate.substring(14, 16)
          dateInGMT = new Date(year, month, date, hour, minute);

    return new Date(dateInGMT.getTime() - 7 * 60 * 60 * 1000)
  };

  const getScheduledTimeDictionary = function(processedTripData) {
    const scheduledTimeDictionary = {};

    for (let tripDatum of processedTripData) {
      const scheduledTime = getJSDateInPDT(tripDatum.scheduledTime);
      let dateArray;

      if (scheduledTime in scheduledTimeDictionary) {
        dateArray = scheduledTimeDictionary[scheduledTime];
      } else {
        dateArray = [[], [], [], [], []];
      }

      dateArray = insertActualTimeInDateArray(tripDatum.actualTime, dateArray);
      scheduledTimeDictionary[scheduledTime] = dateArray;
    }

    return scheduledTimeDictionary;
  };

  const insertActualTimeInDateArray = function(actualTime, dateArray) {
    const actualTimeJS = getJSDateInPDT(actualTime);

    dateArray[acutalTime.getDay()].push(actualTime);

    return dateArray;
  };

  $.getJSON(`/data/where?tripId=${tripId}&stopNumber=${stopNumber}`)
  .done((rows) => {
    const processedTripData = decamelizeKeys(rows),
          scheduledTimeDictionary = getScheduledTimeDictionary(processedTripData);
  })
  .fail(() => {
    Materialize.toast('Unable to retrieve data', 3000);
  });
)();
