import * as types from '../actions/types'

const initialState = {
  possibleLocations: [],
  localInterests: [],
  localStartDate: new Date(),
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
  case types.SAVE_START_DATE:
    return {
      ...state,
      localStartDate: action.localStartDate,
    }
  default:
    return state
  }
}
