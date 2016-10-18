'use strict';

const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

const getEndTimeClosestToNow = function(currentDateInPDT) {
	const minutes = currentDateInPDT.getMinutes();
	let hour = currentDateInPDT.getHours();
	if (minutes < 45) {
		if (minutes > 15) {
			return `${hour}:30:00`;
		}
		return `${hour}:00:00`;
	} else {
		hour = (hour + 1) >= 10 ? (hour + 1):'0' + (hour + 1);
		return `${hour}:00:00`;
	}
};

const getBestArrivalPrediction = function(scheduledTimeData) {
	for (let i = scheduledTimeData.length - 1; i >= 0; i--) {
		if (scheduledTimeData[i].actualTime !== '1970-01-01 00:00:00+00') {
			return scheduledTimeData[i];
		}
	}
};

const getTodaysSQLDate = function() {
	const todayJS = new Date(),
		year = todayJS.getFullYear(),
		month = todayJS.getMonth() + 1,
		date = todayJS.getDate();

	return `${year}-${month}-${date} 00:00:00.000+00`;
};

const getScheduledTimeDictionary = function(tripData) {
	const scheduledTimeDictionary = {};

	for (let dataPoint of tripData) {
		const scheduledTime = dataPoint.scheduledTime;

		if (scheduledTime in scheduledTimeDictionary) {
			const dataPointsAtScheduledTime = scheduledTimeDictionary[scheduledTime];

			dataPointsAtScheduledTime.push(dataPoint);
			scheduledTimeDictionary[scheduledTime] = dataPointsAtScheduledTime;
		} else {
			scheduledTimeDictionary[scheduledTime] = [dataPoint]
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
			console.log(rows);
			const tripData = camelizeKeys(rows),
				scheduledTimeDictionary = getScheduledTimeDictionary(tripData);

			for (let scheduledTime in scheduledTimeDictionary) {
				const bestPrediction = getBestArrivalPrediction(scheduledTimeDictionary[scheduledTime]);

				knex(`stop_${trip.stopNumber}`)
					.insert(decamelizeKeys(bestPrediction), '*')
					.then((inserted) => console.log(inserted))
					.catch((err) => console.log(err));
			}
		})
		.catch((err) => console.log(err));
};

module.exports = {
	start: function() {
		// Adjust time to be in PDT so that the time in the end_time will match
		const currentDateInPDT = new Date(Date.now() - 7 * 60 * 60 * 1000);

		knex('trips')
			.select('id', 'stop_number')
			.where('end_time', getEndTimeClosestToNow(currentDateInPDT))
			.then((rows) => {
				const trips = camelizeKeys(rows);

				console.log(trips);
				for (let trip of trips) {
					synthesizeTripData(trip);
				}
			})
			.catch((err) => console.err(err));
	}
};
