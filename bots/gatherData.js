'use strict';

const request = require('request');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

const getCurrentStopDictionary = function(currentTrips) {
  const stopDictionary = {};

  for (let currentTrip of currentTrips) {
    const { id, busNumber, stopNumber } = currentTrip;
    const tripInfo = { tripId: id, busNumber };

    if (stopNumber in stopDictionary) {
      const tripsInfoArray = stopDictionary[stopNumber];

      tripsInfoArray.push(tripInfo)
      stopDictionary[stopNumber] = tripsInfoArray;
    } else {
      stopDictionary[stopNumber] = [tripInfo];
    }
  }

  return stopDictionary;
};

const getJSON = function(url) {
  const promise = new Promise((resolve, reject) => {
    request.get(url, (err, res, body, next) => {
      if (err) {
        return reject(err);
      }

      resolve(JSON.parse(body));
    });
  });

  return promise;
};

const getBusIndices = function(arrivalsAndDepartures, busNumber) {
  const busesWithNumber = [];

  for (let i = 0; i < arrivalsAndDepartures.length; i++) {
    if (arrivalsAndDepartures[i].routeShortName === busNumber) {
      busesWithNumber.push(i);
    }
  }

  return busesWithNumber;
};

const insertBusData = function(ajaxResult, busIndices, stopNumber, tripId) {
  for (let i = 0; i < busIndices.length; i++) {
    const busInfo = ajaxResult.data.entry.arrivalsAndDepartures[busIndices[i]];
    const row = {
      tripId,
      scheduledTime: new Date(busInfo.scheduledArrivalTime),
      actualTime: new Date(busInfo.predictedArrivalTime),
      lastUpdateTime: new Date(busInfo.lastUpdateTime),
      distance: parseInt(busInfo.distanceFromStop)
    };

    if (busInfo.predictedArrivalTime !== 0) {
      knex(`stop_${stopNumber}_raw`)
        .insert(decamelizeKeys(row), '*')
        .then((row) => console.log(row))
        .catch((err) => console.error(err));
    }
  }
}

const addTripsInArrayToStopTable = function(ajaxResult, tripsInfo, stopNumber) {
  const arrivalsAndDepartures = ajaxResult.data.entry.arrivalsAndDepartures;
  for (let tripInfo of tripsInfo) {
    const busIndices = getBusIndices(arrivalsAndDepartures, tripInfo.busNumber);
    insertBusData(ajaxResult, busIndices, stopNumber, tripInfo.tripId);
  }
};

module.exports = {
  start: function() {
    // Move time be on GMT like Heroku
    const currentTimeJS = new Date(Date.now() - 7 * 60 * 60 * 1000),
      currentTimeSQL = `${currentTimeJS.getHours()}:${currentTimeJS.getMinutes()}:00`;

    knex('trips')
      .where('start_time', '<', currentTimeSQL)
      .andWhere('end_time', '>', currentTimeSQL)
      .then((rows) => {
        console.log(currentTimeSQL);
        const currentTrips = camelizeKeys(rows),
        currentStopDictionary = getCurrentStopDictionary(currentTrips);

        for (let stopNumber in currentStopDictionary) {
          getJSON(`http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_${stopNumber}.json?key=bf764a2e-308a-43f5-9fdc-24a6e6447ae0`)
            .then((ajaxResult) => {
              addTripsInArrayToStopTable(ajaxResult, currentStopDictionary[stopNumber], stopNumber);
            })
            .catch((err) => console.err(err));
        }
      })
      .catch((err) => console.log(err));
  }
};
