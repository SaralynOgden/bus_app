'use strict';

const request = require('request');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const moment = require('moment');

const getCurrentStopDictionary = function(currentTrips) {
  const stopDictionary = {};

  for (const currentTrip of currentTrips) {
    const { id, busNumber, stopNumber } = currentTrip;
    const tripInfo = { tripId: id, busNumber };

    if (stopNumber in stopDictionary) {
      const tripsInfoArray = stopDictionary[stopNumber];

      tripsInfoArray.push(tripInfo);
      stopDictionary[stopNumber] = tripsInfoArray;
    } else {
      stopDictionary[stopNumber] = [tripInfo];
    }
  }

  return stopDictionary;
};

const getJSON = function(url) {
  const promise = new Promise((resolve, reject) => {
    request.get(url, (err, res, body) => {
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

// eslint-disable-next-line max-params
const insertBusData = function(ajaxResult, busIndices, stopNumber, tripId) {
  for (let i = 0; i < busIndices.length; i++) {
    const busInfo = ajaxResult.data.entry.arrivalsAndDepartures[busIndices[i]];
    const insertRow = {
      tripId,
      scheduledTime: moment.utc(busInfo.scheduledArrivalTime)
                           .format('HH:mm:ss'),
      actualTime: moment.utc(busInfo.predictedArrivalTime)
                        .format('HH:mm:ss'),
      distance: parseInt(busInfo.distanceFromStop)
    };

    if (busInfo.predictedArrivalTime !== 0) {
      knex(`stop_${stopNumber}_raw`)
        .insert(decamelizeKeys(insertRow), '*')
        .catch((err) => {
          throw err;
        });
    }
  }
};

const addTripsInArrayToStopTable = function(ajaxResult, tripsInfo, stopNumber) {
  const arrivalsAndDepartures = ajaxResult.data.entry.arrivalsAndDepartures;

  for (const tripInfo of tripsInfo) {
    const busIndices = getBusIndices(arrivalsAndDepartures, tripInfo.busNumber);

    insertBusData(ajaxResult, busIndices, stopNumber, tripInfo.tripId);
  }
};

module.exports = {
  start() {
    // Move time be on PST to match start and end times
    const currentTimeJS = new Date(Date.now() - 7 * 60 * 60 * 1000);
    const currentTimeSQL = `${currentTimeJS.getHours()}:
${currentTimeJS.getMinutes()}:00`;

    knex('trips')
      .where('start_time', '<', currentTimeSQL)
      .andWhere('end_time', '>', currentTimeSQL)
      .then((rows) => {
        const currentTrips = camelizeKeys(rows);
        const currentStopDictionary = getCurrentStopDictionary(currentTrips);

        for (const stopNumber in currentStopDictionary) {
          getJSON(`http://api.pugetsound.onebusaway.org/api/where/arrivals-and\
-departures-for-stop/1_${stopNumber}.json?key=bf764a2e-308a-43f5-\
9fdc-24a6e6447ae0`)
            .then((ajaxResult) => {
              addTripsInArrayToStopTable(ajaxResult,
                currentStopDictionary[stopNumber], stopNumber);
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        throw err;
      });
  }
};
