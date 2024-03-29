import React, { Component } from 'react'
import { AppRegistry, StyleSheet, View, Image,Text } from 'react-native'
import { Provider } from 'react-redux'
import Home from './app/containers/Home'
import Plan from './app/containers/Plan'
import Favorites from './app/containers/Favorites'
import Discover from './app/containers/Discover'
import Profile from './app/containers/Profile'
import EventView from './app/containers/EventCard'
import EventView2 from './app/containers/Profile'
import configureStore from './app/store/configureStore'
import { Router, Scene, ActionConst } from 'react-native-router-flux'
// import icon1 from './app/images/time-icon.png'
// import icon2 from './app/images/calendar-icon.png'
// import icon2 from './app/images/favorite-heart-button.png'
// import icon3 from './app/images/search-icon.png'
// import icon4 from './app/images/profile-icon.png'
import icon1 from './app/imgs/time.png'
import icon2 from './app/imgs/heart-empty.png'
import icon3 from './app/imgs/search.png'
import icon4 from './app/imgs/profile.png'
import styleVariables from './app/Utils/styleVariables'
const store = configureStore()

class TabIcon extends Component {
    render(){
      // console.log('Tab Icon Props: ', this.props);
      var color = this.props.selected ? '#F97237' : 'white';
        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <Image source={this.props.image} style={{tintColor: color,resizeMode: 'contain',marginBottom:3,width: 25, height: 25,}}/>
              <Text style={[styles.smallFontSize,{fontFamily:styleVariables.systemNormalFont,color: color}]}>{this.props.title}</Text>
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
          <Scene key="tabbar" tabs={true} initial={true} tabBarStyle={{backgroundColor:'#0E476A'}}>
              <Scene key="tab1" type={ActionConst.REFRESH} title="Feed" image={icon1} icon={TabIcon} navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}>
                <Scene key="tab1_1" component={Home} title="Feed" navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}/>
                <Scene key="Event" component={EventView} title="Event" navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]} leftButtonIconStyle={{tintColor:'#0B82CC'}}/>
              </Scene>
              <Scene key="tab2" title="Favorites" image={icon2} icon={TabIcon} navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}>
                <Scene key="tab2_1" component={Favorites} title="Favorites" />
                <Scene key="tab2_2" component={EventView} title="Event" navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]} leftButtonIconStyle={{tintColor:'#0B82CC'}}/>
              </Scene>
              <Scene key="tab3" title="Discover" image={icon3} icon={TabIcon} navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]}>
                <Scene key="tab3_1" component={Discover} title="Discover" />
                <Scene key="tab3_2" component={EventView} title="Event" navigationBarStyle={styles.navigationBarStyle} titleStyle={[styles.baseBoldFontStyle,styles.navigationBarTextStyle]} leftButtonIconStyle={{tintColor:'#0B82CC'}}/>
              </Scene>
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
    backgroundColor:'#0E476A',
    borderBottomWidth: 0,
  },
  navigationBarTextStyle: {
    color:'#FFFFFF',
    fontSize:18,
    fontFamily: styleVariables.systemFont,
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
