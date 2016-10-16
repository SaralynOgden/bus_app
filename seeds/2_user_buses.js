'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_buses').del()
    .then(() => {
      return knex('user_buses').insert([{
        user_id: 1,
        bus_number: '67',
        stop_number: '4827',
        start_time: '8:00',
        end_time: '9:00'
      }, {
        user_id: 1,
        bus_number: '43F',
        stop_number: '4738',
        start_time: '5:00',
        end_time: '7:00'
      }, {
        user_id: 1,
        bus_number: '97',
        stop_number: '7832',
        start_time: '16:00',
        end_time: '18:00'
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
