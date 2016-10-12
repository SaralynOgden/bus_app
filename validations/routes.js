'use strict';

const Joi = require('joi');

module.exports = {
  post: {
    body: {
      bus_number: Joi.string()
        .label('Bus Number')
        .required()
        .trim(),

      stop_number: Joi.string()
        .label('Stop Number')
        .required()
        .trim(),
    }
  }
};
