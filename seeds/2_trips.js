'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('trips').del()
    .then(() => {
      return knex('trips').insert([{
        id: 1,
        bus_number: '3',
        stop_number: '4040',
        start_time: '14:00',
        end_time: '18:30'
      }, {
        id: 2,
        bus_number: '4',
        stop_number: '4040',
        start_time: '14:30',
        end_time: '18:30'
      }, {
        id: 3,
        bus_number: '132',
        stop_number: '30635',
        start_time: '14:00',
        end_time: '18:30'
      }, {
        id: 4,
        bus_number: '1',
        stop_number: '2740',
        start_time: '14:00',
        end_time: '18:30'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips));"
      );
    })
};
