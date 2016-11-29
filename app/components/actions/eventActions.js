import offline from 'react-native-simple-store'
import * as firebase from 'firebase';

var ReactNative = require('react-native');
var {
  AlertIOS,
  Alert,
  Platform,
} = ReactNative;

//reducers

//initialize firebase TODO:pull from a credentials file
const firebaseConfig = {
  apiKey: "AIzaSyBc6_49WEUZLKCBoR8FFIHAfVjrZasdHlc",
  authDomain: "projectnow-964ba.firebaseapp.com",
  databaseURL: "https://projectnow-964ba.firebaseio.com",
  storageBucket: "projectnow-964ba.appspot.com",
  messagingSenderId: "14798821887"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
//initialize database
const database = firebase.database();

//not tested TODO:add state for this
export function pushEvent(event) {
  database.ref('events/').push({
    title: event.title,
    shortDescription: event.shortDescription,
    longDescription: event.longDescription,
    photo: event.photo, //TODO:pull from storage
    video: event.video, //TODO:pull from storage
    startDate: event.startDate,
    endDate: event.endDate,
  });
  return {
    //add reducer components here
  }
}
