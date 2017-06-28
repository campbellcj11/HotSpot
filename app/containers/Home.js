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
      localInterests: [],
      localStartDate: this.props.localStartDate ? this.props.localStartDate : new Date(),
    }
  }
  componentDidMount(){
    this.props.loadOfflineUser();
    this.props.getLocalInterests();
    this.props.getLocalStartDate();
    // if(isLoggedIn)
    // {
    //   // this.props.getUserLocations();
    //   // this.props.getUserLocations().then(
    //   //   this.getStartingEventsForAllLocations();
    //   // )
    //   // this.getStartingEventsForAllLocations();
    // }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.fetchedEventsHash){
      this.setState({
        fetchedEventsHash: nextProps.fetchedEventsHash,
      })
    }
    if(nextProps.userLocations.length != this.props.userLocations.length){
      // console.warn('We are getting a new locations');
      // console.warn(nextProps.userLocations);
      this.setState({
        currentLocation: nextProps.userLocations.length != 0  ? nextProps.userLocations[this.state.currentLocationIndex] : {},
        hasCurrentLocation: nextProps.userLocations.length != 0  ? true : false,
        userLocations: nextProps.userLocations,
      }, function(){
        clearTimeout(this.getEventsTimeout);
        this.getEventsTimeout = setTimeout(() => this.getStartingEventsForAllLocations(), 500);
      });
    }
    if(nextProps.user != this.props.user){
      // console.warn('We are getting a new user');
      // console.warn('User: ', nextProps.user);
      // console.warn('IsloggedIn: ', nextProps.isLoggedIn);
      this.setState({
        user: nextProps.user,
        isLoggedIn: nextProps.isLoggedIn,
      },function(){
        if(this.state.localInterests.length == 0)
        {
          // this.props.setLocalInterests(nextProps.user.interests);
        }
      })
    }
    if(nextProps.localInterests != this.props.localInterests && nextProps.localInterests.length != 0)
    {
      this.setState({localInterests: nextProps.localInterests},function(){
        clearTimeout(this.updateEventsTimeout);
        this.updateEventsTimeout = setTimeout(() => this.updateEvents(), 500)
      });
    }
    if(nextProps.localStartDate != this.props.localStartDate)
    {
      this.setState({localStartDate: nextProps.localStartDate},function(){
        clearTimeout(this.updateEventsTimeout);
        this.updateEventsTimeout = setTimeout(() => this.updateEvents(), 500)
      });
    }
  }
  goToDiscover(){
    Actions.discover();
  }
  logout(){
    this.hideMenu();
    this.props.logoutUser();
  }
  getEvents(){
  }
  getStartingEventsForAllLocations(){
    // console.warn('Getting Starting Events');
    // console.warn(this.state.localInterests.length);
    for(var i=0;i<this.state.userLocations.length;i++){
      var location = this.state.userLocations[i];
      if(location){
        this.props.getEvents({
          page:1,
          locationID:location.id,
          startDate:this.state.localStartDate ? this.state.localStartDate : new Date(),
          showCount:true,
          tags: this.state.localInterests ? this.state.localInterests : [],
        });
      }
    }
  }
  updateEvents(){
    for(var i=0;i<this.state.userLocations.length;i++){
      var location = this.state.userLocations[i];
      if(location){
        this.props.getEvents({
          page:1,
          locationID:location.id,
          startDate:this.state.localStartDate ? this.state.localStartDate : new Date(),
          showCount:true,
          tags: this.state.localInterests ? this.state.localInterests : [],
        });
      }
    }
  }
  onRefresh(locationID){
    this.props.getEvents({page:1,locationID:locationID});
  }
  loadMore(filters){
    // this.props.loadMoreEvents(filters);
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
    for(var i=0;i<this.state.userLocations.length;i++){
      var locationID = this.state.userLocations[i].id;
      var events = this.state.fetchedEventsHash[locationID];
      arr.push(
        <EventFeedList
          key={locationID}
          locationID={locationID}
          events={events ? events : []}
          onRefresh={(locationID) => this.onRefresh(locationID)}
          loadMore={(filters) => this.loadMore(filters)}
        />
      )
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
        <FeedFilterView height={104} interests={this.state.localInterests}/>
        <Swiper
          height={height-STATUS_BAR_HEIGHT-HEADER_BAR_HEIGHT-104}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          onMomentumScrollEnd ={this.onMomentumScrollEnd.bind(this)}
        >
          {this.renderListViews()}
        </Swiper>
        {this.state.menuVisible ? <FeedMenu userLocations={this.state.userLocations} hideMenu={() => this.hideMenu()} logout={() => this.logout()}/> : null}
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
    localInterests: state.app.localInterests,
    localStartDate: state.app.localStartDate,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
