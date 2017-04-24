///////////////////////
/*

Author: ProjectNow Team
Class: Favorites
Description: Links the app state variable to the componets props and
maps actions to the components props
Note: This logic could be inside of the component itself however
we chose to seperate this logic out to be more readable.

*/
///////////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Favorites from '../components/Favorites'
import * as UserActions from '../actions/userActions'

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)
