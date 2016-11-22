import React, { Component } from 'react'
import { AppRegistry, StyleSheet, View, Image,Text } from 'react-native'
import { Provider } from 'react-redux'
import Home from './app/containers/Home'
import Plan from './app/containers/Plan'
import Discover from './app/containers/Discover'
import Profile from './app/containers/Profile'
import EventView from './app/containers/EventCard'
import configureStore from './app/store/configureStore'
import { Router, Scene } from 'react-native-router-flux'
import icon1 from './app/images/time-icon.png'
import icon2 from './app/images/calendar-icon.png'
import icon3 from './app/images/search-icon.png'
import icon4 from './app/images/profile-icon.png'
const store = configureStore()

class TabIcon extends Component {
    render(){
      console.log('Tab Icon Props: ', this.props);
      var iconName = this.props.iconName || 'rocket';
      var color = this.props.selected ? '#FFF907' : 'white';
        return (
            <View style={{alignItems:'center'}}>
              <Image source={this.props.image} style={{tintColor: color,resizeMode: 'cover',marginBottom:5,width: 25, height: 25,}}/>
              <Text style={[styles.baseNormalFontStyle,styles.smallFontSize,{color: color}]}>{this.props.title}</Text>
            </View>
        );
    }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
        <Scene key="root">
          <Scene key="tabbar" tabs={true} initial={true} tabBarStyle={{backgroundColor:'#261851'}}>
              <Scene key="tab1" title="Now" image={icon1} icon={TabIcon} navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}>
                <Scene key="tab1_1" component={Home} title="Now" />
                <Scene key="Event" component={EventView} title="Event" navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}/>
              </Scene>
              <Scene key="tab2" title="Plan" image={icon2} icon={TabIcon} navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}>
                <Scene key="tab2_1" component={Plan} title="Plan" />
              </Scene>
              <Scene key="tab3" component={Discover} title="Discover" image={icon3} icon={TabIcon} navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}/>
              <Scene key="tab4" component={Profile} title="Profile" image={icon4} icon={TabIcon} navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}/>
          </Scene>
        </Scene>
        </Router>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ProjectNow', () => App)

var styles = StyleSheet.create({
  navigationBarStyle: {
    backgroundColor:'#261851',
    borderBottomWidth: 0,
  },
  navigationBarTextStyle: {
    color:'#FFF907',
    fontSize:20,
  },
  baseBoldFontStyle:
  {
    fontFamily:'Futura-Medium',
  },
  baseNormalFontStyle:
  {
    fontFamily:'Futura-Medium',
  },
  largeFontSize: {
    fontSize:24,
  },
  normalFontSize: {
    fontSize:18,
  },
  smallFontSize: {
    fontSize:12,
  }
})
