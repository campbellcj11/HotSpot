import * as types from '../actions/types'

const initialState = {
  possibleLocations: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case types.GET_POSSIBLE_LOCATIONS:
    return {
      ...state,
      possibleLocations: action.possibleLocations,
    }
  default:
    return state
  }
}
