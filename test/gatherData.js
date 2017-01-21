'use strict';

const assert = require('chai').assert;
const { suite, test } = require('mocha');

const { getCurrentStopDictionary, getBusIndices } = require('../bots/gatherData');

suite('getCurrentStopDictionary()', () => {
  test('empty trip array', () => {
    assert.deepEqual(getCurrentStopDictionary([]), {});
  });
  test('trip array with all different stops', () => {
    const tripArr =
      [{id: 1, busNumber: 1, stopNumber: 1, startTime: '8:00', endTime: '9:00'},
       {id: 2, busNumber: 2, stopNumber: 2, startTime: '8:00', endTime: '9:00'},
       {id: 3, busNumber: 3, stopNumber: 3, startTime: '8:00', endTime: '9:00'}];
    assert.deepEqual(getCurrentStopDictionary(tripArr),
      {'1': [{tripId: 1, busNumber: 1}],
       '2': [{tripId: 2, busNumber: 2}],
       '3': [{tripId: 3, busNumber: 3}]});
  });
  test('trip array with all the same stop', () => {
    const tripArr =
      [{id: 1, busNumber: 1, stopNumber: 1, startTime: '8:00', endTime: '9:00'},
       {id: 2, busNumber: 2, stopNumber: 1, startTime: '8:00', endTime: '9:00'},
       {id: 3, busNumber: 3, stopNumber: 1, startTime: '8:00', endTime: '9:00'}];
    assert.deepEqual(getCurrentStopDictionary(tripArr),
      {'1': [{tripId: 1, busNumber: 1},
             {tripId: 2, busNumber: 2},
             {tripId: 3, busNumber: 3}]});
  });
  test('trip array with all the same stop', () => {
    const tripArr =
      [{id: 1, busNumber: 1, stopNumber: 1, startTime: '8:00', endTime: '9:00'},
       {id: 2, busNumber: 2, stopNumber: 1, startTime: '8:00', endTime: '9:00'},
       {id: 3, busNumber: 3, stopNumber: 3, startTime: '8:00', endTime: '9:00'}];
    assert.deepEqual(getCurrentStopDictionary(tripArr),
      {'1': [{tripId: 1, busNumber: 1},
             {tripId: 2, busNumber: 2}],
        '3': [{tripId: 3, busNumber: 3}]});
  });
});

const arrivalsAndDepartures = [
  {
    arrivalEnabled: true,
    blockTripSequence: 1,
    departureEnabled: true,
    distanceFromStop: 3455.1053591037344,
    frequency: null,
    lastUpdateTime: 1485020027000,
    numberOfStopsAway: 6,
    predicted: true,
    predictedArrivalInterval: null,
    predictedArrivalTime: 1485020516000,
    predictedDepartureInterval: null,
    predictedDepartureTime: 1485020516000,
    routeId: "1_100202",
    routeLongName: "",
    routeShortName: "345",
    scheduledArrivalInterval: null,
    scheduledArrivalTime: 1485020422000,
    scheduledDepartureInterval: null,
    scheduledDepartureTime: 1485020422000,
    serviceDate: 1484985600000,
    situationIds: [ ],
    status: "default",
    stopId: "1_17022",
    stopSequence: 28,
    totalStopsInTrip: 31,
    tripHeadsign: "RICHMOND BEACH NORTH CITY",
    tripId: "1_31034941",
    tripStatus: {
      activeTripId: "1_31034941",
      blockTripSequence: 1,
      closestStop: "1_16920",
      closestStopTimeOffset: -35,
      distanceAlongTrip: 6172.24526638042,
      frequency: null,
      lastKnownDistanceAlongTrip: 0,
      lastKnownLocation: {
        lat: 47.714881896972656,
        lon: -122.33409881591797
      },
      lastKnownOrientation: 0,
      lastLocationUpdateTime: 1485020027000,
      lastUpdateTime: 1485020027000,
      nextStop: "1_16913",
      nextStopTimeOffset: 149,
      orientation: 270.9351037912396,
      phase: "in_progress",
      position: {
        lat: 47.714793278797735,
        lon: -122.33410225047004
      },
      predicted: true,
      scheduleDeviation: 94,
      scheduledDistanceAlongTrip: 6172.24526638042,
      serviceDate: 1484985600000,
      situationIds: [ ],
      status: "SCHEDULED",
      totalDistanceAlongTrip: 10758.760801402268,
      vehicleId: "1_3741"
    },
    vehicleId: "1_3741"
  }, {
    arrivalEnabled: true,
    blockTripSequence: 1,
    departureEnabled: true,
    distanceFromStop: 1807.4077445558141,
    frequency: null,
    lastUpdateTime: 0,
    numberOfStopsAway: 4,
    predicted: false,
    predictedArrivalInterval: null,
    predictedArrivalTime: 0,
    predictedDepartureInterval: null,
    predictedDepartureTime: 0,
    routeId: "1_102574",
    routeLongName: "",
    routeShortName: "40",
    scheduledArrivalInterval: null,
    scheduledArrivalTime: 1485020616000,
    scheduledDepartureInterval: null,
    scheduledDepartureTime: 1485020616000,
    serviceDate: 1484985600000,
    situationIds: [ ],
    status: "default",
    stopId: "1_17022",
    stopSequence: 51,
    totalStopsInTrip: 54,
    tripHeadsign: "Northgate Ballard",
    tripId: "1_32404027",
    tripStatus: {
      activeTripId: "1_32404027",
      blockTripSequence: 1,
      closestStop: "1_16960",
      closestStopTimeOffset: 17,
      distanceAlongTrip: 0,
      frequency: null,
      lastKnownDistanceAlongTrip: 0,
      lastKnownLocation: null,
      lastKnownOrientation: 0,
      lastLocationUpdateTime: 0,
      lastUpdateTime: 0,
      nextStop: "1_16960",
      nextStopTimeOffset: 17,
      orientation: 16.835237521098747,
      phase: "",
      position: {
        lat: 47.708521269212774,
        lon: -122.3344009070936
      },
      predicted: false,
      scheduleDeviation: 0,
      scheduledDistanceAlongTrip: 18804.32934000452,
      serviceDate: 1484985600000,
      situationIds: [ ],
      status: "default",
      totalDistanceAlongTrip: 21645.91683487851,
      vehicleId: ""
    },
    vehicleId: ""
  }, {
    arrivalEnabled: true,
    blockTripSequence: 1,
    departureEnabled: true,
    distanceFromStop: 5723.045634485286,
    frequency: null,
    lastUpdateTime: 1485020165000,
    numberOfStopsAway: 20,
    predicted: true,
    predictedArrivalInterval: null,
    predictedArrivalTime: 1485021373000,
    predictedDepartureInterval: null,
    predictedDepartureTime: 1485021373000,
    routeId: "1_100151",
    routeLongName: "",
    routeShortName: "26E",
    scheduledArrivalInterval: null,
    scheduledArrivalTime: 1485021236000,
    scheduledDepartureInterval: null,
    scheduledDepartureTime: 1485021236000,
    serviceDate: 1484985600000,
    situationIds: [ ],
    status: "default",
    stopId: "1_17022",
    stopSequence: 41,
    totalStopsInTrip: 48,
    tripHeadsign: "Northgate Transit Center East Green Lake",
    tripId: "1_32380753",
    tripStatus: {
      activeTripId: "1_32380753",
      blockTripSequence: 1,
      closestStop: "1_27050",
      closestStopTimeOffset: 19,
      distanceAlongTrip: 9624.990621267149,
      frequency: null,
      lastKnownDistanceAlongTrip: 0,
      lastKnownLocation: {
        lat: 47.661075592041016,
        lon: -122.32511138916016
      },
      lastKnownOrientation: 0,
      lastLocationUpdateTime: 1485020165000,
      lastUpdateTime: 1485020165000,
      nextStop: "1_27050",
      nextStopTimeOffset: 19,
      orientation: 89.06613307497342,
      phase: "in_progress",
      position: {
        lat: 47.660783699428514,
        lon: -122.32511758321272
      },
      predicted: true,
      scheduleDeviation: 137,
      scheduledDistanceAlongTrip: 9624.990621267149,
      serviceDate: 1484985600000,
      situationIds: [ ],
      status: "SCHEDULED",
      totalDistanceAlongTrip: 16543.35440916201,
      vehicleId: "1_7025"
      },
    vehicleId: "1_7025"
  }, {
    arrivalEnabled: true,
    blockTripSequence: 0,
    departureEnabled: true,
    distanceFromStop: 9572.792714968797,
    frequency: null,
    lastUpdateTime: 1485020148000,
    numberOfStopsAway: 35,
    predicted: true,
    predictedArrivalInterval: null,
    predictedArrivalTime: 1485021403000,
    predictedDepartureInterval: null,
    predictedDepartureTime: 1485021403000,
    routeId: "1_100203",
    routeLongName: "",
    routeShortName: "346",
    scheduledArrivalInterval: null,
    scheduledArrivalTime: 1485021299000,
    scheduledDepartureInterval: null,
    scheduledDepartureTime: 1485021299000,
    serviceDate: 1484985600000,
    situationIds: [ ],
    status: "default",
    stopId: "1_17022",
    stopSequence: 37,
    totalStopsInTrip: 40,
    tripHeadsign: "MOUNTLAKE TERRACE RIDGECREST",
    tripId: "1_31035059",
    tripStatus: {
      activeTripId: "1_31035059",
      blockTripSequence: 0,
      closestStop: "1_89990",
      closestStopTimeOffset: -14,
      distanceAlongTrip: 541.2481614346307,
      frequency: null,
      lastKnownDistanceAlongTrip: 0,
      lastKnownLocation: {
        lat: 47.7741813659668,
        lon: -122.33538055419922
      },
      lastKnownOrientation: 0,
      lastLocationUpdateTime: 1485020148000,
      lastUpdateTime: 1485020148000,
      nextStop: "1_16160",
      nextStopTimeOffset: 27,
      orientation: 0,
      phase: "in_progress",
      position: {
        lat: 47.774178,
        lon: -122.33529363707311
      },
      predicted: true,
      scheduleDeviation: 104,
      scheduledDistanceAlongTrip: 541.2481614346307,
      serviceDate: 1484985600000,
      situationIds: [ ],
      status: "SCHEDULED",
      totalDistanceAlongTrip: 11245.451052321541,
      vehicleId: "1_3608"
    },
    vehicleId: "1_3608"
  }, {
    arrivalEnabled: true,
    blockTripSequence: 1,
    departureEnabled: true,
    distanceFromStop: 9023.643231994793,
    frequency: null,
    lastUpdateTime: 1485020185000,
    numberOfStopsAway: 24,
    predicted: true,
    predictedArrivalInterval: null,
    predictedArrivalTime: 1485021751000,
    predictedDepartureInterval: null,
    predictedDepartureTime: 1485021751000,
    routeId: "1_102574",
    routeLongName: "",
    routeShortName: "40",
    scheduledArrivalInterval: null,
    scheduledArrivalTime: 1485021516000,
    scheduledDepartureInterval: null,
    scheduledDepartureTime: 1485021516000,
    serviceDate: 1484985600000,
    situationIds: [ ],
    status: "default",
    stopId: "1_17022",
    stopSequence: 51,
    totalStopsInTrip: 54,
    tripHeadsign: "Northgate Ballard",
    tripId: "1_32404172",
    tripStatus: {
      activeTripId: "1_32404172",
      blockTripSequence: 1,
      closestStop: "1_19510",
      closestStopTimeOffset: 9,
      distanceAlongTrip: 11588.09385256554,
      frequency: null,
      lastKnownDistanceAlongTrip: 0,
      lastKnownLocation: {
        lat: 47.66971206665039,
        lon: -122.38758850097656
      },
      lastKnownOrientation: 0,
      lastLocationUpdateTime: 1485020185000,
      lastUpdateTime: 1485020185000,
      nextStop: "1_19510",
      nextStopTimeOffset: 9,
      orientation: 90,
      phase: "in_progress",
      position: {
        lat: 47.669735134917666,
        lon: -122.387589
      },
      predicted: true,
      scheduleDeviation: 235,
      scheduledDistanceAlongTrip: 11588.09385256554,
      serviceDate: 1484985600000,
      situationIds: [ ],
      status: "SCHEDULED",
      totalDistanceAlongTrip: 21645.91683487851,
      vehicleId: "1_2701"
    },
    vehicleId: "1_2701"
  }, {
    arrivalEnabled: true,
    blockTripSequence: 1,
    departureEnabled: true,
    distanceFromStop: 15574.436241328274,
    frequency: null,
    lastUpdateTime: 1485020168000,
    numberOfStopsAway: 47,
    predicted: true,
    predictedArrivalInterval: null,
    predictedArrivalTime: 1485022569000,
    predictedDepartureInterval: null,
    predictedDepartureTime: 1485022569000,
    routeId: "1_100202",
    routeLongName: "",
    routeShortName: "345",
    scheduledArrivalInterval: null,
    scheduledArrivalTime: 1485022222000,
    scheduledDepartureInterval: null,
    scheduledDepartureTime: 1485022222000,
    serviceDate: 1484985600000,
    situationIds: [ ],
    status: "default",
    stopId: "1_17022",
    stopSequence: 28,
    totalStopsInTrip: 31,
    tripHeadsign: "RICHMOND BEACH NORTH CITY",
    tripId: "1_31034943",
    tripStatus: {
      activeTripId: "1_30770351",
      blockTripSequence: 0,
      closestStop: "1_16112",
      closestStopTimeOffset: -19,
      distanceAlongTrip: 9544.696117442249,
      frequency: null,
      lastKnownDistanceAlongTrip: 0,
      lastKnownLocation: {
        lat: 47.77417755126953,
        lon: -122.34297943115234
      },
      lastKnownOrientation: 0,
      lastLocationUpdateTime: 1485020168000,
      lastUpdateTime: 1485020168000,
      nextStop: "1_77197",
      nextStopTimeOffset: 42,
      orientation: 180.83333438965138,
      phase: "in_progress",
      position: {
        lat: 47.77417551882994,
        lon: -122.34311158044169
      },
      predicted: true,
      scheduleDeviation: 347,
      scheduledDistanceAlongTrip: 9544.696117442249,
      serviceDate: 1484985600000,
      situationIds: [ ],
      status: "SCHEDULED",
      totalDistanceAlongTrip: 15491.781733286369,
      vehicleId: "1_3744"
    },
    vehicleId: "1_3744"}
  ];

suite('getBusIndices()', () => {
  test('no bus with number at stop', () => {
    assert.deepEqual(getBusIndices(arrivalsAndDepartures, '1'), []);
  });
  test('one bus with number at stop', () => {
    assert.deepEqual(getBusIndices(arrivalsAndDepartures, '346'), [3]);
  });
  test('many buses with number at stop', () => {
    assert.deepEqual(getBusIndices(arrivalsAndDepartures, '40'), [1, 4]);
  });
});
