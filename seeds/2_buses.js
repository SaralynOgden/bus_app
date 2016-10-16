'use strict';

exports.seed = function(knex) {
  return knex('buses').del()
    .then(() => {
      return knex('buses').insert([{
        bus_number: '4',
        stop_number: '4874',
        scheduled_time: new Date(),
        actual_time: new Date(),
        last_update_time: new Date(),
        distance: '24'
      }, {
        bus_number: '372E',
        stop_number: '3728',
        scheduled_time: new Date(),
        actual_time: new Date(),
        last_update_time: new Date(),
        distance: '370'
      }, {
        bus_number: '83',
        stop_number: '2740',
        scheduled_time: new Date(),
        actual_time: new Date(),
        last_update_time: new Date(),
        distance: '420'
      }, {
        bus_number: '97',
        stop_number: '7832',
        scheduled_time: new Date(),
        actual_time: new Date(),
        last_update_time: new Date(),
        distance: '67'
      }, {
        bus_number: '43F',
        stop_number: '4738',
        scheduled_time: new Date(),
        actual_time: new Date(),
        last_update_time: new Date(),
        distance: '280'
      }, {
        bus_number: '67',
        stop_number: '4827',
        scheduled_time: new Date(),
        actual_time: new Date(),
        last_update_time: new Date(),
        distance: '100'
      }, {
        bus_number: '7',
        stop_number: '4801',
        scheduled_time: new Date(),
        actual_time: new Date(),
        last_update_time: new Date(),
        distance: '64'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('buses_id_seq', (SELECT MAX(id) FROM buses));"
      );
    })
    .catch((err) => {
      return err;
    })
};
