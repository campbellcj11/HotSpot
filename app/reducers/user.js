import {
  LOG_IN,
  LOG_OUT,
  SIGN_UP,
  RESET_PASSWORD,
  LOGGING_IN,
  LOGGING_OUT,
  SIGNING_UP,
  LOAD_USER_DATA,
  LOAD_ISLOGGEDIN_DATA,
  SAVE_CITY,
  SAVE_INTERESTS,
  SAVE_START_DATE,
  SAVE_END_DATE,
  SAVE_POSTCARDS,
} from '../actions/userActions'

import offline from 'react-native-simple-store'

const initialState = {
  loggedIn: false,
  user: {},
  city: '',
  interests: [],
  startDate: '',
  endDate: '',
  postcards: [],
}

export default function reducer(state = initialState, action) {
  console.log(action)
  switch (action.type) {
  case LOGGING_IN:
    return {
      ...state,
      loggedIn: false,
      user: {},
    }
  case LOG_IN:
    return {
      ...state,
      loggedIn: true,
      user: action.currentUser,
    }
  case LOG_OUT:
    return {
      ...state,
      loggedIn: false,
      user: {},
    }
  case LOGGING_OUT:
    return {
      ...state,
      loggedIn: true,
      //Not changing user state here because that causes an earlier log out.
    }
  case SIGNING_UP:
    return {
      ...state,
      loggedIn: false,
      user:{},
    }
  case SIGN_UP:
    return {
      ...state,
      loggedIn: true,
      user: action.currentUser,
    }
  case LOAD_USER_DATA:
    return {
      ...state,
      user: action.user,
    }
  case LOAD_ISLOGGEDIN_DATA:
    return {
      ...state,
      loggedIn: action.isLoggedIn,
    }
  case SAVE_CITY:
    return {
      ...state,
      city: action.city,
    }
  case SAVE_INTERESTS:
    return {
      ...state,
      interests: action.interests,
    }
  case SAVE_START_DATE:
    return {
      ...state,
      startDate: action.startDate,
    }
  case SAVE_END_DATE:
    return {
      ...state,
      endDate: action.endDate,
    }
  case SAVE_POSTCARDS:
    return {
      ...state,
      postcards: action.postcards,
    }
  default:
    return state
  }
}
