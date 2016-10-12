/* eslint-disable brace-style */
'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/routes');

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
router.get('/routes/:routeId', authorize, (req, res, next) => {
  knex('routes')
    .where('id', req.routeId)
    .then((route) => res.send(camelizeKeys(route)))
    .catch((err) => next(err));
});

router.get('/routes', authorize, (req, res, next) => {
  knex('routes')
    .innerJoin('routes', 'routes.id', 'routes.route_id')
    .then((rows) => {
      const routes = camelizeKeys(rows);

      res.send(routes);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/routes', ev(validations.post), authorize, (req, res, next) => {
  const { busNumber, stopNumber, startTime, endTime } = req.body;
  const route = { userId: req.token.userId, busNumber, stopNumber,
                  startTime, endTime };

  knex('routes')
    .insert(decamelizeKeys(route), '*')
    .then((route) => {
      res.send(route);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/routes', authorize, (req, res, next) => {
  let route;
  const id = req.token.userId;

  if (isNaN(id)) { return next(boom.create(404, 'Not Found')); }
  knex('routes')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) { throw boom.create(404, 'Not Found'); }

      route = row;

      return knex('routes')
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
