import { combineReducers } from 'redux'
import user from './user'
import events from './events'
import app from './app'

export default combineReducers({
  user,
  events,
  app,
})
