'use strict'

$('select').material_select();

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

const createRow = function(id, busNumber, stopNumber, startTime, endTime) {
  const url = `/post.html?
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
        $('tbody').append($row);
        $(`#${busNumber + stopNumber + startTime + endTime}`).click(
          (event) => {
          event.preventDefault();
          window.location.href = url;
        });
        $(`#${"delete_" + busNumber + stopNumber + startTime + endTime}`)
            .click(deleteUserBus(`/delete/:id`));
};

$.getJSON('/user_buses')
  .done((userBuses) => {
    for (const userBus of userBuses) {
      createRow(userBus.id, userBus.busNumber, userBus.stopNumber,
                userBus.startTime, userBus.endTime);
    }
  })
  .fail(() => {
    console.log(':(');
  });

const addRoute = function(event) {
  event.preventDefault();
  const stopNumber = $('#stop-number').val();
  const busNumber = $('#bus-number').val();
  let startTime = $('#start-time-drop-down')[0].value;
  let endTime = $('#end-time-drop-down')[0].value;

  if (!stopNumber || !stopNumber.trim()) {
    return Materialize.toast('Stop number must not be blank', 3000);
  }

  if (!busNumber || !busNumber.trim()) {
    return Materialize.toast('Bus number name must not be blank', 3000);
  }

  if (!startTime) {
    return Materialize.toast('Start time must not be blank', 3000);
  }

  if (!endTime) {
    return Materialize.toast('End time must not be blank', 3000);
  }

  const options = {
    contentType: 'application/json',
    data: JSON.stringify({ busNumber, stopNumber, startTime, endTime }),
    dataType: 'json',
    type: 'POST',
    url: '/user_buses'
  };

  $.ajax(options)
    .done((postedUserBus) => {
      createRow(postedUserBus[0].id, postedUserBus[0].busNumber,
        postedUserBus[0].stopNumber, postedUserBus[0].startTime,
        postedUserBus[0].endTime);
    })
    .fail(() => {
      Materialize.toast(
        'Unable to create route. Please try again.', 3000);
    });
};

$('#add-route').click(addRoute);
