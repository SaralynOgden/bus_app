'use strict';

exports.up = function(knex) {
  return knex.schema.createTable(`stop_36960`, (table) => {
    table.increments();
    table.string('bus_number').notNullable().defaultTo('');
    table.datetime('scheduled_time').notNullable().index();
    table.datetime('actual_time').notNullable();
    table.datetime('last_update_time').notNullable();
    table.integer('distance').notNullable().defaultTo('52800');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('stop_36960');
};
