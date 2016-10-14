const CronJob = require('cron').CronJob;
const bot = require('./bot.js');
const http = require("http");

new CronJob('* 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22 * * *',
  bot.start,
  null,
  true,
  'America/Los_Angeles');
