'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_buses').del()
    .then(() => {
      return knex('user_buses').insert([{
        user_id: 1,
        bus_number: '67',
        stop_number: '4827',
        start_time: new Date(),
        end_time: new Date()
      }, {
        user_id: 1,
        bus_number: '43F',
        stop_number: '4738',
        start_time: new Date(),
        end_time: new Date()
      }, {
        user_id: 1,
        bus_number: '97',
        stop_number: '7832',
        start_time: new Date(),
        end_time: new Date()
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    })
    .catch((err) => {
      return err;
    });
};
