import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Image,
  Dimensions,
  TouchableHighlight,
  Alert,
  StatusBar,
  ScrollView,
  Platform,
  InteractionManager,
  Animated,
  Easing,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import plusImage from '../imgs/plus.png'
// import filterImage from '../imgs/filter.png'
import filterImage from '../imgs/filter2.png'
var {width,height} = Dimensions.get('window');
import * as firebase from 'firebase';
import EventCard from './EventCard'
import EventCell from '../containers/EventCell'
import CreateEvent from './CreateEvent'
import FilterModal from './FilterModal'
import Swiper from 'react-native-swiper';
import SocialAuth from 'react-native-social-auth';
import OAuthManager from 'react-native-oauth';
import Moment from 'moment';
import LandingPage from '../containers/LandingPage'
import styleVariables from '../Utils/styleVariables'


const HEADER_HEIGHT = Platform.OS == 'ios' ? 64 : 44;
const TAB_HEIGHT = 50;


export default class Home extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      email:'',
      password:'',
      currentSelection:{},
      hasCurrentSelection: false,
      transparent: true,
      dataSource:ds,
      items: [],
      isSignUp: false,
      eventModal: false,
      filterOpen: false,
      interests: this.props.interests,
      city: this.props.city,
      startDate: this.props.startDate ? this.props.startDate : new Date(),
      endDate: this.props.endDate,
      loading: true,
      spinValue: new Animated.Value(0),
      isFirstTime: true,
      hasCity: true,
      currentPage: 1,
      loadingMoreEvents:false,
    }
    this.currentIndex = 0;

    // this.props.loadUserData();
    // this.props.loadLoggedInData();
    this.props.loadUserData();
    this.props.loadLoggedInData();
    this.props.loadInterestsData();
    this.props.loadLocationData();
    this.props.loadStartDate();
    this.props.loadEndDate();
    this.props.loadPostcards();
    if(this.props.loggedIn)
    {
      this.listenForItems();
    }
    Actions.refresh({title: this.props.city})
  }

  componentWillMount() {
    Actions.refresh({
             renderRightButton: () => this.renderRightButton(),
             renderLeftButton: () => this.renderLeftButton(),
        })
    // Actions.refresh({title: this.props.city})

    // this.props.loadUserData();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.user != this.props.user)
    {
      if(nextProps.loggedIn)
      {
        this.listenForItems();
      }
    }
    if(nextProps.city != this.props.city)
    {
      Actions.refresh({title: nextProps.city})
      this.setState({
        city: nextProps.city,
      },function(){
        if(nextProps.loggedIn)
        {
          this.listenForItems();
        }
        // Actions.refresh({title:nextProps.city})
      })
    }
    if(nextProps.interests != this.props.interests)
    {
      this.setState({
        interests: nextProps.interests,
      },function(){
        if(nextProps.loggedIn)
        {
          this.listenForItems();
        }
      })
    }
    if(nextProps.startDate != this.props.startDate)
    {
      // console.warn('Has new props');
      this.setState({
        startDate: nextProps.startDate ? nextProps.startDate : new Date(),
      },function(){
        if(nextProps.loggedIn)
        {
          this.listenForItems();
        }
      })
    }
    if(nextProps.endDate != this.props.endDate)
    {
      this.setState({
        endDate: nextProps.endDate,
      },function(){
        if(nextProps.loggedIn)
        {
          this.listenForItems();
        }
      })
    }
  }
  // getLocation() {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       var initialPosition = JSON.stringify(position);
  //       // console.log('position: ',position);
  //       // console.log('initialPosition: ',initialPosition);
  //       this.determineAddress(position);
  //       // this.setState({initialPosition});
  //     },
  //     (error) => alert(JSON.stringify(error)),
  //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  //   );
  // }
  // determineAddress(initialPosition)
  // {
  //   console.log('Address from location');
  //   var obj = {}
  //   var string = 'https://maps.googleapis.com/maps/api/geocode/json?&latlng='+initialPosition.coords.latitude+','+initialPosition.coords.longitude;//baseURL + 'api/v1/workflows/'+workflow_ID+'/tasks/'+task_ID;
  //   // console.log("Fetch url: ",string);
  //   fetch(string,obj)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((responseJson) => {
  //     var cityName = '';
  //     for(var i=0;i<responseJson.results[0].address_components.length;i++)
  //     {
  //       var address_components = responseJson.results[0].address_components[i];
  //       var types = address_components.types;
  //       if(types.indexOf('locality') != -1)
  //       {
  //         cityName = address_components.long_name
  //       }
  //     }
  //     this.setState({city:cityName});
  //     this.updateInfo();
  //     return responseJson;
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // }
  renderRightButton(){
    return (
      <ImageButton image={filterImage} style={{width:21,height:21}} imageStyle={{width:18,height:18,tintColor:'white'}} onPress={this.onRightPress.bind(this)}>
      </ImageButton>
    );
  }
  renderLeftButton(){
    return(
      <ImageButton image={plusImage} style={{top:2,width:21,height:21}} imageStyle={{width:18,height:18,tintColor:'white'}} onPress={this.onLeftPress.bind(this)}>
      </ImageButton>
    )
  }
  onRightPress(){
    this.setState({
      filterOpen: true,
    });
  }
  closeFilters(){
    this.setState({
      filterOpen: false,
    },function() {
      this.updateInfo();
    });
  }
  onLeftPress(){
    this.setState({
      eventModal: true,
    })}

  onCloseCreateEvent(){
    this.setState({
      eventModal: false,
    })
  }

  getRef() {
    return firebase.database().ref();
  }
  handleInterest(sentInterests){
    this.setState({interests:sentInterests});
  }
  setLocation(sentLocationString){
    this.setState({city:sentLocationString});
  }
  setStartDate(sentStartDate){
    this.setState({startDate:sentStartDate});
  }
  setEndDate(sentEndDate){
    this.setState({endDate:sentEndDate});
  }
  updateInfo(){
    this.props.saveInterests(this.state.interests);
    this.props.saveLocation(this.state.city);
    this.props.saveStartDate(this.state.startDate);
    this.props.saveEndDate(this.state.endDate);
    // this.setState({currentPage:1});
    this.setState({loading:true,currentPage:1});
    if(this.props.loggedIn)
    {
      this.listenForItems();
    }
  }
  listenForItems() {
    // var date = new Date();
    var date = this.state.startDate ? this.state.startDate : new Date();
    if(isNaN(this.state.startDate))
    {
      date = new Date();
    }
    // console.warn('AAA: ',date);
    // console.log('AAA: ',date);
    // var timeUTC = date.getTime();
    var timeUTC = Moment.utc(date).valueOf();
    var items = [];
    // console.warn("TIME UTC: ", timeUTC);
    // console.warn("Moment UTC: ", Moment.utc(this.state.startDate).valueOf());
    if(date)
    {
      if(this.state.city)
      {
        var ref = this.getRef().child('events/' + this.state.city);
        ref.orderByChild("Date").startAt(timeUTC).limitToFirst(50).on('value', (snap) => {
          snap.forEach((child) => {
            var tagsRef = this.getRef().child('tags/' + child.key);
            var Tags = [];
            // items = [];
            tagsRef.on("value", (snapshot) => {
              snapshot.forEach((childUnder) => {
                Tags.push(childUnder.key);
              });
              // console.warn(child.val().City);
              if(this.state.city == '' || child.val().City == this.state.city)
              {
                // console.warn('State == city');
                if(this.state.interests.length == 0 || this.state.interests.indexOf(Tags[0]) != -1)
                {
                  var endDate = this.state.endDate;
                  if(isNaN(endDate))
                  {
                    endDate = new Date();
                    endDate.setDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
                  }
                  // console.warn('tag in interests');
                  // console.warn(this.state.endDate);
                  if(endDate)
                  {
                    if(endDate > new Date(child.val().Date))
                    {
                      items.push({
                        Key : child.key,
                        Event_Name: child.val().Event_Name,
                        Date: new Date(child.val().Date),
                        Location: child.val().Location,
                        Image: child.val().Image,
                        latitude: child.val().Latitude,
                        longitude: child.val().Longitude,
                        Tags: child.val().Tags,
                        Short_Description: child.val().Short_Description,
                        Long_Description: child.val().Long_Description,
                        Address: child.val().Address,
                        Website: child.val().Website,
                        MainTag: Tags ? Tags[0]:[],
                        Event_Contact: child.val().Email_Contact,
                        City: child.val().City,
                      });
                    }
                  }
                }
                console.log('ITLs: ',items.length);
                // console.log('ITs: ',items);
                clearTimeout(this.loadTimeout);
                this.loadTimeout = setTimeout(() => {this.setState({items: items,loading:false}), 250});
              }
            });
          });
        });
      }
      else {
        if(this.state.isFirstTime)
        {
          this.setState({isFirstTime:false});
        }
        else {
          console.warn('Does not have a city');
          this.setState({loading:false,hasCity:false});
        }
      }
    }
  }
  tellUserToGetACity(){
    if(this.state.loading)
    {
      Alert.alert(
        'Please select a city','',
        [
          {text: 'Ok', onPress: () => {this.setState({loading:false,filterOpen:true})}},
        ],
        { cancelable: false }
      )
    }
  }
  loadMore(){
    var pageLength = 50;
    var currentPage = this.state.currentPage + 1;
    this.setState({currentPage:currentPage,loadingMoreEvents:true});
    console.warn(currentPage);

    var date = this.state.startDate ? this.state.startDate : new Date();
    if(isNaN(this.state.startDate))
    {
      date = new Date();
    }
    // console.warn('AAA: ',date);
    // console.log('AAA: ',date);
    // var timeUTC = date.getTime();
    var timeUTC = Moment.utc(date).valueOf();
    var items = [];

    var ref = this.getRef().child('events/' + this.state.city);
    ref.orderByChild("Date").startAt(timeUTC).limitToFirst(currentPage*pageLength).on('value', (snap) => {
      snap.forEach((child) => {
        var tagsRef = this.getRef().child('tags/' + child.key);
        var Tags = [];
        // items = [];
        tagsRef.on("value", (snapshot) => {
          snapshot.forEach((childUnder) => {
            Tags.push(childUnder.key);
          });
          // console.warn(child.val().City);
          if(this.state.city == '' || child.val().City == this.state.city)
          {
            // console.warn('State == city');
            if(this.state.interests.length == 0 || this.state.interests.indexOf(Tags[0]) != -1)
            {
              var endDate = this.state.endDate;
              if(isNaN(endDate))
              {
                endDate = new Date();
                endDate.setDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
              }
              // console.warn('tag in interests');
              // console.warn(this.state.endDate);
              if(endDate)
              {
                if(endDate > new Date(child.val().Date))
                {
                  items.push({
                    Key : child.key,
                    Event_Name: child.val().Event_Name,
                    Date: new Date(child.val().Date),
                    Location: child.val().Location,
                    Image: child.val().Image,
                    latitude: child.val().Latitude,
                    longitude: child.val().Longitude,
                    Tags: child.val().Tags,
                    Short_Description: child.val().Short_Description,
                    Long_Description: child.val().Long_Description,
                    Address: child.val().Address,
                    Website: child.val().Website,
                    MainTag: Tags ? Tags[0]:[],
                    Event_Contact: child.val().Email_Contact,
                    City: child.val().City,
                  });
                }
              }
            }
            // console.log('ITs: ',items);
            clearTimeout(this.loadTimeout);
            this.loadTimeout = setTimeout(() => {this.setState({items: items,loadingMoreEvents:false},function(){this.numberOfEvents = items.length}), 250});
          }
        });
      });
    });
  }
  pressRow(rowData) {
    // console.log('RowData: ',rowData);

    Actions.Event({title:'',currentSelection:rowData});
  }
  _closeSelection(){
    this.setState({currentSelection:{}});
    this.setState({hasCurrentSelection:false});
  }
  renderSlides() {
    var eventCells = [];
    // console.warn(this.state.items.length);
    for(var i=0;i < this.state.items.length; i++)
    {
      var cellInfo = this.state.items[i];
    //   console.log('Cell Info ',i,': ',cellInfo);
      eventCells.push(
        <EventCell key={i} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.pressRow(cellInfo)} large={true} eventInfo={cellInfo} style={{marginBottom:8,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>
      );
    }
    return eventCells;
  }
  renderView() {
    if(this.state.hasCity)
    {
      var hasMoreEvents = true;
      var numberOfEvents = this.state.items.length;
      if(this.numberOfEvents == numberOfEvents)
      {
        hasMoreEvents = false;
      }

      return (
        <View style={{flex:1}}>
          <StatusBar
            barStyle="light-content"
          />
          <View>
            <Modal
              animationType='fade'
              transparent={false}
              visible={this.state.hasCurrentSelection}
              onRequestClose={() => this._closeSelection()}
            >
                <EventCard currentSelection={this.state.currentSelection} closeSelection={() => this._closeSelection()}/>
            </Modal>

            <View style={styles.container}>
              <ScrollView ref='swiper' style={{height:height-HEADER_HEIGHT-TAB_HEIGHT,width:width,backgroundColor:'#E2E2E2'}}>
                  {this.renderSlides()}
                  {
                    this.state.items.length > 0 ?
                      this.state.loadingMoreEvents ?
                        <Button style={{width:width,alignItems:'center',justifyContent:'center'}} textStyle={{fontFamily:styleVariables.systemFont,color:'black',fontSize:12}}>Loading...</Button>
                      :
                        hasMoreEvents ?
                          <Button style={{width:width,alignItems:'center',justifyContent:'center'}} textStyle={{fontFamily:styleVariables.systemFont,color:'black',fontSize:12}} onPress={() => this.loadMore()}>Load More</Button>
                        :
                          <Button style={{width:width,alignItems:'center',justifyContent:'center'}} textStyle={{fontFamily:styleVariables.systemFont,color:'black',fontSize:12}}>Sorry. That's all we have.</Button>
                    :
                      <View/>
                  }
              </ScrollView>
            </View>
          </View>
          <FilterModal showing={this.state.filterOpen} interests={this.state.interests} city={this.state.city} startDate={this.state.startDate} endDate={this.state.endDate} close={ () => this.closeFilters()} interestPressed={ (sentInterest) => this.handleInterest(sentInterest)} setLocation={(sentLocationString) => this.setLocation(sentLocationString)} saveStartDate={(sentStartDate) => this.setStartDate(sentStartDate)} saveEndDate={(sentEndDate) => this.setEndDate(sentEndDate)}/>
          <CreateEvent showing={this.state.eventModal} close={ () => this.onCloseCreateEvent()} />
        </View>
      )
    }
    else{
      return (
        <View style={{flex:1}}>
          <StatusBar
            barStyle="light-content"
          />
          <View>
            <View style={styles.container}>
              <Button style={{backgroundColor:'#F97237',borderWidth:1,borderColor:'#EE6436',margin:16,borderRadius:22}} textStyle={{textAlign:'center',fontFamily:styleVariables.systemFont,fontSize:16,color:'white'}} onPress={() => this.setState({filterOpen:true, hasCity:true})}>Please Select a Location</Button>
            </View>
          </View>
          <FilterModal showing={this.state.filterOpen} interests={this.state.interests} city={this.state.city} startDate={this.state.startDate} endDate={this.state.endDate} close={ () => this.closeFilters()} interestPressed={ (sentInterest) => this.handleInterest(sentInterest)} setLocation={(sentLocationString) => this.setLocation(sentLocationString)} saveStartDate={(sentStartDate) => this.setStartDate(sentStartDate)} saveEndDate={(sentEndDate) => this.setEndDate(sentEndDate)}/>
          <CreateEvent showing={this.state.eventModal} close={ () => this.onCloseCreateEvent()} />
        </View>
      )
    }
  }
  renderLogin(){
    return (
      <LandingPage>
      </LandingPage>
    )
  }
  renderLoadingView(){
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(
          this.state.spinValue,
        {
          toValue: 10,
          duration: 6000,
          easing: Easing.linear
        }
      ).start()
    });
    // setTimeout(() => {this.setState({items: items,loading:false}), 250});
    // Second interpolate beginning and end values (in this case 0 and 1)
    const color = this.state.spinValue.interpolate({
      inputRange: [0, 2, 4, 6, 8, 10,],
      outputRange: ['#E2E2E2','#000000','#E2E2E2','#000000','#E2E2E2','#000000']
    })
    return(
      <View style={{flex:1,paddingTop:64,alignItems:'center',justifyContent:'center',backgroundColor:'#E2E2E2'}}>
        <Animated.Text style={{color: color}}>Loading</Animated.Text>
      </View>
    )
  }
  render(){

    if(this.props.loggedIn && this.props.user != {})
    {
      if(this.state.loading)
      {
        return this.renderLoadingView();
      }
      else {
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
  container: {
    flexGrow: 1,
    paddingTop: HEADER_HEIGHT,
  },
  list: {
    marginTop: 20,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    backgroundColor: '#CCC',
    width: width/3,
    height: 100,
  },
  fader: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  itemText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#48BBEC',
    fontSize: 15,
    fontFamily: 'Futura-Medium',
    padding: 2,
  },
})
