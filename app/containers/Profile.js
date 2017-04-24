///////////////////////
/*

Author: ProjectNow Team
Class: Profile
Description: Links the app state variable to the componets props and
maps actions to the components props
Note: This logic could be inside of the component itself however
we chose to seperate this logic out to be more readable.

*/
///////////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Profile from '../components/Profile'
import * as UserActions from '../actions/userActions'

function mapStateToProps(state) {
  return {
    loggedIn: state.user.loggedIn,
    user: state.user.user,
    city: state.user.city,
    interests: state.user.interests,
    postcards: state.user.postcards,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
