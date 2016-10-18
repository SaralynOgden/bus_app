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
