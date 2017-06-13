import React, { Component } from 'react'
import { AppRegistry, StyleSheet, TouchableHighlight, Image } from 'react-native'
import { Provider } from 'react-redux'
import {Actions} from 'react-native-router-flux'
import { appStyleVariables, appColors } from './app/styles';
import Home from './app/containers/Home'
import Discover from './app/containers/Discover'
import Profile from './app/containers/Profile'
import Locations from './app/containers/Locations'
import Interests from './app/containers/Interests'
import EventSuggestion from './app/containers/EventSuggestion'
import Feedback from './app/containers/Feedback'
import Legal from './app/containers/Legal'
import Stats from './app/containers/Stats'
import NewEvent from './app/containers/NewEvent'
// import EventView from './app/containers/EventCard'
// import EventView2 from './app/containers/Profile'
import configureStore from './app/store/configureStore'
import { Router, Scene, ActionConst } from 'react-native-router-flux'
// import icon1 from './app/imgs/time.png'
// import icon2 from './app/imgs/heart-empty.png'
// import icon3 from './app/imgs/search.png'
// import icon4 from './app/imgs/profile.png'
// import styleVariables from './app/Utils/styleVariables'

const store = configureStore()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="root">
            {/*<Scene key="login" component={Login} title="Login"/>
            <Scene key="register" component={Register} title="Register"/>*/}
            <Scene key="home" component={Home} hideNavBar={true}/>
            <Scene key="discover" component={Discover} hideNavBar={true}/>
            <Scene key="profile" component={Profile} hideNavBar={true}/>
            <Scene key="locations" component={Locations} hideNavBar={true}/>
            <Scene key="interests" component={Interests} hideNavBar={true}/>
            <Scene key="eventSuggestion" component={EventSuggestion} hideNavBar={true}/>
            <Scene key="feedback" component={Feedback} hideNavBar={true}/>
            <Scene key="legal" component={Legal} hideNavBar={true}/>
            <Scene key="stats" component={Stats} hideNavBar={true}/>
            <Scene key="newEvent" component={NewEvent} hideNavBar={true}/>
          </Scene>
        </Router>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('HotSpot', () => App)
