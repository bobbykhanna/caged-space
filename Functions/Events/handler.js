'use strict';

var firebase = require("firebase");

module.exports.getNewEventId = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let newKey = firebase.database().ref('events').push().key;

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
    },
    body: JSON.stringify({
      message: 'New Id Created',
      data: newKey
    })
  };
  
  callback(null, response);

};

module.exports.addEvent = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let myEvent = JSON.parse(event.body);

  var updates = {};
  updates['/events/' + myEvent.id] = myEvent;

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref('events/' + myEvent.id).once('value').then(function (snapshot) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Event Created',
          data: snapshot.val()
        })
      };

      callback(null, response);

    });

  });

};

module.exports.updateEvent = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let key = JSON.parse(event.body).id;

  var updates = {};
  updates['/events/' + key] = JSON.parse(event.body);

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref('events/' + key).once('value').then(function (snapshot) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Event Updated',
          data: snapshot.val()
        })
      };

      callback(null, response);

    });

  });

};


module.exports.deleteEvent = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  var updates = {};
  updates[event.path] = null;

  firebase.database().ref().update(updates).then(function () {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Event Deleted'
        })
      };

      callback(null, response);

  });

};

module.exports.assignStreamToEvent = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let eventStream = JSON.parse(event.body);

  var updates = {};
  updates[event.path + '/' + eventStream.streamId] = eventStream.streamId;

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref(event.path + '/' + eventStream.streamId).once('value').then(function (snapshot) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Stream Attached To Event',
          data: snapshot.val()
        })
      };

      callback(null, response);

    });

  });

};

module.exports.unassignStreamFromEvent = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let eventStream = JSON.parse(event.body);

  var updates = {};
  updates[event.path + '/' + eventStream.streamId] = null;

  firebase.database().ref().update(updates).then(function () {

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
        message: 'Stream Unattached From Event'
      })
    };

    callback(null, response);

  });

};

module.exports.assignMusicianToEvent = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let eventMusician = JSON.parse(event.body);

  var updates = {};
  updates[event.path + '/' + eventMusician.musicianId] = eventMusician.musicianId;

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref(event.path + '/' + eventMusician.musicianId).once('value').then(function (snapshot) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Musician Attached To Event',
          data: snapshot.val()
        })
      };

      callback(null, response);

    });

  });

};

module.exports.unassignMusicianFromEvent = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let eventMusician = JSON.parse(event.body);

  var updates = {};
  updates[event.path + '/' + eventMusician.musicianId] = null;

  firebase.database().ref().update(updates).then(function () {

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
        message: 'Musician Unattached From Event'
      })
    };

    callback(null, response);

  });

};

let initializeFirebase = function () {

  let firebaseConfig = {
    apiKey: "AIzaSyAgvU-ZNdAMYJaw_kTK-uyWMIGHwCZtmMM",
    authDomain: "cagedspace-9d75f.firebaseapp.com",
    databaseURL: "https://cagedspace-9d75f.firebaseio.com",
    storageBucket: "cagedspace-9d75f.appspot.com",
    messagingSenderId: "464147072174"
  };

  if (firebase.apps.length == 0) {   // <---Important!!! In lambda, it will cause double initialization.

    firebase.initializeApp(firebaseConfig);

  }

} 
