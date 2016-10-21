/* eslint-disable no-undef */
'use strict';

(function() {

  $.getJSON('/dashboard')
    .done((result) => {
      if (!result) {
        window.location.href = '/browse_mode.html';
      }
    })
    .fail((err) => {
      console.log(err);
    });

  $('select').material_select();

  $('#start-time-drop-down, #end-time-drop-down').material_select();

  $('#start-time-drop-down').on('change', function() {
    // eslint-disable-next-line no-invalid-this
    const startTime = $(this).val();
    let endOption1;
    let endOption2;
    const hour = parseInt(startTime.split(':')[0]);
    const minutes = startTime.split(':')[1].split(' ')[0];
    const timeOfDay = startTime.split(':')[1].split(' ')[1];

    $('#end-time-drop-down').children(':not(#first-end-time)').remove();

    if ((minutes) === '30') {
      endOption1 = $(`<option id="endOption1">${hour + 1}:00 ${timeOfDay}</option>`);
      endOption2 = $(`<option id="endOption2">${hour + 1}:30 ${timeOfDay}</option>`);
    } else if ((minutes) === '00') {
      endOption1 = $(`<option id="endOption1">${hour}:30 ${timeOfDay}</option>`);
      endOption2 = $(`<option id="endOption2">${hour + 1}:00 ${timeOfDay}</option>`);
    }

    $('#end-time-drop-down').append(endOption1);
    $('#end-time-drop-down').append(endOption2);

    $('#end-time-drop-down').material_select();
  });

  const deleteTrip = function(id) {
    return function(_event) {
      const options = {
        dataType: 'json',
        type: 'DELETE',
        url: `/trips/${id}`
      };

      $.ajax(options)
        .done((deletedTrip) => {
          $(`#trip_${id}`).remove();
          // window.location.href = dashboard.html;
        })
        .fail(() => {
          Materialize.toast(
            'Unable to delete route. Please try again.', 3000);
        });
    };
  };

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
                    <td>
                      <span class="delete-trip" id="delete_trip_${tripId}">
                        X
                      </span>
                    </td>
                  </tr>`);

    $('tbody').append($row);

    $(`#delete_trip_${tripId}`).click(deleteTrip(tripId));

    // $(`#trip_${tripId}`).click((event) => {
    //   event.preventDefault();
    //   window.location.href = url;
    // });
  };

  $.getJSON('/trips_users')
    .done((userTrips) => {
      for (const userTrip of userTrips) {
        createRow(userTrip.tripId, userTrip.busNumber, userTrip.stopNumber,
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
  };

  const checkIfBusGoesToStop = function(obaObj, data) {
    for (const route of obaObj.data.references.routes) {
      if (route.shortName === data.busNumber) { return true; }
    }

    return false;
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
        createRow(postedTrip.id, postedTrip.busNumber,
          postedTrip.stopNumber, postedTrip.startTime,
          postedTrip.endTime);

        const tripId = postedTrip.id;
        const tripsUsersOptions = {
          contentType: 'application/json',
          data: JSON.stringify({ tripId }),
          dataType: 'json',
          type: 'POST',
          url: '/trips_users'
        };
        $.ajax(tripsUsersOptions)
          .fail((err) => console.log(err));
      })
      .fail((_err) => {
        return Materialize.toast(
          'Unable to create route. Please try again.', 3000);
      });
  };

  const createIfBusStopExists = function(data) {
    $.getJSON(`https://cors-anywhere.herokuapp.com/http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_${data.stopNumber}.json?key=bf764a2e-308a-43f5-9fdc-24a6e6447ae0`)
    .done((obaObj) => {
      if (obaObj.code === 404) {
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
    createIfBusStopExists(data);
  };

  $('#add-route').click(addStopIfInfoIsCorrect);
})();
