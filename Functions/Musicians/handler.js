'use strict';

var firebase = require("firebase");

module.exports.addMusician = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let newKey = firebase.database().ref('musicians').push().key;

  let requestModel = JSON.parse(event.body);
  let musician = {};

  musician.id = newKey;
  musician.name = requestModel.name;
  musician.description = requestModel.description;
  musician.instrument = requestModel.instrument;

  var updates = {};

  if (requestModel.hasUploadedNewImage) {

    let fileName = 'resource_image.png';

    let imageReference = firebase.storage().ref(`/musicians/${newKey}/${fileName}`);

    imageReference.putString(requestModel.profileImage, 'data_url').then(function (snapshot) {

      musician.profileImageUrl = snapshot.downloadURL;

      updates['/musicians/' + newKey] = musician;

      firebase.database().ref().update(updates).then(function () {

        firebase.database().ref('musicians/' + newKey).once('value').then(function (snapshot) {

          const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
            },
            body: JSON.stringify({
              message: 'Musician Created',
              data: snapshot.val()
            })
          };

          callback(null, response);

        });

      });

    });

  } else {

    updates['/musicians/' + newKey] = musician;

    firebase.database().ref().update(updates).then(function () {

      firebase.database().ref('musicians/' + newKey).once('value').then(function (snapshot) {

        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
          },
          body: JSON.stringify({
            message: 'Musician Created',
            data: snapshot.val()
          })
        };

        callback(null, response);

      });

    });

  }

};

module.exports.updateMusician = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let key = JSON.parse(event.body).id;

  var updates = {};
  updates['/musicians/' + key] = JSON.parse(event.body);

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref('musicians/' + key).once('value').then(function (snapshot) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Musician Updated',
          data: snapshot.val()
        })
      };

      callback(null, response);

    });

  });

};


module.exports.deleteMusician = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let key = JSON.parse(event.body).id;

  firebase.database().ref('musicians/' + key).remove();  //<---- Firebase Delete Query

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
    },
    body: JSON.stringify({
      message: 'Musician Deleted',
      data: event.body
    }),
  };

  callback(null, response);

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

