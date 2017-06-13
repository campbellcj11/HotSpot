import * as types from '../actions/types'

import offline from 'react-native-simple-store'

const initialState = {
  fetchedEvents: [],
  fetchedEventsLocationID: -999,
  fetchedEventsHash: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case types.SET_FETCHED_EVENTS:
    return {
      ...state,
      fetchedEvents: action.events,
      fetchedEventsLocationID: action.locationID,
      fetchedEventsHash: action.currentEventsHash,
    }
  default:
    return state
  }
}
