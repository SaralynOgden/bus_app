'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('routes', (table) => {
    table.increments();
    table.integer('user_id').references('id')
        .inTable('users').onDelete('CASCADE').index();
    table.string('bus_number').notNullable();
    table.string('stop_number').notNullable();
    table.timestamp('start_time');
    table.timestamp('end_time');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('routes');
};
