import * as types from '../actions/types'

import offline from 'react-native-simple-store'

const initialState = {
  loggedIn: false,
  user: {},
  userLocations: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case types.GET_USER_LOCATIONS:
    return {
      ...state,
      userLocations: action.locations,
    }
  case types.LOG_IN:
    return {
      ...state,
      loggedIn: true,
      user: action.user,
    }
  case types.LOG_OUT:
    return {
      ...state,
      loggedIn: false,
      user: {},
    }
  default:
    return state
  }
}
