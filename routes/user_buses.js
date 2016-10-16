/* eslint-disable brace-style */
'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/user_buses');

const createTables = function(stopNumber) {
  knex.schema.createTableIfNotExists(`stop_${stopNumber}`, (table) => {
    table.increments();
    table.string('bus_number').notNullable().defaultTo('');
    table.datetime('scheduled_time').notNullable().index();
    table.datetime('actual_time').notNullable();
    table.datetime('last_update_time').notNullable();
    table.integer('distance').notNullable().defaultTo('52800');
    table.timestamp('created_at').defaultTo(knex.fn.now()).index();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  .then((table) => console.log('fucking work 1'))
  .catch((err) => console.log(err));
  knex.schema.createTableIfNotExists(`bus_${stopNumber}_raw`, (table) => {
    table.increments();
    table.string('bus_number').notNullable().defaultTo('');
    table.datetime('scheduled_time').notNullable().index();
    table.datetime('actual_time').notNullable();
    table.datetime('last_update_time').notNullable();
    table.integer('distance').notNullable().defaultTo('52800');
    table.timestamps(true, true);
  })
  .then((table) => console.log('fucking work 2'))
  .catch((err) => console.log(err));
};

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;
    next();
  });
};

// This information needs to be fed into sorting the buses table in order to
// get back the information for the plots
// router.get('/user_buses/:routeId', authorize, (req, res, next) => {
//   knex('user_buses')
//     .where('id', req.routeId)
//     .then((route) => res.send(camelizeKeys(route)))
//     .catch((err) => next(err));
// });

router.get('/user_buses', (req, res, next) => {
  knex('user_buses')
    .then((rows) => {
      const userBuses = camelizeKeys(rows);

      res.send(userBuses);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/user_buses', authorize, (req, res, next) => {
  const { busNumber, stopNumber, startTime, endTime } = req.body;
  const { userId } = req.token;
  console.log(busNumber);

  const newUserBus = { userId, busNumber, stopNumber,
                  startTime, endTime };

  knex('user_buses')
    .insert(decamelizeKeys(newUserBus), '*')
    .then((userBuses) => {
      const postedUserBus = camelizeKeys(userBuses[0]);
      createTables(stopNumber);
      res.send(postedUserBus);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/user_buses/:id', (req, res, next) => {
  let route;
  const busesUserId = req.params.id;

  if (isNaN(id)) { return next(boom.create(404, 'Not Found')); }
  knex('user_buses')
    .where('id', busesUserId)
    .first()
    .then((row) => {
      if (!row) { throw boom.create(404, 'Not Found'); }

      route = row;

      return knex('user_buses')
        .del()
        .where('id', id);
    })
    .then(() => {
      delete route.id;
      const jsonroute = camelizeKeys(route);

      res.send(jsonroute);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
