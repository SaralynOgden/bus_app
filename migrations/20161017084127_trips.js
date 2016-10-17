'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('user_buses', (table) => {
    table.increments();
    table.string('bus_number').notNullable();
    table.string('stop_number').notNullable();
    table.time('start_time').index();
    table.time('end_time').index();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_buses');
};
