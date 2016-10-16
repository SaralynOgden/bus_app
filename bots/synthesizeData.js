'use strict';

const knex = require('../knex');
const { camelizeKeys } = require('humps');

const getDateMinsAgo = function(minsAgo) {
	const time = new Date(Date.now() - 1000 * 60 * minsAgo);
	return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:00-07`;
}

const getBusesDictionary = function(busesInLastHour) {
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

const convertSQLTimeToJS = function(timeStr) {
	const year = timeStr.substring(0, 4);
	const month = timeStr.substring(5,7) - 1;
	const date = timeStr.substring(8, 10);
	const hour = timeStr.substring(11,13);
	const min = timeStr.substring(14, 16);

	return new Date(year, month, date, hour, min);
};

const filterBusesDictionary = function(busesDictionary, dateTenMinsAgo) {
  for (let time in busesDictionary) {
    const arrayOfBusTimes = busesDictionary[time];
		const lastBus = arrayOfBusTimes[arrayOfBusTimes.length - 1];
		const timeOfLastBus = Date.parse(convertSQLTimeToJS(lastBus.createdAt));

		if (timeOfLastBus > dateTenMinsAgo) {
			for (i = arrayOfBusTimes.length - 1; i >= 0; i--) {
				if (arrayOfBusTimes[i].actualTime !== '1969-12-31 16:00:00-08') {
					busesDictionary[time] = arrayOfBusTimes[i];
					break;
				}
			}
		}
  }

	return busesDictionary;
}

module.exports = {
  start: function() {
    const hourAgo = getDateMinsAgo(60);
    const tenMinsAgo = getDateMinsAgo(10);
//       .where('created_at', '<', getDateMinsAgo(60))
    knex('buses_raw')
		    .then((rows) => {
        const busesInLastHour = camelizeKeys(rows);
        const busesDictionary = getBusesDictionary(busesInLastHour);
        // return filterBusesDictionary(busesDictionary, Date.parse(tenMinsAgo));
      // })
      // .then((busesDictionary) => {
			// 	for (let time in busesDictionary) {
			// 		knex('buses')
			// 			.insert(busesDictionary[time], '*')
			// 			.then((inserted) => {
			// 				console.log(inserted);
			// 			})
			// 			.catch((err) => {
			// 				console.log(err);
			// 			})
			// 	}
      // })
      // .catch((err) => {
			// 	console.log(err);
      // })
  }
};
