import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Actions} from 'react-native-router-flux'
import { ActionCreators } from '../actions'
import { appStyleVariables, appColors } from '../styles';
import {
  ScrollView,
  ListView,
  View,
  TextInput,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
  StatusBar,
  RefreshControl,
  Dimensions,
  UIManager,
  LayoutAnimation,
  InteractionManager,
} from 'react-native';

//npm packages
import Swiper from 'react-native-swiper';

import LandingPage from './LandingPage'
//components
import EventFeedList from '../components/EventFeedList'
import FeedNavBar from '../components/FeedNavBar'
import FeedFilterView from '../components/FeedFilterView'
import FeedMenu from '../components/FeedMenu'

//Class variables
const STATUS_BAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const HEADER_BAR_HEIGHT = 44;
var {width,height} = Dimensions.get('window');

class Home extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      user: this.props.user,
      isLoggedIn: this.props.isLoggedIn,
      userLocations: this.props.userLocations,
      currentLocationIndex: 0,
      currentLocation: this.props.userLocations.length != 0 ? this.props.userLocations[0] : {},
      hasCurrentLocation: this.props.userLocations.length != 0  ? true : false,
      fetchedEventsHash: {},
      menuVisible: false,
    }
  }
  componentDidMount(){
    this.props.loadOfflineUser();
    var isLoggedIn = this.checkForUser();
    if(isLoggedIn)
    {
      this.props.getUserLocations();
      // this.props.getUserLocations().then(
      //   this.getStartingEventsForAllLocations();
      // )
      this.getStartingEventsForAllLocations();
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.fetchedEventsHash){
      this.setState({
        fetchedEventsHash: nextProps.fetchedEventsHash,
      })
    }
    if(nextProps.userLocations != this.props.userLocations){
      this.setState({
        currentLocation: nextProps.userLocations.length != 0  ? nextProps.userLocations[this.state.currentLocationIndex] : {},
        hasCurrentLocation: nextProps.userLocations.length != 0  ? true : false,
        userLocations: nextProps.userLocations,
      }, function(){
        this.getStartingEventsForAllLocations();
      });
    }
    if(nextProps.user != this.props.user){
      console.warn('We are getting a new user');
      this.setState({
        user: nextProps.user,
        isLoggedIn: nextProps.isLoggedIn,
      })
    }
  }
  checkForUser(){
    var returnValue;
    console.log('User: ',this.state.user);
    if(Object.keys(this.state.user).length !== 0){
      returnValue = true;
    }
    else{
      // This needs to be removed once we want to worry about loggin in
      // returnValue = true;
      // This needs to be uncommented out once we want to worry about logging in
      returnValue = false;
      this.setState({isLoggedIn:false});
    }
    return returnValue;
  }
  goToDiscover(){
    Actions.discover();
  }
  getEvents(){
  }
  getStartingEventsForAllLocations(){
    for(var i=0;i<this.state.userLocations.length;i++){
      var location = this.state.userLocations[i];
      this.props.getEvents({page:0,locationID:location.id});
    }
  }
  onRefresh(locationID){
    this.props.getEvents({page:0,locationID:locationID});
  }
  loadMore(filters){
    this.props.loadMoreEvents(filters);
  }
  onMomentumScrollEnd(e, state, context) {
    this.setState({currentLocationIndex:state.index,currentLocation:this.props.userLocations[state.index]});
  }
  showMenu(){
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();

    this.setState({menuVisible:true});
  }
  hideMenu(){
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();

    this.setState({menuVisible:false});
  }
  renderListViews(){
    var arr = [];
    for(var i=0;i<this.props.userLocations.length;i++){
      var location = this.props.userLocations[i];
      var locationID = location.id;
      var events = this.state.fetchedEventsHash[locationID];
      if(events){
        arr.push(
          <EventFeedList
            key={locationID}
            locationID={locationID}
            events={events}
            onRefresh={(locationID) => this.onRefresh(locationID)}
            loadMore={(filters) => this.loadMore(filters)}
          />
        )
      }
    }

    return arr
  }
  renderView(){
    return(
      <View style={styles.scene}>
        <StatusBar barStyle="light-content"/>
        <FeedNavBar
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
          userLocations={this.state.userLocations}
          currentLocation={this.state.currentLocation}
          showMenu={() => this.showMenu()}
          goToDiscover={() => this.goToDiscover()}
        />
        <FeedFilterView height={104}/>
        <Swiper
          height={height-STATUS_BAR_HEIGHT-HEADER_BAR_HEIGHT-104}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          onMomentumScrollEnd ={this.onMomentumScrollEnd.bind(this)}
        >
          {this.renderListViews()}
        </Swiper>
        {this.state.menuVisible ? <FeedMenu userLocations={this.state.userLocations} hideMenu={() => this.hideMenu()}/> : null}
      </View>
    )
  }
  renderLogin(){
    return(
      <LandingPage/>
    )
  }
  render() {
    if(this.state.isLoggedIn)
    {
      return this.renderView();
    }
    else
    {
      return this.renderLogin();
    }
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    userLocations: state.user.user.locales ? state.user.user.locales : [],
    fetchedEvents: state.events.fetchedEvents,
    fetchedEventsHash: state.events.fetchedEventsHash,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
