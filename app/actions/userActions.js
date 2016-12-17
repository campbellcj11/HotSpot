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
export const LOAD_USER_DATA = 'LOAD_USER_DATA';

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

/*
The following functions control the user state during the process of actions
and also once the action has completed.
See the reducers to understand the state changes completely.
*/
export function loggingIn() {
  console.log('Logging in');
  return { type: LOGGING_IN };
}

export function loggingOut() {
  console.log('Logging out');
  return { type: LOGGING_OUT }
}

export function signingUp() {
  console.log("Signing up");
  return { type: SIGNING_UP }
}

export function resettingPassword() {
  console.log("Resetting password");
  return { type: RESETTING_PASSWORD }
}

export function stateLogIn(user) {
  offline.save('user', user);
  offline.save('isLoggedIn', true);
  return { type: LOG_IN, currentUser: user };
}

export function stateLogOut() {
  offline.save('user', {});
  offline.save('isLoggedIn', false);
  return { type: LOG_OUT };
}

export function stateSignUp(user) {
  return { type: SIGN_UP, currentUser: user };
}

export function stateResetPassword() {
  return { type: RESET_PASSWORD };
}

export function loadUserData(){
  return dispatch => { offline.get('user').then((user) => {
    dispatch(userDataLoaded(user || {}))
  })}
}

function userDataLoaded(user) {
  return {
    type: LOAD_USER_DATA,
    user: user
  }
}
/*
This function logs a user in to firebase and when successful, it will
update the last login field in the database under the specified user. This
also sets the state of the current user.
*/
export function loginUser(user){
  console.log('Logging in user');
  return (dispatch) => {
    dispatch(loggingIn());
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {
        var ref = database.ref("users/" + firebase.auth().currentUser.uid);
        //update timestamp
        ref.update({
          Last_Login : firebase.database.ServerValue.TIMESTAMP
        });
        ref.once('value')
          .then(function(snapshot) {
            console.log('User logging in: ' + snapshot.val());
            var userFromTable = snapshot.val();
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

export function signUpUser(user) {
  console.log('Signing up user');
  console.log("USER!: " + user);
  return (dispatch) => {
    dispatch(signingUp());
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {
        database.ref('users/' + firebase.auth().currentUser.uid).set({
          email: user.email,
          //TODO: need to implement first Name and last name fields on sign up.
          //firstName: 'Conor',
          //lastName: 'Campbell',
          registeredUser: true,
          adminUser: false,
          lastLogin : firebase.database.ServerValue.TIMESTAMP
        });
        dispatch(stateSignUp(user));
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR: ' + error.code + ' - ' + error.message);
        Alert.alert('Invalid Signup for ' + user.email, error.message);
      });
  };
}

export function resetPassword(email) {
  console.log('Resetting Password');
  return (dispatch) => {
    dispatch(resettingPassword());
    firebase.auth().sendPasswordResetEmail(email)
      .then(currentUser => {
        dispatch(stateResetPassword())
        Alert.alert("Password reset email sent.");
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR: ' + error.code + ' - ' + error.message);
        if (email == "")
        {
          Alert.alert("Please enter an email address to reset the password for.");
        }
        else
        {
          Alert.alert('Invalid Signup for ' + email, error.message);
        }
      });
  };
}
