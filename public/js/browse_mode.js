/* eslint-disable no-undef */
'use strict';

(function() {
  // added to convert times from military to normal
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

  const createRow = function(tripId, busNumber, stopNumber, startTime, endTime) {
    const url = `/plot.html?tripId=${tripId}&stopNumber=${stopNumber}&busNumber=${busNumber}&startTime=${startTime}&endTime=${endTime}`;
    const $row = $(`<tr id="trip_${tripId}">
                    <td>${busNumber}</td>
                    <td>${stopNumber}</td>
                    <td>${getHumanReadableTime(startTime)}</td>
                    <td>${getHumanReadableTime(endTime)}</td>
                  </tr>`);

    $('tbody').append($row);
    $(`#trip_${tripId}`).click((event) => {
      event.preventDefault();
      window.location.href = url;
    });
  };

  $.getJSON('/trips')
    .done((trips) => {
      for (const trip of trips) {
        createRow(trip.id, trip.busNumber, trip.stopNumber,
                  trip.startTime, trip.endTime);
      }
    })
    .fail((err) => {
      console.log(err);
    });
})();
