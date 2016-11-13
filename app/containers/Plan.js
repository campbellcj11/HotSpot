import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Plan from '../components/Plan'
import * as UserActions from '../actions/userActions'

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Plan)
