'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_buses').del()
    .then(() => {
      return knex('user_buses').insert([{
        user_id: 1,
        bus_number: '45',
        stop_number: '36960',
        start_time: '15:00',
        end_time: '17:00'
      }, {
        user_id: 2,
        bus_number: '62',
        stop_number: '36960',
        start_time: '15:00',
        end_time: '17:00'
      }, {
        user_id: 1,
        bus_number: '132',
        stop_number: '30635',
        start_time: '15:30',
        end_time: '18:00'
      }, {
        user_id: 2,
        bus_number: '1',
        stop_number: '2470',
        start_time: '8:00',
        end_time: '10:00'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('user_buses_id_seq', (SELECT MAX(id) FROM user_buses));"
      );
    })
    .catch((err) => {
      return err;
    });
};
