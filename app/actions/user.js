import * as types from './types'
import Api from '../lib/api'
import offline from 'react-native-simple-store'
import * as firebase from 'firebase';
import { Alert } from 'react-native';

//Test Images
import image1 from '../images/image1.png'
import image2 from '../images/image2.png'

locations = [
  {id:1,city:'Fort Worth',state:'TX',image:image1},
  {id:2,city:'Dallas',state:'TX',image:image2}
]

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
export function loginUser(user){
  console.log('Logging in user');
  return (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {
        // var ref = database.ref("users/" + firebase.auth().currentUser.uid);
        //update timestamp
        // ref.update({
        //   Last_Login : firebase.database.ServerValue.TIMESTAMP
        // });
        //
        // var metricQuery = database.ref("metrics/");
        // metricQuery.push({
        //     "UserID" : firebase.auth().currentUser.uid,
        //     "Action" : "Login",
        //     "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
        //     "Additional_Information" : ""
        // });
        var uid = firebase.auth().currentUser.uid;
        firebase.auth().currentUser.getToken().then(token => {
          var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'json',
            'token' : token,
            'uid' : uid,
          }
          Api.get('/login',headers).then(resp => {
            console.warn('Login Success');
            console.log('Login Response: ', resp);
            // dispatch(stateLogIn(user));
          }).catch( (ex) => {
            console.warn(ex);
            console.warn('Login Fail');
          });
        })
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

  var metricQuery = database.ref("metrics/");
  metricQuery.push({
      "UserID" : firebase.auth().currentUser.uid,
      "Action" : "Logout",
      "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
      "Additional_Information" : ""
  });

  return (dispatch) => {
    firebase.auth().signOut()
      .then(currentUser => {
        dispatch(stateLogOut());
      })
  };
}
// Functions that update the apps state
export function stateLogIn(userData){
  return {
    type: types.LOG_OUT,
    user: userData,
  }
}
export function stateLogOut(){
  return {
    type: types.LOG_OUT,
  }
}
export function getUserLocations(){
  return {
    type: types.GET_USER_LOCATIONS,
    locations: locations,
  }
}
