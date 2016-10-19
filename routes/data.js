'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/data/where', (req, res, next) => {
  knex(`stop_${req.query.stopNumber}`)
    .where('trip_id', req.query.tripId)
    .then((rows) => res.send(camelizeKeys(rows)))
    .catch((err) => console.log(err));
});

module.exports = router;
