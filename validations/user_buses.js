'use strict'

const Joi = require('joi');

module.exports.post = {
  body: {
    busStop: Joi.string()
      .label('BusStop')
      .required()
      .trim(),

    busNumber: Joi.string()
      .label('BusNumber')
      .required()
      .trim()
  }
}
