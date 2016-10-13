'use strict';

exports.seed = (knex) => {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        first_name: 'Bill',
        last_name: 'Johnson',
        email: 'billjohnson@gmail.com',
        password: '1f3d530364d6680b2f6f60856b04baa3855035b83d68de8d33d1e216087b7056' // bustrends
        created_at: new Date(),
        updated_at: new Date()
      }]);
    })
    .catch((err) => {
      return err;
    });
};
