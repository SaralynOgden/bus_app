'use strict';

const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

const getEndTimeClosestToNow = function(currentDateInPST) {
  const minutes = currentDateInPST.getMinutes();
  let hour = currentDateInPST.getHours();

  if (minutes < 45) {
    if (minutes > 15) {
      return `${hour}:30:00`;
    }

    return `${hour}:00:00`;
  }
  hour = (hour + 1) >= 10 ? (hour + 1) : `0${hour + 1}`;

  return `${hour}:00:00`;
};

const getTodaysSQLDate = function() {
  const todayJS = new Date();
  const year = todayJS.getFullYear();
  const month = todayJS.getMonth() + 1;
  const date = todayJS.getDate();

  return `${year}-${month}-${date} 00:00:00.000+00`;
};

const getScheduledTimeDictionary = function(tripData) {
  const scheduledTimeDictionary = {};

  for (const dataPoint of tripData) {
    const scheduledTime = dataPoint.scheduledTime;

    if (scheduledTime in scheduledTimeDictionary) {
      const dataPointsAtScheduledTime = scheduledTimeDictionary[scheduledTime];

      dataPointsAtScheduledTime.push(dataPoint);
      scheduledTimeDictionary[scheduledTime] = dataPointsAtScheduledTime;
    } else {
      scheduledTimeDictionary[scheduledTime] = [dataPoint];
    }
  }

  return scheduledTimeDictionary;
};

const synthesizeTripData = function(trip) {
  const todaysSQLDate = getTodaysSQLDate();

  knex(`stop_${trip.stopNumber}_raw`)
    .whereRaw('(date_trunc(\'day\', created_at)= ?)', [todaysSQLDate])
    .andWhere('trip_id', trip.id)
    .then((rows) => {
      const tripData = camelizeKeys(rows);
      const scheduledTimeDictionary = getScheduledTimeDictionary(tripData);

      for (const scheduledTime in scheduledTimeDictionary) {
        const bestPrediction = scheduledTimeDictionary[scheduledTime].pop();

        knex(`stop_${trip.stopNumber}`)
          .insert(decamelizeKeys(bestPrediction), '*')
          .catch((err) => {
            throw err;
          });
      }
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  start() {
    // Adjust time to be in PDT so that the time in the end_time will match
    const currentDateInPST = new Date(Date.now() - 7 * 60 * 60 * 1000);

    knex('trips')
      .select('id', 'stop_number')
      .where('end_time', getEndTimeClosestToNow(currentDateInPST))
      .then((rows) => {
        const trips = camelizeKeys(rows);

        for (const trip of trips) {
          synthesizeTripData(trip);
        }
      })
      .catch((err) => {
        throw err;
      });
  }
};
