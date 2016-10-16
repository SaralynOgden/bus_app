'use strict';

const request = require('request');
const knex = require('../knex');
const { decamelizeKeys } = require('humps');

const getBusIndices = function(arrivalsAndDepartures, busNumber) {
  const busesWithNumber = [];

  for (let i = 0; i < arrivalsAndDepartures.length; i++) {
    if (arrivalsAndDepartures[i].routeShortName === busNumber) {
      busesWithNumber.push(i);
    }
  }

  return busesWithNumber;
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

const insertDataAboutBusesWithNumber = function(buses, busNumber, stopNumber) {
  const arrivalsAndDepartures = buses.data.entry.arrivalsAndDepartures;
  const busIndices = getBusIndices(arrivalsAndDepartures, busNumber);

  for (let i = 0; i < busIndices.length; i++) {
    const busInfo = buses.data.entry.arrivalsAndDepartures[busIndices[i]];
    const bus = {
      busNumber,
      stopNumber,
      scheduledTime: new Date(busInfo.scheduledArrivalTime),
      actualTime: new Date(busInfo.predictedArrivalTime),
      lastUpdateTime: new Date(busInfo.lastUpdateTime),
      distance: parseInt(busInfo.distanceFromStop)};

    knex('buses')
      .insert(decamelizeKeys(bus), '*')
      .then((bus) => console.log(bus))
      .catch((err) => console.error(err));
  }
};

module.exports = {
  start: function() {
    const currentTimeJS = new Date();
    const currentTimeSQL = `${currentTimeJS.getHours()}:\
${currentTimeJS.getMinutes()}:00`;

    knex('user_buses')
      .where('start_time', '<', currentTimeSQL)
      .andWhere('end_time', '>', currentTimeSQL)
      .then((buses) => {
        for (let bus of buses) {
          const busNumber = bus.bus_number;
          const stopNumber = bus.stop_number;
          const url = `http://api.pugetsound.onebusaway.org/api/where/arrivals-and-\
departures-for-stop/1_${stopNumber}.json?key=bf764a2e-308a-43f5-9fdc-\
24a6e6447ae0`;

          getJSON(url)
            .then((busesWithNumber) => {
              insertDataAboutBusesWithNumber(busesWithNumber,
                                             busNumber, stopNumber);
            })
            .catch((err) => {
              console.error(err);
              process.exit(1);
            });
        }
      })
      .catch((err) => console.log(err));
  }
};
