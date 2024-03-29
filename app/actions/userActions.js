///////////////////////
/*

Author: ProjectNow Team
Class: UserActions
Description: Links redux app state to the DOM and contols user actions.
Note: All of these functions return Promises.

*/
///////////////////////
import offline from 'react-native-simple-store'
import * as firebase from 'firebase';

var ReactNative = require('react-native');
var {
  AlertIOS,
  Alert,
  Platform,
} = ReactNative;
import Moment from 'moment';

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
export const LOAD_ISLOGGEDIN_DATA = 'LOAD_ISLOGGEDIN_DATA';
export const SAVE_INTERESTS = 'SAVE_INTERESTS';
export const SAVE_CITY = 'SAVE_CITY';
export const SAVE_START_DATE = 'SAVE_START_DATE';
export const SAVE_END_DATE = 'SAVE_END_DATE';
export const SAVE_POSTCARDS = 'SAVE_POSTCARDS';

import RNFetchBlob from 'react-native-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

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
  offline.save('user', user);
  offline.save('isLoggedIn', true);
  return { type: SIGN_UP, currentUser: user};
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

export function saveUserData(user){
  offline.save('user', user);
  return {
    type: LOG_IN,
    currentUser: user,
  }
}

export function loadLoggedInData(){
  return dispatch => { offline.get('isLoggedIn').then((isLoggedIn) => {
    dispatch(loggedInLoaded(isLoggedIn || false))
  })}
}

function loggedInLoaded(isLoggedIn) {
  return {
    type: LOAD_ISLOGGEDIN_DATA,
    isLoggedIn: isLoggedIn
  }
}
export function loadInterestsData(){
  return dispatch => { offline.get('interests').then((interests) => {
    dispatch(saveInterests(interests || false))
  })}
}
export function saveInterests(interests){
  offline.save('interests', interests);
  return {
    type: SAVE_INTERESTS,
    interests: interests
  }
}
export function loadLocationData(){
  return dispatch => { offline.get('city').then((city) => {
    dispatch(saveLocation(city || false))
  })}
}
export function saveLocation(city){
  offline.save('city', city);
  return {
    type: SAVE_CITY,
    city: city
  }
}
export function loadStartDate(){
  return dispatch => { offline.get('startDate').then((startDate) => {
    dispatch(saveStartDate(startDate || ''))
  })}
}
export function saveStartDate(startDate){
  var dateToSave = Moment(startDate);
  // console.warn('DD: ',dateToSave);
  if(dateToSave < new Date())
  {
    dateToSave = new Date()
  }
  offline.save('startDate', dateToSave);
  return {
    type: SAVE_START_DATE,
    startDate: dateToSave
  }
}
export function loadEndDate(){
  return dispatch => { offline.get('endDate').then((endDate) => {
    dispatch(saveEndDate(endDate || ''))
  })}
}
export function saveEndDate(endDate){
  var dateToSave = Moment(endDate);
  // console.warn('DD: ',dateToSave);
  if(dateToSave < new Date())
  {
    dateToSave = new Date()
  }
  offline.save('endDate', dateToSave);
  return {
    type: SAVE_END_DATE,
    endDate: dateToSave
  }
}
export function loadPostcards(){
  return dispatch => { offline.get('postcards').then((postcards) => {
    dispatch(savePostcards(postcards || []))
  })}
}
export function savePostcards(postcards){
  offline.save('postcards', postcards);
  return {
    type: SAVE_POSTCARDS,
    postcards: postcards
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

        var metricQuery = database.ref("metrics/");
        metricQuery.push({
            "UserID" : firebase.auth().currentUser.uid,
            "Action" : "Login",
            "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
            "Additional_Information" : ""
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

/*
This function logs a user out of firebase and also pushes a metric.
*/
export function logoutUser(){
  console.log('Logging out user');

  var metricQuery = database.ref("metrics/");
  metricQuery.push({
      "UserID" : firebase.auth().currentUser.uid,
      "Action" : "Logout",
      "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
      "Additional_Information" : ""
  });

  return (dispatch) => {
    dispatch(loggingOut());
    firebase.auth().signOut()
      .then(currentUser => {
        dispatch(stateLogOut());
      })
  };
}

/*
This function signs a user up via firebase and pushes this user to the database.
Then is also uploads a photo to the database async. After, it updates the metrics
as well.
*/
export function signUpUser(user, imageUri) {
  return (dispatch) => {
    dispatch(signingUp());
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {
        database.ref('users/' + firebase.auth().currentUser.uid).set({
          Email: user.email,
          First_Name: user.First_Name,
          Last_Name: user.Last_Name,
          Phone: user.Phone,
          DOB: user.DOB,
          City: user.city,
          Interests: user.interests,
          RegisteredUser: true,
          AdminUser: false,
          Last_Login : firebase.database.ServerValue.TIMESTAMP,
          Gender: user.Gender,
          Image: ''
        });

        //check for uploaded image
        uploadImage(imageUri, firebase.auth().currentUser.uid + '.jpg')
        .then(url => {
            database.ref('users/' + firebase.auth().currentUser.uid).update({
              Image: url
            });
        });

        var metricQuery = database.ref("metrics/");
        metricQuery.push({
            "UserID" : firebase.auth().currentUser.uid,
            "Action" : "Sign up user",
            "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
            "Additional_Information" : "user.email"
        });
        dispatch(stateSignUp(user));
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ERROR: ' + error.code + ' - ' + error.message);
        Alert.alert('Invalid Signup for ' + user.Email, error.message);
      });
  };
}

/*
This function uploads a photo to our database.
*/
export function uploadImage(uri, imageName, mime = 'image/jpg')
{
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null
        const imageRef = firebase.storage().ref('UserImages').child(imageName)

        fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          console.log("URL: " + url);
          resolve(url)
        })
        .catch((error) => {
          console.log("error!" + error);
          reject(error)
        })
    })
}

/*
This function is used to reset the password for a user.
*/
export function resetPassword(email) {
  console.log('Resetting Password');
  return (dispatch) => {
    dispatch(resettingPassword());
    firebase.auth().sendPasswordResetEmail(email)
      .then(currentUser => {
        dispatch(stateResetPassword())

        var metricQuery = firebase.database().ref("metrics/");
        metricQuery.push({
            "Action" : "Reset Password",
            "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
            "Additional_Information" : email
        });

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
