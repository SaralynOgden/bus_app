/* eslint-disable no-new */
'use strict';

const CronJob = require('cron').CronJob;
const gatherData = require('./bots/gatherData.js');
const synthesizeData = require('./bots/synthesizeData.js');

new CronJob('* 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22 * * *',
  gatherData.start,
  null,
  true,
  'America/Los_Angeles');

new CronJob('*/30 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22 * * *',
  synthesizeData.start,
  null,
  true,
  'America/Los_Angeles');
