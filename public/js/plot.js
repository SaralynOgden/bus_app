(function() {
  'use strict';

  const moment = require('moment');
  //
  // const { stopNumber, busNumber, startTime, endTime } = window.QUERY_PARAMETERS;
  //
  // if (!stopNumber) {
  //   window.location.href = '/';
  // }
  //
  // const getJSDateInPST = function(sqlDate) {
  //   const year = sqlDate.substring(0, 4),
  //         month = sqlDate.substring(5, 7) - 1,
  //         date = sqlDate.substring(8, 10),
  //         hour = sqlDate.substring(11, 13),
  //         minute = sqlDate.substring(14, 16)
  //         dateInGMT = new Date(year, month, date, hour, minute);
  //
  //   return new Date(dateInGMT.getTime() - 7 * 60 * 60 * 1000);
  // };
  //
  // const getScheduledTimeDictionary = function(processedTripData) {
  //   const scheduledTimeDictionary = {};
  //
  //   for (let tripDatum of processedTripData) {
  //     const scheduledTime = getJSDateInPST(tripDatum.scheduledTime);
  //     let dateArray;
  //
  //     if (scheduledTime in scheduledTimeDictionary) {
  //       dateArray = scheduledTimeDictionary[scheduledTime];
  //     } else {
  //       dateArray = [[], [], [], [], []];
  //     }
  //
  //     dateArray = insertActualTimeInDateArray(tripDatum.actualTime, dateArray);
  //     scheduledTimeDictionary[scheduledTime] = dateArray;
  //   }
  //
  //   return scheduledTimeDictionary;
  // };
  //
  // const insertActualTimeInDateArray = function(actualTime, dateArray) {
  //   const actualTimeJS = getJSDateInPST(actualTime),
  //         currentTime = new Date();
  //
  //   actualTimeJS.setYear(currentTime.getFullYear());
  //   actualTimeJS.setMonth(currentTime.getMonth());
  //
  //   dateArray[acutalTime.getDay()].push(actualTime);
  //
  //   return dateArray;
  // };
  //
  // $.getJSON(`/data/where?tripId=${tripId}&stopNumber=${stopNumber}`)
  // .done((rows) => {
  //   const processedTripData = decamelizeKeys(rows),
  //         scheduledTimeDictionary = getScheduledTimeDictionary(processedTripData);
  // })
  // .fail(() => {
  //   Materialize.toast('Unable to retrieve data', 3000);
  // });
  // const test = moment().diff(moment().startOf('week'),'days');
  // console.log(test);
  // const today = new Date();
  const date = moment().add(1, 'days');
  console.log(date.format());
})();
