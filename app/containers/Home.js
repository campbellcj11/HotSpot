///////////////////////
/*

Author: ProjectNow Team
Class: Home
Description: Links the app state variable to the componets props and
maps actions to the components props
Note: This logic could be inside of the component itself however
we chose to seperate this logic out to be more readable.

*/
///////////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from '../components/Home'
import * as UserActions from '../actions/userActions'

function mapStateToProps(state) {
  return {
    loggedIn: state.user.loggedIn,
    user: state.user.user,
    city: state.user.city ? state.user.city : '',
    interests: state.user.interests ? state.user.interests : [],
    startDate: state.user.startDate ? state.user.startDate : new Date(),
    endDate: state.user.endDate ? state.user.endDate : new Date(),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
