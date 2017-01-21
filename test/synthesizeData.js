'use strict';

const assert = require('chai').assert;
const { suite, test } = require('mocha');

const { getEndTimeClosestToNow, getScheduledTimeDictionary } =
  require('../bots/synthesizeData');

suite('getEndTimeClosestToNow()', () => {
  test('on the hour', () => {
    assert.strictEqual(
      getEndTimeClosestToNow(new Date('Sat Jan 21 2017 10:00:16 GMT-0800 (PST)')), '10:00:00');
  });
  test('five past', () => {
    assert.strictEqual(
      getEndTimeClosestToNow(new Date('Sat Jan 21 2017 10:05:16 GMT-0800 (PST)')), '10:00:00');
  });
  test('quarter past', () => {
    assert.strictEqual(
      getEndTimeClosestToNow(new Date('Sat Jan 21 2017 10:15:16 GMT-0800 (PST)')), '10:00:00');
  });
  test('on the half hour', () => {
    assert.strictEqual(
      getEndTimeClosestToNow(new Date('Sat Jan 21 2017 10:30:16 GMT-0800 (PST)')), '10:30:00');
  });
  test('quarter until the next hour', () => {
    assert.strictEqual(
      getEndTimeClosestToNow(new Date('Sat Jan 21 2017 10:45:16 GMT-0800 (PST)')), '11:00:00');
  });
});

const tripData = [{
  id: 1,
  tripId: 1,
  scheduledTime: '5:15:00',
  actualTime: '5:16:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 2,
  tripId: 1,
  scheduledTime: '5:30:00',
  actualTime: '5:35:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 3,
  tripId: 1,
  scheduledTime: '5:45:00',
  actualTime: '5:45:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 4,
  tripId: 1,
  scheduledTime: '5:15:00',
  actualTime: '5:20:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 5,
  tripId: 1,
  scheduledTime: '5:30:00',
  actualTime: '5:28:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 6,
  tripId: 1,
  scheduledTime: '5:45:00',
  actualTime: '5:45:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 7,
  tripId: 1,
  scheduledTime: '5:15:00',
  actualTime: '5:18:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 8,
  tripId: 1,
  scheduledTime: '5:30:00',
  actualTime: '5:25:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 9,
  tripId: 1,
  scheduledTime: '5:45:00',
  actualTime: '5:45:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}, {
  id: 10,
  tripId: 1,
  scheduledTime: '5:45:00',
  actualTime: '5:46:00',
  distance: 95,
  createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
  updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
}];

suite('getScheduledTimeDictionary()', () => {
  test('no trip data', () => {
    assert.deepEqual(getScheduledTimeDictionary([]), {});
  });
  test('range of times for trip', () => {
    assert.deepEqual(getScheduledTimeDictionary(tripData),
      { '5:15:00': [{
                      id: 1,
                      tripId: 1,
                      scheduledTime: '5:15:00',
                      actualTime: '5:16:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }, {
                      id: 4,
                      tripId: 1,
                      scheduledTime: '5:15:00',
                      actualTime: '5:20:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }, {
                      id: 7,
                      tripId: 1,
                      scheduledTime: '5:15:00',
                      actualTime: '5:18:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }],
        '5:30:00': [{
                      id: 2,
                      tripId: 1,
                      scheduledTime: '5:30:00',
                      actualTime: '5:35:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }, {
                      id: 5,
                      tripId: 1,
                      scheduledTime: '5:30:00',
                      actualTime: '5:28:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }, {
                      id: 8,
                      tripId: 1,
                      scheduledTime: '5:30:00',
                      actualTime: '5:25:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }],
        '5:45:00': [{
                      id: 3,
                      tripId: 1,
                      scheduledTime: '5:45:00',
                      actualTime: '5:45:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }, {
                      id: 6,
                      tripId: 1,
                      scheduledTime: '5:45:00',
                      actualTime: '5:45:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }, {
                      id: 9,
                      tripId: 1,
                      scheduledTime: '5:45:00',
                      actualTime: '5:45:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }, {
                      id: 10,
                      tripId: 1,
                      scheduledTime: '5:45:00',
                      actualTime: '5:46:00',
                      distance: 95,
                      createdAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)',
                      updatedAt: 'Sat Jan 21 2017 10:45:16 GMT-0800 (PST)'
                    }]
      })
  });
});
