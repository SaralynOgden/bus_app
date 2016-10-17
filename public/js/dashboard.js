(function() {
  'use strict'

  $('select').material_select();

  const deleteTrip = function(id) {
    return function(_event) {
      const options = {
        dataType: 'json',
        type: 'DELETE',
        url: `/trip/${id}`
      };

      $.ajax(options)
        .done((deletedTrip) => {
          $(`${deletedTrip.busNumber + deletedTrip.stopNumber +
                 deletedTrip.startTime + deletedTrip.endTime}`).remove();
        })
        .fail(() => {
            Materialize.toast(
              'Unable to delete route. Please try again.', 3000);
        });
    }
  };

  // added to convert times from military to normal
  const convertTime = function(time) {
    let hour;
    let minute = time.substr(2, 3);
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

  const createRow = function(busNumber, stopNumber, startTime, endTime) {
    startTime = convertTime(startTime);
    endTime = convertTime(endTime);

    const url = `/post.html/:id`;
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
            .click(deleteTrip(id));
  };

  $.getJSON('/trips_users')
    .done((userTrips) => {
      for (const userTrip of userTrips) {
        createRow(userTrip.busNumber, userTrip.stopNumber,
                  userTrip.startTime, userTrip.endTime);
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
    for (let route of obaObj.data.references.routes) {
      if (route.shortName === data.busNumber) { return true };
    }

    return false
  };

  const postTrip = function(data) {
    const tripsOptions = {
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      type: 'POST',
      url: '/trips'
    };

    $.ajax(tripsOptions)
      .done((postedTrip) => {
        createRow(postedTrip.busNumber,
          postedTrip.stopNumber, postedTrip.startTime,
          postedTrip.endTime);

        const tripsUsersOptions = {
          contentType: 'application/json',
          data: JSON.stringify({postedTrip.id}),
          dataType: 'json',
          type: 'POST',
          url: '/trips_users'
        };
        $.ajax(tripsUsersOptions)
          .done((postedTripsUsers) => console.log(postedTripsUsers))
          .fail((err) => console.err(err));
      })
      .fail(() => {
        return Materialize.toast(
          'Unable to create route. Please try again.', 3000);
      });
  };

  const createIfBusStopExists = function (data) {
    $.getJSON(`https://cors-anywhere.herokuapp.com/http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_${data.stopNumber}.json?key=bf764a2e-308a-43f5-9fdc-24a6e6447ae0`)
    .done((obaObj) => {
      if (obaObj.code === 404) {
        console.log(obaObj);
        return Materialize.toast('No such stop number', 3000);
      }

      if (checkIfBusGoesToStop(obaObj, data)) {
        postTrip(data);
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
    // checkIfHourInterval()
    createIfBusStopExists(data);
  };

  const checkTimes = function(event) {
    event.preventDefault();
    const startTime = $('#start-time-drop-down')[0].value;
    const endTime = $('#end-time-drop-down')[0].value;

    if (startTime === endTime) {
      return Materialize.toast('start and end cant be same.');
    } else if (startTime === '12:00 pm' && endTime !== '1:00 pm') {
      return Materialize.toast('12 error.');
    } else if (startTime.length === 7 && endTime.length === 7 && Math.abs(parseInt(startTime.substr(0, 1)) - parseInt(endTime.substr(0, 1))) > 1) {
      return Materialize.toast('make error.');
    } else if (startTime.length === 7 && endTime.length === 8 && Math.abs(parseInt(startTime.substr(0, 1)) - parseInt(endTime.substr(0, 2))) > 1) {
      return Materialize.toast('another error.');
    } else if (startTime.length === 8 && endTime.length === 8 && startTime.substr(2, 3) === '30' && endTime.substr(2, 3) === '00' && Math.abs(parseInt(startTime.substr(0, 2)) - parseInt(endTime.substr(0, 2))) > 1) {
      return Materialize.toast('two digit error.');
    }
  }

  $('#add-route').click(addStopIfInfoIsCorrect);
})();
