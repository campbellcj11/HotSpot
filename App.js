import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import Home from './app/containers/Home'
import configureStore from './app/store/configureStore'
import { Router, Scene } from 'react-native-router-flux'

const store = configureStore()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="root">
            <Scene key="Home" component={Home} title="Home" initial={true} />
          </Scene>
        </Router>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ProjectNow', () => App)
