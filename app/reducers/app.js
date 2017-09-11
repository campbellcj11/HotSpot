import * as types from '../actions/types'

const initialState = {
  possibleLocations: [],
  localInterests: [],
  localStartDate: new Date(),
  localEndDate: new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDate()),
  getDateFilterType: 'All Dates',
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
      localStartDate: action.startDate,
    }
  case types.SAVE_END_DATE:
    return {
      ...state,
      localEndDate: action.endDate,
    }
  case types.SAVE_DATE_FILTER_TYPE:
    return {
      ...state,
      dateFilterType: action.dateFilterType,
    }
  default:
    return state
  }
}
