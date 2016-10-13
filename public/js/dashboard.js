(function() {
  'use strict';
<<<<<<< HEAD

  // $('.parallax').parallax(); Why is this here?

  const deleteUserBus = function(url) {
    return function(_event) {
      const options = {
        dataType: 'json',
        type: 'DELETE',
        url
      };

      $.ajax(options)
        .done((deletedUserBus) => {
          $(`${deletedUserBus.busNumber + deletedUserBus.stopNumber +
               deletedUserBus.startTime + deletedUserBus.endTime}`).remove();
        })
        .fail(() => {
          Materialize.toast(
            'Unable to delete route. Please try again.', 3000);
        });
    }
  };

  $.getJSON('/user_buses')
    .done((userBuses) => {

      for (const userBus of userBuses) {
        const id = userBus.id;
        const busNumber = userBus.busNumber;
        const stopNumber = userBus.stopNumber;
        const startTime = userBus.startTime;
        const endTime = userBus.endTime;
        const urlBase = `/post.html?
                    bus_number=${busNumber}&
                    stop_number=${stopNumber}&
                    start_time=${startTime}&
                    end_time=${endTime}`;
        const $row = $(`<tr id="${busNumber + stopNumber +
                                  startTime + endTime}">
                          <td>${busNumber}</td>
                          <td>${stopNumber}</td>
                          <td>${startTime}</td>
                          <td>${endTime}</td>
                          <td>
                            <span id="${"delete_" + busNumber +
                                        stopNumber + startTime + endTime}">
                              X
                            </span>
                          </td>
                        </tr>`);
        $(`#${busNumber + stopNumber + startTime + endTime}`).click(
          (_event) => window.location.href = url;
        );
        $(`#${"delete_" + busNumber + stopNumber + startTime + endTime}`)
            .click(deleteUserBus(`/delete/:id`));
      }
    })
    .fail(() => {
      window.location.href = '/signup.html';
    });
=======
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
>>>>>>> a2f76c8fda5e4af2a2ac73cfe547837b86e77959
})();
