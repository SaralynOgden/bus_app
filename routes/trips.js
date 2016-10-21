/* eslint-disable brace-style */
'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');

const createTables = function(stopNumber) {
  knex.schema.createTableIfNotExists(`stop_${stopNumber}_raw`, (table) => {
    table.increments();
    table.integer('trip_id').references('id').inTable('trips')
        .onDelete('CASCADE').index();
    table.time('scheduled_time').notNullable().index();
    table.time('actual_time').notNullable();
    table.integer('distance').notNullable().defaultTo('52800');
    table.timestamp('created_at').defaultTo(knex.fn.now()).index();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  knex.schema.createTableIfNotExists(`stop_${stopNumber}`, (table) => {
    table.increments();
    table.integer('trip_id').references('id').inTable('trips')
          .onDelete('CASCADE').index();
    table.time('scheduled_time').notNullable().index();
    table.time('actual_time').notNullable();
    table.integer('distance').notNullable().defaultTo('52800');
    table.timestamps(true, true);
  });
};

router.get('/trips/:id', (req, res, next) => {
  knex('trips')
    .where('id', req.params.id)
    .then((trip) => res.send(camelizeKeys(trip)))
    .catch((err) => next(err));
});

router.get('/trips', (req, res, next) => {
  knex('trips')
    .orderByRaw('cast(bus_number as numeric) ASC')
    .then((rows) => {
      const trips = camelizeKeys(rows);

      res.send(trips);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/trips', (req, res, next) => {
  const { busNumber, stopNumber, startTime, endTime } = req.body;
  const newTrip = { busNumber, stopNumber, startTime, endTime };

  knex('trips')
    .where('bus_number', busNumber)
    .andWhere('stop_number', stopNumber)
    .andWhere('start_time', startTime)
    .andWhere('end_time', endTime)
    .first()
    .then((existingTrip) => {
      if (existingTrip) {
        res.send(camelizeKeys(existingTrip));
      } else {
        knex('trips')
          .insert(decamelizeKeys(newTrip), '*')
          .then((rows) => {
            const postedTrip = camelizeKeys(rows[0]);

            createTables(stopNumber);
            res.send(postedTrip);
          })
          .catch((err) => {
            next(err);
          });
      }
    });
});

router.delete('/trips/:id', (req, res, next) => {
  let trip;
  const id = req.params.id;

  if (isNaN(id)) { return next(boom.create(404, 'Not Found')); }
  knex('trips')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) { throw boom.create(404, 'Not Found'); }

      trip = row;

      return knex('trips')
        .where('id', id)
        .del();
    })
    .then(() => {
      delete trip.id;
      const jsonTrip = camelizeKeys(trip);

      res.send(jsonTrip);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
