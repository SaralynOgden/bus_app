'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('trips').del()
    .then(() => {
      return knex('trips').insert([{
        id: 1,
        bus_number: '4',
        stop_number: '4040',
        start_time: '8:00',
        end_time: '9:00'
      }, {
        id: 2,
        bus_number: '29',
        stop_number: '2580',
        start_time: '8:00',
        end_time: '9:00'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips));"
      );
    })
};
