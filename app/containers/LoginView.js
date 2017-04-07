import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LoginView from '../components/LoginView'
import * as UserActions from '../actions/userActions'

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView)
