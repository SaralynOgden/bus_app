'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('trips_users').del()
    .then(() => {
      return knex('trips_users').insert([{
        user_id: 1,
        trip_id: 2
      }, {
        user_id: 2,
        trip_id: 2
      }, {
        user_id: 1,
        trip_id: 4
      }, {
        user_id: 2,
        trip_id: 5
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('trips_users_id_seq', (SELECT MAX(id) FROM trips_users));"
      );
    })
    .catch((err) => {
      return err;
    });
};
