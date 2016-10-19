'use strict';

exports.up = function(knex) {
  return knex.schema.createTable(`stop_2580`, (table) => {
    table.increments();
    table.integer('trip_id').references('id').inTable('trips')
          .onDelete('CASCADE').index();
    table.time('scheduled_time').notNullable().index();
    table.time('actual_time').notNullable();
    table.integer('distance').notNullable().defaultTo('52800');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('stop_2580');
};
