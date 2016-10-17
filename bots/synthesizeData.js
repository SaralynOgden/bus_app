'use strict';

const knex = require('../knex');
const { camelizeKeys } = require('humps');

const getEndTimeClosestToNow = function(currentDate) {
	const minutes = currentDate.getMinutes();
	currentDate.setHours(9);
	let hour = currentDate.getHours();

	if (minutes < 45) {
		if (minutes > 15) {
			return `${hour}:30`;
		}
		return `${hour}:00`;
	} else {
		hour = (hour + 1) >= 10 ? (hour + 1):'0' + (hour + 1);
		return `${hour}:00`;
	}
};

const convertTimeToDateToday = function(time, currentDate) {
	const year = currentDate.getFullYear();
		month = currentDate.getMonth() + 1,
		date = currentDate.getDate(),
		hour = time.substring(0, 2),
	 	minute = time.substring(3, 5);

	return `${year}-${month}-${date} ${hour}:${minute}:00:00-07`;
};

const getUniqueUserBuses = function(userBuses, currentDate) {
	for (let i = userBuses.length - 1; i > 0; i--) {
		for (let j = i - 1; j > 0; j--) {
			if (JSON.stringify(userBuses[i]) ==== JSON.stringify(userBuses[j])) {
				userBuses[i].splice(i, 1);
			}
		}
	}
}

const getDataForBus = function(userBus) {
	const startDate = convertTimeToDateToday(userBus.startTime);
	const endDate = convertTimeToDateToday(userBus.endTime);

	knex(`stop_${stopNumber}_raw`)
		.where('created_at', '>', startDate)
		.andWhere('created_at', '<', endDate)
		.then((rows) => {
			const rawBusData = camelizeKeys(rows);

		})
}

module.exports = {
	start: function() {
		const currentDate = new Date();

		knex('user_buses')
			.select('bus_number', 'stop_number', 'start_time', 'end_time')
			.where('end_time', getEndTimeClosestToNow(currentDate))
			.then((rows) => {
				const userBuses = camelizeKeys(rows);

				getUniqueUserBuses(userBuses);
		  	for (let userBus in userBuses) {
					getDataForBus(userBus, currentDate);
				}
			})
			.catch((err) => console.err(err));
};

const getDateMinsAgo = function(minsAgo) {
	const time = new Date(Date.now() - 1000 * 60 * minsAgo);
	return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:00-07`;
};

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
