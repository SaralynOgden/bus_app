(function() {
  'use strict';

  $('select').material_select();

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
})();
