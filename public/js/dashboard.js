(function() {
  'use strict';
  $('select').material_select();
  // $('.parallax').parallax(); ???

  // $.getJSON('/user_buses')
  //   .done((user_buses) => {
  //     const busesInfo = $('#user_buses');
  //
  //     for (const busInfo of busesInfo) {
  //       const $anchor = $('<a>')
  //         .attr({
  //           href: `/book.html?
  //                   bus_number=${busInfo.busNumber}?
  //                   stop_number=${busInfo.stopNumber}?
  //                   start_time=${busInfo.startTime}?
  //                   end_time=${busInfo.endTime}`,
  //           'data-delay': '50'
  //         })
  //
  //       const $row = $('<tr>').addClass('row');
  //       const $busNumberCell = $(`<td>${busInfo.busNumber}</td>`);
  //       const $stopNumberCell = $(`<td>${busInfo.stopNumber}</td>`);
  //       const $startTimeCell = $(`<td>${busInfo.startTime}</td>`);
  //       const $endTimeCell = $(`<td>${busInfo.endTime}</td>`);
  //       const $deleteTimeCell = $(`<td>X</td>`)
  //                                 .addClass('deleteCell');
  //     }
  //   })
  //   .fail(() => {
  //     window.location.href = '/signup.html';
  //   });
})();
