import offline from 'react-native-simple-store'
import * as firebase from 'firebase';

export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
export const RESET_PASSWORD = 'RESET_PASSWORD';
const firebaseConfig = {
  apiKey: "AIzaSyBc6_49WEUZLKCBoR8FFIHAfVjrZasdHlc",
  authDomain: "projectnow-964ba.firebaseapp.com ",
  databaseURL: "https://projectnow-964ba.firebaseio.com/",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD6goZSAIkbplE9_ULpJAfHyJGfgnPzR7s",
  authDomain: "testproject-cca8f.firebaseapp.com ",
  databaseURL: "https://testproject-cca8f.firebaseio.com/",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export function loginUser(user){
  console.log('Logging in user');
  firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('ERROR: ' + error.code + ' - ' + error.message);
    console.error();//TODO:need to handle this
  });
  return {
    type: LOG_IN,
    currentUser: user
  }
}

export function logoutUser(){
  console.log('Logging out user');
  firebase.auth().signOut().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('ERROR: ' + error.code + ' - ' + error.message);
    console.error(); //TODO:need to handle this
  });
  return {
    type: LOG_OUT
  }
}

export function signUpUser(user) {
  console.log('Signing in user');
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('ERROR: ' + error.code + ' - ' + error.message);
    console.error();
  });
  return {
    type: LOG_IN,
    currentUser: user
  }
}

export function resetPassword(email) {
  console.log('Signing in user');
  firebase.auth().sendPasswordResetEmail(email).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('ERROR: ' + error.code + ' - ' + error.message);
    console.error();
  });
  return {
    type: RESET_PASSWORD,
  }
}
