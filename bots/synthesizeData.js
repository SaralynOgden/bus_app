'use strict';

const knex = require('./knex');
const { decamelizeKeys } = require('humps');

const getDateMinsAgo = function(minsAgo) {
	const time = new Date(Date.now() - 1000 * 60 * minsAgo);
	return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:00-07`;
}

const getBusesDictionary = function(buses) {
  let busesDictionary = {};

  for (let bus of busesInLastHour) {
    if (bus.scheduledTime in busesDictionary) {
      busesDictionary[bus.scheduledTime] =        busesDictionary[bus.scheduledTime].push(bus);
    } else {
      busesDictionary[bus.scheduledTime] = [bus];
    }
  }

  return busesDictionary;
};

const filterBusesDictionary = function(busesDictionary) {
  for (let bus in busesDictionary) {
    const arrayOfBusTimes = busesDictionary[bus];
    if (arrayOfBusTimes[arrayOfBusTimes.length - 1].createdAt)
    for (let i = arrayOfTimes.length; i >= 0; i--) {
      if 
    }
  }
}

module.exports = {
  start: function() {
    const hourAgo = getDateMinsAgo(60);
    const fiveMinsAgo = getDateMinsAgo(5);

    knex('buses')
      .where('created_at', '>', getDateMinsAgo(60))
      .then((rows) => {
        busesInLastHour = camelizeKeys(rows);
        const busesDictionary = getBusesDictionary(busesInLastHour);
        filterBusesDictionary()
      })
      .then((busArray) => {

      })
      .catch(() => {

      })
  }
};
