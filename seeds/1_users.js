/* eslint-disable camelcase, max-len */
'use strict';

exports.seed = (knex) => {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        first_name: 'Joanne',
        last_name: 'Rowling',
        email: 'jkrowling@gmail.com',
        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS'  // youreawizard
      }, {
        id: 2,
        first_name: 'Timmy',
        last_name: 'Turner',
        email: 'fairlyodd@gmail.com',
        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
