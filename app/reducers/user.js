import * as types from '../actions/types'

import offline from 'react-native-simple-store'

const initialState = {
  isLoggedIn: true,
  user: {},
  userLocations: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case types.GET_USER_LOCATIONS:
    return {
      ...state,
      userLocations: [...state.userLocations,action.location],
    }
  case types.LOG_IN:
    return {
      ...state,
      isLoggedIn: action.isLoggedIn,
      user: action.user,
    }
  case types.LOG_OUT:
    return {
      ...state,
      isLoggedIn: false,
      user: {},
    }
  default:
    return state
  }
}
