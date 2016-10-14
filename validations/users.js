'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    firstName: Joi.string()
      .label('FirstName')
      .required()
      .trim(),

    lastName: Joi.string()
      .label('FirstName')
      .required()
      .trim(),

    email: Joi.string()
      .label('Email')
      .required()
      .email()
      .trim(),

    password: Joi.string()
      .label('Password')
      .required()
      .min(8)
      .trim()
  }
};
