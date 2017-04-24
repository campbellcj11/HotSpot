///////////////////////
/*

Author: ProjectNow Team
Class: index
Description: Combines all of the apps reducers so they can be users in all components
Note: For our app design we only had one reducer so this combination does not help much
however with a different design we could define multiple reducers and make them all one reducer
here so we have a consistant state throughout the app.

*/
///////////////////////
import { combineReducers } from 'redux'
import user from './user'

export default combineReducers({
  user,
})
