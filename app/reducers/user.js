import {
  LOG_IN,
  LOG_OUT,
} from '../actions/userActions'

import offline from 'react-native-simple-store'

const initialState = {
  loggedIn: false,
  user: {}
}

export default function reducer(state = initialState, action) {
  console.log(action)
  switch (action.type) {
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
  default:
    return state
  }
}
