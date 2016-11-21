import offline from 'react-native-simple-store'
import * as firebase from 'firebase';

var ReactNative = require('react-native');
var {
  AlertIOS,
  Alert,
  Platform,
} = ReactNative;

//reducers
export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const RESETTING_PASSWORD = 'RESETTING_PASSWORD';
export const DB_CALL = 'DB_CALL';
export const SIGN_UP = 'SIGN_UP';
export const SIGNING_UP = 'SIGNING_UP'
export const LOGGING_IN = 'LOGGING_IN';
export const LOGGING_OUT = 'LOGGING_OUT';

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

export function loggingIn() {
  console.log('Logging in');
  return { type: LOGGING_IN };
}

export function loggingOut() {
  console.log('Logging out');
  return { type: LOGGING_OUT }
}

export function sigingUp() {
  console.log("Signing up");
  return { type: SIGNING_UP }
}

export function resettingPassword() {
  console.log("Resetting password");
  return { type: RESETTING_PASSWORD }
}

export function stateLogIn(user) {
  return { type: LOG_IN, currentUser: user };
}

export function stateLogOut() {
  return { type: LOG_OUT };
}

export function stateSignUp() {
  return { type: SIGN_UP };
}

export function stateResetPassword() {
  return { type: RESET_PASSWORD };
}

export function loginUser(user){
  console.log('Logging in user');
  return (dispatch) => {
    dispatch(loggingIn());
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {
        var ref = database.ref("users/" + firebase.auth().currentUser.uid);
        var userFromTable;
        ref.once('value')
          .then(function(snapshot) {
            console.log(snapshot.val())
            userFromTable = {
              email : snapshot.val().email,
              firstName : snapshot.val().firstName,
              lastName : snapshot.val().lastName
            };
            console.log("USERFROMTABLE: " + userFromTable);
            dispatch(stateLogIn(userFromTable));
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log('ERROR: ' + error.code + ' - ' + error.message);
          Alert.alert('User does not exist.');
        });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR: ' + error.code + ' - ' + error.message);
        Alert.alert('Invalid Login for ' + user.email + '. ' + error.message);
    });
  };
}

export function logoutUser(){
  console.log('Logging out user');
  return (dispatch) => {
    dispatch(loggingOut());
    firebase.auth().signOut()
      .then(currentUser => {
        dispatch(stateLogOut());
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR: ' + error.code + ' - ' + error.message);
        Alert.alert('Invalid Logout for ' + user.email, error.message);
      });
  };
}

//TODO: Test function
export function signUpUser(user) {
  console.log('Signing up user');
  return (dispatch) => {
    dispatch(signingUp());
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {
        dispatch(stateSignUp());
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('UID: ' + user.uid);
          }
        });
        //TODO: Once signup page is implemented, match these according fields
        database.ref('users/' + firebase.auth().currentUser.uid).set({
          email: user.email,
          firstName: 'Conor',
          lastName: 'Campbell',
          registeredUser: true,
          adminUser: true,
          events: null,
          lastLogin : firebase.database.ServerValue.TIMESTAMP
        });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR: ' + error.code + ' - ' + error.message);
        Alert.alert('Invalid Signup for ' + user.email, error.message);
      });
  };
}

//TODO: Test function
export function resetPassword(email) {
  console.log('Resetting Password');
  return (dispatch) => {
    dispatch(resettingPassword());
    firebase.auth().sendPasswordResetEmail(email)
      .then(currentUser => {
        dispatch(stateResetPassword())
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR: ' + error.code + ' - ' + error.message);
        Alert.alert('Invalid Signup for ' + user.email, error.message);
      });
  };
  firebase.auth().sendPasswordResetEmail(email).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('ERROR: ' + error.code + ' - ' + error.message);
    Alert.alert('Cannot Reset Password ' + user.email, error.message);
  });
  return {}
}
