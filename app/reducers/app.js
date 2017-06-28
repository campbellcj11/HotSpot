import * as types from '../actions/types'

const initialState = {
  possibleLocations: [],
  localInterests: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case types.GET_POSSIBLE_LOCATIONS:
    return {
      ...state,
      possibleLocations: action.possibleLocations,
    }
  case types.SAVE_LOCAL_INTERESTS:
    return {
      ...state,
      localInterests: action.localInterests,
    }
  default:
    return state
  }
}
