'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('buses', (table) => {
    table.increments();
    table.string('bus_number').notNullable().defaultTo('');
    table.string('stop_number').notNullable().defaultTo('');
    table.index(['bus_number', 'stop_number'], 'bus_and_stop');
    table.timestamp('scheduled_time').notNullable().index();
    table.timestamp('actual_time').notNullable();
    table.timestamp('last_update_time').notNullable();
    table.integer('distance').notNullable().defaultTo('52800');
    table.timestamps(true, true);
  });
};
exports.down = function(knex, Promise) {

};
