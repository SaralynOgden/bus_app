'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('trips_users').del()
    .then(() => {
      return knex('trips_users').insert([{
        id: 1,
        user_id: 1,
        trip_id: 2
      }, {
        id: 2,
        user_id: 2,
        trip_id: 2
      }, {
        id: 3,
        user_id: 1,
        trip_id: 4
      }, {
        id: 4,
        user_id: 2,
        trip_id: 3
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
