import offline from 'react-native-simple-store'
import * as firebase from 'firebase';

var ReactNative = require('react-native');
var {
  AlertIOS,
  Alert,
  Platform,
} = ReactNative;

/*
This function is a prototype for saved events that is not
currently implemented.
*/
export function getSavedEvents()
{
  let db = firebase.database();
  var query = db.ref("favorites/" + firebase.auth().currentUser.uid);

  var metricQuery = db.ref("metrics/");
  metricQuery.push({
      "UserID" : firebase.auth().currentUser.uid,
      "Action" : "Get Saved Events",
      "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
      "Additional_Information" : ""
  });

  var index = 0;
  var savedEventKeys = [];
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var value = childSnapshot.val();
        savedEventKeys[index] = value;
        index++;
    });
    return savedEventKeys;
  });
}

/*
This function is used to favorite an event.
*/
export function favorite(userUID, eventUID, city)
{
  let db = firebase.database();
  var query = db.ref("favorites/" + userUID);
  var index = 0;
  var savedEventKeys = [];

  var metricQuery = db.ref("metrics/");
  metricQuery.push({
      "UserID" : firebase.auth().currentUser.uid,
      "Action" : "Favorited event",
      "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
      "Additional_Information" : city + "/" + eventUID
  });

  query.once('value')
    .then(function(snap) {
      savedEventKeys = snap.val();
      if (savedEventKeys === null)
      {
        var newArray = [];
        newArray[0] = city + "/" + eventUID
        query.set(newArray);
      }
      else if (savedEventKeys.includes(eventUID) === false)
      {
        savedEventKeys.push(city + "/" + eventUID);
        query.set(savedEventKeys);
      }
    });
}

/*
This function is used to unfavorite an event.
*/
export function unFavorite(userUID, eventUID, city)
{
  let db = firebase.database();

  var metricQuery = db.ref("metrics/");
  metricQuery.push({
      "UserID" : firebase.auth().currentUser.uid,
      "Action" : "Unfavorited event",
      "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
      "Additional_Information" : city + "/" + eventUID
  });

  var query = db.ref("favorites/" + userUID);
  var index = 0;
  var savedEventKeys = [];
  query.on('value', function(snap) { savedEventKeys = snap.val(); });
  if (savedEventKeys !==  null)
  {
    if (savedEventKeys.includes(city + "/" + eventUID) === true)
    {
      var index = savedEventKeys.indexOf(city + "/" + eventUID);
      var removedEvents = savedEventKeys.splice(index, 1);
      query.set(savedEventKeys);
    }
  }
}

/*
This function is used to render the possible interests for a user.
*/
export function renderPossibleInterests()
{
    let db = firebase.database();
    var query = db.ref("possibleTags/");
    var possibleTags = [];
    query.on('value', function(snap) { possibleTags = snap.val() });
    return possibleTags;
}

/*
This function is used to render possible locations for our app. 
*/
export function renderPossibleLocations()
{
    let db = firebase.database();
    var query = db.ref("events/");
    var unfilteredList = [];
    var listOfEvents = [];
    query.on('value', function(snap) { listOfEvents = snap.val() });
    for (eventLocale in listOfEvents)
    {
        unfilteredList.push(eventLocale);
    }
    return unfilteredList;
}
