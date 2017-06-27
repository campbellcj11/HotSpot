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
  // console.log('User2: ',user);
  return (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {
        // console.log('CurrentUser: ', currentUser);
        user.uid = firebase.auth().currentUser.uid;
        if (isNaN(user.dob))
        {
            delete user.dob;
        }
        var headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'dataType': 'json',
        }
        Api.post('/user/create',headers,user).then(resp => {
        //   console.warn('Create Success');
        //   console.log('Create Response: ', resp);
          dispatch(stateLogIn(user));
        }).catch( (ex) => {
        //   console.warn(ex);
        //   console.warn('Create Fail');
        });
        // database.ref('users/' + firebase.auth().currentUser.uid).set({
        //   Email: user.email,
        //   First_Name: user.First_Name,
        //   Last_Name: user.Last_Name,
        //   Phone: user.Phone,
        //   DOB: user.DOB,
        //   City: user.city,
        //   Interests: user.interests,
        //   RegisteredUser: true,
        //   AdminUser: false,
        //   Last_Login : firebase.database.ServerValue.TIMESTAMP,
        //   Gender: user.Gender,
        //   Image: ''
        // });

        //check for uploaded image
        // uploadImage(imageUri, firebase.auth().currentUser.uid + '.jpg')
        // .then(url => {
        //     database.ref('users/' + firebase.auth().currentUser.uid).update({
        //       Image: url
        //     });
        // });
        // dispatch(stateSignUp(user));
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
  console.warn('Logging in user');
  return (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(currentUser => {

        var uid = firebase.auth().currentUser.uid;
        firebase.auth().currentUser.getToken().then(token => {
          console.warn(uid);
          console.warn(token);
          var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'json',
            'uid' : uid,
            'token' : token,
          }
          Api.get('/login',headers).then(resp => {
            // console.warn('Login Success');
            console.warn('Login Response: ', resp);
            dispatch(stateLogIn(resp.user));
          }).catch( (ex) => {
            console.warn(ex);
            console.warn('Login Fail');
            // dispatch(stateLogOut());
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

  // var metricQuery = database.ref("metrics/");
  // metricQuery.push({
  //     "UserID" : firebase.auth().currentUser.uid,
  //     "Action" : "Logout",
  //     "Timestamp" : firebase.database.ServerValue.TIMESTAMP,
  //     "Additional_Information" : ""
  // });

  return (dispatch) => {
    firebase.auth().signOut()
      .then(currentUser => {
        dispatch(stateLogOut());
      })
  };
}

export function getUserLocations(){
    return (dispatch, getState) => {
        var headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'dataType': 'json',
        }
        console.warn('Get State: ', getState().user.user);
        locales = getState().user.user.locales ? getState().user.user.locales : [];
        for (var i=0; i < locales.length; i++)
        {
          var locale = locales[i];
            Api.get('/locale/' + locale, headers).then(resp => {
              // console.warn('Get Locale Success');
              console.warn('Locales Get Response: ', resp.name);
              dispatch(stateUserLocations(resp));
            }).catch( (ex) => {
            //   console.warn(ex);
            //   console.warn('Create Fail');
            });
        }
    }
}

export function loadOfflineUser() {
  return (dispatch) => {
    offline.get('user').then( (user) => {
        dispatch(stateLogIn(user));
    })
  };
}

// Functions that update the apps state
export function stateLogIn(userData){
  offline.save('user', userData);
  offline.save('isLoggedIn', true);
  return {
    type: types.LOG_IN,
    user: userData,
  }
}
export function stateLogOut(){
  offline.save('user', {});
  offline.save('isLoggedIn', false);
  return {
    type: types.LOG_OUT,
  }
}

export function stateUserLocations(resp,index){
  return {
    type: types.GET_USER_LOCATIONS,
    location: resp,
    index: index,
  }
}
