'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bus_app_test_data'
  },
  
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
