import offline from 'react-native-simple-store'
import * as firebase from 'firebase';

var ReactNative = require('react-native');
var {
  AlertIOS,
  Alert,
  Platform,
} = ReactNative;

const database = firebase.database();

export function getSavedEvents()
{
  var query = database.ref("savedEvents/" + firebase.auth().currentUser.uid).orderByKey();
  var index = 0;
  var savedEventKeys = [];
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        console.log("KEY: " + key + " Index: " + index);
        savedEventKeys[index] = key;
        index++;
    });
    return savedEventKeys;
  });
}
