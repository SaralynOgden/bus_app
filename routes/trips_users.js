/* eslint-disable brace-style */
'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;
    next();
  });
};

router.get('/trips_users', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('trips_users')
    .select('trip_id', 'bus_number', 'stop_number', 'start_time', 'end_time')
    .innerJoin('trips', 'trips_users.trip_id', '=', 'trips.id')
    .where('user_id', userId)
    .then((rows) => {
      const userTrips = camelizeKeys(rows);

      res.send(userTrips);
    })
    .catch((err) => next(err));
});

router.post('/trips_users', authorize, (req, res, next) => {
  const { tripId } = req.body;
  const { userId } = req.token;
  const insertedTripsUser = { userId, tripId };

  knex('trips_users')
    .insert(decamelizeKeys(insertedTripsUser), '*')
    .then((rows) => {
      const newTripsUser = camelizeKeys(rows[0]);

      res.send(newTripsUser);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
