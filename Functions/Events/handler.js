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

  let newKey = firebase.database().ref('events').push().key;

  let myEvent = JSON.parse(event.body);
  myEvent.id = newKey;

  var updates = {};
  updates['/events/' + newKey] = myEvent;

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref('events/' + newKey).once('value').then(function (snapshot) {

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
