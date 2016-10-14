'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('routes').del()
    .then(() => {
      return knex('routes').insert([{
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
    .catch((err) => {
      return err;
    });
};
