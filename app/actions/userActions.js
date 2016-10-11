import offline from 'react-native-simple-store'
import * as firebase from 'firebase';

export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
const firebaseConfig = {
  apiKey: "AIzaSyBc6_49WEUZLKCBoR8FFIHAfVjrZasdHlc",
  authDomain: "projectnow-964ba.firebaseapp.com ",
  databaseURL: "https://projectnow-964ba.firebaseio.com/",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export function loginUser(user){
  console.log('Logging in user');
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  return {
    type: LOG_IN,
    currentUser: user
  }
}

export function logoutUser(){
  console.log('Logging out user');
  return {
    type: LOG_OUT
  }
}
