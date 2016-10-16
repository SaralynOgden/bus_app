(function() {
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
    .fail((err) => {
      console.log(err);
    });

  const checkIfAllFieldsHaveValues = function (stopNumber, busNumber, startTime, endTime) {
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
  }

  const checkIfBusGoesToStop = function(obaObj, data) {
    console.log(obaObj.data.references.routes);
    console.log(data.busNumber);
    for (let route in obaObj.data.references.routes) {
      if (route.shortName === data.busNumber) { return true };
    }

    return false
  };

  const postBus = function(data) {
    const options = {
      contentType: 'application/json',
      data: JSON.stringify(data),
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
        return Materialize.toast(
          'Unable to create route. Please try again.', 3000);
      });
  }

  const createIfBusStopExists = function (data) {
    $.getJSON(`https://cors-anywhere.herokuapp.com/http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_${data.stopNumber}.json?key=bf764a2e-308a-43f5-9fdc-24a6e6447ae0`)
    .done((obaObj) => {
      if (obaObj.code === 404) {
        return Materialize.toast('No such stop number', 3000);
      }
      if (checkIfBusGoesToStop(obaObj, data)) {
        postBus(data)
      } else {
        return Materialize.toast('No such bus number at stop', 3000);
      }
    })
    .fail((err) => console.log(err));
  };

  const addStopIfInfoIsCorrect = function(event) {
    event.preventDefault();
    const stopNumber = $('#stop-number').val();
    const busNumber = $('#bus-number').val();
    const startTime = $('#start-time-drop-down')[0].value;
    const endTime = $('#end-time-drop-down')[0].value;
    const data = { busNumber, stopNumber, startTime, endTime };

    checkIfAllFieldsHaveValues(stopNumber, busNumber, startTime, endTime);
    console.log('here');
    createIfBusStopExists(data);
  };

  $('#add-route').click(addStopIfInfoIsCorrect);

})();
