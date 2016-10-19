'use strict';

const getMinutesAgoInGMT = function(numMins) {
  return new Date(Date.now() - 1000 * 60 * numMins + 7 * 60 * 60 * 1000);
};

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('stop_4040').del()
    .then(() => {
      return knex('stop_4040').insert([{
          id: 5,
          trip_id: 1,
          scheduled_time: getMinutesAgoInGMT(40), // 5 min to arrival
          actual_time: getMinutesAgoInGMT(38), // 2 min late
          last_update_time: getMinutesAgoInGMT(40),
          distance: 1,
          created_at: getMinutesAgoInGMT(40),
          updated_at: getMinutesAgoInGMT(40)
        }, {
          id: 9,
          trip_id: 2,
          scheduled_time: getMinutesAgoInGMT(30), // 5 min to arrival
          actual_time: getMinutesAgoInGMT(32), // 2 min late
          last_update_time: getMinutesAgoInGMT(35),
          distance: 500,
          created_at: getMinutesAgoInGMT(35),
          updated_at: getMinutesAgoInGMT(35)
        }
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('stop_4040_id_seq', (SELECT MAX(id) FROM stop_4040));"
      );
    })
};
