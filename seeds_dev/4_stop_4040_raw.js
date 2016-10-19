'use strict';

const getMinutesAgoInGMT = function(numMins) {
  return new Date(Date.now() - 1000 * 60 * numMins + 7 * 60 * 60 * 1000);
};

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('stop_4040_raw').del()
    .then(() => {
      return knex('stop_4040_raw').insert([
        {
          id: 1,
          trip_id: 1,
          scheduled_time: getMinutesAgoInGMT(40), // 5 min to arrival
          actual_time: getMinutesAgoInGMT(39), // 1 min late
          distance: 95,
          created_at: getMinutesAgoInGMT(45),
          updated_at: getMinutesAgoInGMT(45)
        }, {
          id: 2,
          trip_id: 2,
          scheduled_time: getMinutesAgoInGMT(30), // 15 min to arrival
          actual_time: getMinutesAgoInGMT(30), // on time
          distance: 500,
          created_at: getMinutesAgoInGMT(45),
          updated_at: getMinutesAgoInGMT(45)
        }, {
          id: 3,
          trip_id: 1,
          scheduled_time: getMinutesAgoInGMT(20), // 25 min to arrival
          actual_time: getMinutesAgoInGMT(22), // 2 min early
          distance: 750,
          created_at: getMinutesAgoInGMT(45),
          updated_at: getMinutesAgoInGMT(45)
        }, {
          id: 4,
          trip_id: 2,
          scheduled_time: getMinutesAgoInGMT(10), // 35 min to arrival
          actual_time: getMinutesAgoInGMT(10), // on time
          distance: 1000,
          created_at: getMinutesAgoInGMT(45),
          updated_at: getMinutesAgoInGMT(45)
        }, {
          id: 5,
          trip_id: 1,
          scheduled_time: getMinutesAgoInGMT(40), // 5 min to arrival
          actual_time: getMinutesAgoInGMT(38), // 2 min late
          distance: 1,
          created_at: getMinutesAgoInGMT(40),
          updated_at: getMinutesAgoInGMT(40)
        }, {
          id: 6,
          trip_id: 2,
          scheduled_time: getMinutesAgoInGMT(30), // 10 min to arrival
          actual_time: getMinutesAgoInGMT(31), // 1 min early
          distance: 400,
          created_at: getMinutesAgoInGMT(40),
          updated_at: getMinutesAgoInGMT(40)
        }, {
          id: 7,
          trip_id: 1,
          scheduled_time: getMinutesAgoInGMT(20), // 20 min to arrival
          actual_time: getMinutesAgoInGMT(22), // 2 min early
          distance: 600,
          created_at: getMinutesAgoInGMT(40),
          updated_at: getMinutesAgoInGMT(40)
        }, {
          id: 8,
          trip_id: 2,
          scheduled_time: getMinutesAgoInGMT(10), // 30 min to arrival
          actual_time: getMinutesAgoInGMT(10), // on time
          distance: 900,
          created_at: getMinutesAgoInGMT(40),
          updated_at: getMinutesAgoInGMT(40)
        }, {
          id: 9,
          trip_id: 2,
          scheduled_time: getMinutesAgoInGMT(30), // 5 min to arrival
          actual_time: getMinutesAgoInGMT(32), // 2 min late
          distance: 500,
          created_at: getMinutesAgoInGMT(35),
          updated_at: getMinutesAgoInGMT(35)
        }, {
          id: 10,
          trip_id: 1,
          scheduled_time: getMinutesAgoInGMT(20), // 15 min to arrival
          actual_time: getMinutesAgoInGMT(22), // 2 min early
          distance: 750,
          created_at: getMinutesAgoInGMT(35),
          updated_at: getMinutesAgoInGMT(35)
        }, {
          id: 11,
          trip_id: 2,
          scheduled_time: getMinutesAgoInGMT(10), // 25 min to arrival
          actual_time: getMinutesAgoInGMT(10), // on time
          distance: 1000,
          created_at: getMinutesAgoInGMT(35),
          updated_at: getMinutesAgoInGMT(35)}
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('stop_4040_raw_id_seq', (SELECT MAX(id) FROM stop_4040_raw));"
      );
    })
};
