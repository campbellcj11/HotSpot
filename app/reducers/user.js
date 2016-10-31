import {
  LOG_IN,
  LOG_OUT,
  SIGN_UP,
  RESET_PASSWORD,
  LOGGING_IN,
  LOGGING_OUT,
  SIGNING_UP,
} from '../actions/userActions'

import offline from 'react-native-simple-store'

const initialState = {
  loggedIn: false,
  user: {}
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
  default:
    return state
  }
}
