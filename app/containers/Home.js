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
    console.log('Props: ', this.props);
    this.state = {
      user: this.props.user,
      isLoggedIn: this.props.isLoggedIn,
      userLocations: this.props.userLocations ? this.props.userLocations : [],
      currentLocationIndex: 0,
      currentLocation: this.props.userLocations.length != 0 ? this.props.userLocations[0] : {},
      hasCurrentLocation: this.props.userLocations.length != 0  ? true : false,
      fetchedEventsHash: {},
      menuVisible: false,
      localInterests: [],
      localStartDate: this.props.localStartDate ? this.props.localStartDate : new Date(),
      localEndDate: this.props.localEndDate ? this.props.localEndDate : this.getOneYearOut(),
      shouldReloadLists: false,
      favorites: this.props.favorites ? this.props.favorites : [],
      shouldShowOnlyFavorites: false,
    }
  }
  getOneYearOut(){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var todayNextYear = new Date(year + 1, month, day)

    return todayNextYear;
  }
  componentDidMount(){
    this.props.loadOfflineUser();
    this.props.getLocalInterests();
    this.props.getLocalStartDate();
    this.props.getLocalEndDate();
    this.props.getLocalFavorites();
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
      // console.warn('Has new events');
      this.setState({
        fetchedEventsHash: nextProps.fetchedEventsHash,
        shouldReloadLists: false,
      })
    }
    if(nextProps.userLocations != this.props.userLocations){
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
    if(nextProps.localInterests != this.props.localInterests)
    {
      if(nextProps.localInterests)
      {
        if(nextProps.localInterests.length != 0)
        {
          this.setState({localInterests: nextProps.localInterests},function(){
            clearTimeout(this.updateEventsTimeout);
            this.updateEventsTimeout = setTimeout(() => this.updateEvents(), 500)
          });
        }
      }
    }
    if(nextProps.localStartDate != this.props.localStartDate)
    {
      // console.warn('Has new start date');
      this.setState({localStartDate: nextProps.localStartDate},function(){
        clearTimeout(this.updateEventsTimeout);
        this.updateEventsTimeout = setTimeout(() => this.updateEvents(), 500)
      });
    }
    if(nextProps.localEndDate != this.props.localEndDate)
    {
      // console.warn('Has new end date');
      // console.warn(nextProps.localEndDate);
      this.setState({localEndDate: nextProps.localEndDate},function(){
        clearTimeout(this.updateEventsTimeout);
        this.updateEventsTimeout = setTimeout(() => this.updateEvents(), 500)
      });
    }
    if(nextProps.favorites != this.props.favorites)
    {
      this.setState({favorites: nextProps.favorites})
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
    for(var i=0;i<this.state.userLocations.length;i++){
      var location = this.state.userLocations[i];
      if(location){
        this.props.getEvents({
          page:1,
          locationID:location.id,
          startDate:this.state.localStartDate ? this.state.localStartDate : new Date(),
          endDate:this.state.localEndDate ? this.state.localEndDate : this.getOneYearOut(),
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
          endDate:this.state.localEndDate ? this.state.localEndDate : this.getOneYearOut(),
          showCount:true,
          tags: this.state.localInterests ? this.state.localInterests : [],
        });
      }
    }
    this.setState({shouldReloadLists: true});
  }
  onRefresh(locationID){
    this.props.getEvents({
      page:1,
      locationID:locationID,
      startDate:this.state.localStartDate ? this.state.localStartDate : new Date(),
      endDate:this.state.localEndDate ? this.state.localEndDate : this.getOneYearOut(),
      showCount:true,
      tags: this.state.localInterests ? this.state.localInterests : [],
    });
  }
  loadMore(filters){
    this.props.loadMoreEvents({
      page:filters.page,
      locationID:filters.locationID,
      startDate:this.state.localStartDate ? this.state.localStartDate : new Date(),
      endDate:this.state.localEndDate ? this.state.localEndDate : this.getOneYearOut(),
      showCount:true,
      tags: this.state.localInterests ? this.state.localInterests : [],
    });
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
  setFavorites(favorites){
    this.props.setFavorites(favorites);
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
          shouldReloadLists={this.state.shouldReloadLists}
          favorites={this.state.favorites}
          setFavorites={(favorites) => this.setFavorites(favorites)}
          shouldShowOnlyFavorites={this.state.shouldShowOnlyFavorites}
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
        <FeedFilterView height={60} interests={this.state.localInterests} toggleShouldShowOnlyFavorites={() => this.setState({shouldShowOnlyFavorites: !this.state.shouldShowOnlyFavorites})}/>
        <Swiper
          height={height-STATUS_BAR_HEIGHT-HEADER_BAR_HEIGHT-60}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          onMomentumScrollEnd ={this.onMomentumScrollEnd.bind(this)}
        >
          {this.renderListViews()}
        </Swiper>
        {this.state.menuVisible ? <FeedMenu isDemo={this.state.user.email == 'Hsdemo@hsdemo.com'} userLocations={this.state.userLocations} hideMenu={() => this.hideMenu()} logout={() => this.logout()}/> : null}
      </View>
    )
  }
  renderLogin(){
    return(
      <LandingPage/>
    )
  }
  render() {
    if(this.state.isLoggedIn && Object.keys(this.state.user).length != 0 )
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
    userLocations: state.user.user && state.user.user.locales ? state.user.user.locales : [],
    fetchedEvents: state.events.fetchedEvents,
    fetchedEventsHash: state.events.fetchedEventsHash,
    localInterests: state.app.localInterests,
    localStartDate: state.app.localStartDate,
    localEndDate: state.app.localEndDate,
    favorites: state.user.favorites,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
