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
  var index = 0;
  var savedEventKeys = [];
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var value = childSnapshot.val();
        console.log("NewKey: " + key + " Index: " + value);
        savedEventKeys[index] = value;
        index++;
    });
    return savedEventKeys;
  });
}

export function favorite(userUID, eventUID)
{
  let db = firebase.database();
  var query = db.ref("favorites/" + userUID);
  var index = 0;
  var savedEventKeys = [];

  query.once('value')
    .then(function(snap) {
      savedEventKeys = snap.val();
      if (savedEventKeys === null)
      {
        var newArray = [];
        newArray[0] = eventUID
        query.set(newArray);
      }
      else if (savedEventKeys.includes(eventUID) === false)
      {
        savedEventKeys.push(eventUID);
        query.set(savedEventKeys);
      }
    });
}

export function unFavorite(userUID, eventUID)
{
  let db = firebase.database();
  var query = db.ref("favorites/" + userUID);
  var index = 0;
  var savedEventKeys = [];
  query.on('value', function(snap) { savedEventKeys = snap.val(); });
  if (savedEventKeys !==  null)
  {
    if (savedEventKeys.includes(eventUID) === true)
    {
      var index = savedEventKeys.indexOf(eventUID);
      var removedEvents = savedEventKeys.splice(index, 1);
      query.set(savedEventKeys);
    }
  }
}
