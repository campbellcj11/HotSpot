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
  ActivityIndicator
} from 'react-native';

//npm packages
import Swiper from 'react-native-swiper';

import LandingPage from './LandingPage'
import FeedFilterView from './FeedFilterView'
//components
import EventFeedList from '../components/EventFeedList'
import FeedNavBar from '../components/FeedNavBar'
import FeedMenu from '../components/FeedMenu'

//Class variables
const STATUS_BAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const HEADER_BAR_HEIGHT = 44;
var {width,height} = Dimensions.get('window');
import landingImage from '../images/Landing-Image.png'

class Home extends Component {
  constructor(props) {
    super(props);
    // console.log('Props: ', this.props);
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
      isFirstLoad: true,
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
  }
  componentWillReceiveProps(nextProps){
    if( Object.keys(nextProps.fetchedEventsHash).length != 0 ){
      // console.warn( 'Has new events' );
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
      LayoutAnimation.easeInEaseOut();
      this.setState({
        fetchedEventsHash: nextProps.fetchedEventsHash,
        shouldReloadLists: false,
        isFirstLoad: false,
      })
    }
    if(nextProps.user != this.props.user){
      if(nextProps.isLoggedIn)
      {
        this.setState({
          user: nextProps.user,
          isLoggedIn: nextProps.isLoggedIn,
        }, function(){
          this.buildUpTheFilterData();
        });
      }
      else
      {
        this.stopGettingEvents();
        this.setState({
          user: nextProps.user,
          isLoggedIn: nextProps.isLoggedIn,
        });
      }
    }
    if(nextProps.userLocations != this.props.userLocations && nextProps.userLocations.length != 0){
      this.setState({
        currentLocation: nextProps.userLocations.length != 0  ? nextProps.userLocations[this.state.currentLocationIndex] : {},
        hasCurrentLocation: nextProps.userLocations.length != 0  ? true : false,
        userLocations: nextProps.userLocations,
      }, function(){
        this.stopGettingEvents();
        this.getEventsTimeout = setTimeout(() => this.getEvents(), 1000);
      });
    }
    if(nextProps.localInterests != this.props.localInterests)
    {
      if(nextProps.localInterests)
      {
        // if(nextProps.localInterests.length != 0)
        // {
          this.setState({localInterests: nextProps.localInterests},function(){
            this.stopGettingEvents();
            this.getEventsTimeout = setTimeout(() => this.getEvents(), 1000)
          });
        // }
      }
    }
    if(nextProps.localStartDate != this.props.localStartDate)
    {
      this.setState({localStartDate: nextProps.localStartDate},function(){
        this.stopGettingEvents();
        this.getEventsTimeout = setTimeout(() => this.getEvents(), 1000)
      });
    }
    if(nextProps.localEndDate != this.props.localEndDate)
    {
      this.setState({localEndDate: nextProps.localEndDate},function(){
        this.stopGettingEvents();
        this.getEventsTimeout = setTimeout(() => this.getEvents(), 1000)
      });
    }
    if(nextProps.favorites != this.props.favorites)
    {
      // console.warn('favorites');
      this.setState({favorites: nextProps.favorites})
    }
  }
  buildUpTheFilterData(){
    this.props.getLocalInterests();
    this.props.getLocalStartDate();
    this.props.getLocalEndDate();
    this.props.getLocalFavorites();
    this.props.getDateFilterType();
  }
  stopGettingEvents(){
    this.setState({
      gettingEventsWasStopped: true,
    })
    clearTimeout(this.getEventsTimeout);
  }
  goToDiscover(){
    // this.stopGettingEvents();
    Actions.discover();
  }
  logout(){
    this.hideMenu();
    this.props.logoutUser();
  }
  getEvents(){
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
    // this.stopGettingEvents();

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
        <FeedFilterView
          height={60}
          interests={this.state.localInterests}
          toggleShouldShowOnlyFavorites={() => {this.setState({shouldShowOnlyFavorites: !this.state.shouldShowOnlyFavorites})}}/>
        <Swiper
          height={height-STATUS_BAR_HEIGHT-HEADER_BAR_HEIGHT-60}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          onMomentumScrollEnd ={this.onMomentumScrollEnd.bind(this)}
        >
          {this.renderListViews()}
        </Swiper>
        {
          this.state.menuVisible ?
            <FeedMenu
              isDemo={this.state.user.email == 'Hsdemo@hsdemo.com'}
              userLocations={this.state.userLocations}
              hideMenu={() => this.hideMenu()}
              logout={() => this.logout()}/>
          :
            null
        }
      </View>
    )
  }
  renderLogin(){
    return(
      <LandingPage/>
    )
  }
  renderFirstLoad(){
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <StatusBar barStyle="light-content"/>
        <Image source={landingImage} style={{position:'absolute',top:0,left:0,right:0,bottom:0}}/>
        <ActivityIndicator size={'large'} color={appColors.WHITE}/>
      </View>
    )
  }
  render() {
    if(this.state.isLoggedIn && Object.keys(this.state.user).length != 0 )
    {
      if(this.state.isFirstLoad)
      {
        return this.renderFirstLoad();
      }
      else
      {
        return this.renderView();
      }
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
