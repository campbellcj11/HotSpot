import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Profile from '../components/Profile'
import * as UserActions from '../actions/userActions'

function mapStateToProps(state) {
  return {
    loggedIn: state.user.loggedIn,
    user: state.user.user,
    location: state.user.city,
    interests: state.user.interests,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
