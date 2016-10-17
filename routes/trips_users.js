/* eslint-disable brace-style */
'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/trips_users');

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;
    next();
  });
};

router.post('/trips_users', authorize, (req, res, next) => {
  const { postedTrip } req.body;
  const { userId } = req.token;

  const InsertedTripsUser = { userId, postedTrip };

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
