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
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import titleImage from '../images/hs-title.png'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import logoutImage from '../images/arrows.png'
import searchImage from '../images/magnifying-glass.png'
import plusImage from '../images/plus.png'
import filterImage from '../images/filter.png'
import LinearGradient from 'react-native-linear-gradient';
var {width,height} = Dimensions.get('window');
import * as firebase from 'firebase';
import EventCard from './EventCard'
import EventPage from './EventPage'
import EventCell from './EventCell'
import CreateEvent from './CreateEvent'
import FilterModal from './FilterModal'
import Swiper from 'react-native-swiper';

const HEADER_HEIGHT = Platform.OS == 'ios' ? 64 : 44;
const TAB_HEIGHT = 50;
const CARD_WIDTH = width;
const CARD_HEIGHT = height - HEADER_HEIGHT - TAB_HEIGHT;


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
    }
    this.currentIndex = 0;

    // this.props.loadUserData();
    // this.props.loadLoggedInData();
    this.props.loadUserData();
    this.props.loadLoggedInData();
    this.props.loadInterestsData();
    this.props.loadLocationData();
    this.listenForItems();
    this.getLocation();
  }

  componentWillMount() {
    Actions.refresh({
             renderRightButton: () => this.renderRightButton(),
             renderLeftButton: () => this.renderLeftButton(),
        })

    // this.props.loadUserData();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.user != this.props.user)
    {
      this.listenForItems();
    }
    if(nextProps.city != this.props.city)
    {
      this.setState({
        city: nextProps.city,
      })
      this.listenForItems();
    }
    if(nextProps.interests != this.props.interests)
    {
      this.setState({
        interests: nextProps.interests,
      })
      this.listenForItems();
    }
  }
  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        // console.log('position: ',position);
        // console.log('initialPosition: ',initialPosition);
        this.determineAddress(position);
        // this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  determineAddress(initialPosition)
  {
    console.log('Address from location');
    var obj = {}
    var string = 'https://maps.googleapis.com/maps/api/geocode/json?&latlng='+initialPosition.coords.latitude+','+initialPosition.coords.longitude;//baseURL + 'api/v1/workflows/'+workflow_ID+'/tasks/'+task_ID;
    // console.log("Fetch url: ",string);
    fetch(string,obj)
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      var cityName = '';
      for(var i=0;i<responseJson.results[0].address_components.length;i++)
      {
        var address_components = responseJson.results[0].address_components[i];
        var types = address_components.types;
        if(types.indexOf('locality') != -1)
        {
          cityName = address_components.long_name
        }
      }
      // console.log('RAH: ',responseJson.results[0].address_components);
      // console.log('RAH: ',responseJson.results[0].address_components[3].long_name);
      // console.log('CityName: ',cityName);

      // console.log('Lat: ',responseJson.results[0].geometry.location.lat);
      // console.log('Long: ',responseJson.results[0].geometry.location.lng);
      // var cityName = responseJson.results[0].address_components[3].long_name;
      // var lat = responseJson.results[0].geometry.location.lat;
      // var lng = responseJson.results[0].geometry.location.lng;
      this.setState({city:cityName});
      this.updateInfo();
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  setEventVisible(visible){
    this.setState({
      eventModal: visible,
    })
  }
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
  setEventVisible(visible){

  }
  onCloseCreateEvent(){
    this.setState({
      eventModal: false,
    })
  }

  getRef() {
    return firebase.database().ref();
  }
  handleInterest(sentInterests){
    // console.log(sentInterest);
    // console.log(this.state.interests);
    // console.log(this.state.interests.indexOf(sentInterest));

    // if(this.state.interests.indexOf(sentInterest) == -1)
    // {
    //   console.log('Adding Interests');
    //   var interests = this.state.interests;
    //   interests.push(sentInterest);
    //   this.setState({interests:interests});
    // }
    // else
    // {
    //   console.log('Removing Interests');
    //   var interests = this.state.interests;
    //   var index = interests.indexOf(sentInterest);
    //   interests.splice(index,1);
    //   this.setState({interests:interests});
    // }
    this.setState({interests:sentInterests});
  }
  setLocation(sentLocationString){
    this.setState({city:sentLocationString});
  }
  updateInfo(){
    this.props.saveInterests(this.state.interests);
    this.props.saveLocation(this.state.city);
    this.listenForItems();
  }
  listenForItems() {
    var today = new Date();
    var timeUTC = today.getTime();
    var items = [];
    // console.log("TIME UTC: " + timeUTC);
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
          // console.warn(this.state.city);
          if(this.state.city == '' || child.val().City == this.state.city)
          {
            // console.warn('State == city');
            if(this.state.interests.length == 0 || this.state.interests.indexOf(Tags[0]) != -1)
            {
              // console.warn('tag in interests');
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
            // console.log('ITLs: ',items.length);
            // console.log('ITs: ',items);
            clearTimeout(this.loadTimeout);
            this.loadTimeout = setTimeout(() => {this.setState({items: items}), 250});
          }
        });
      });
    });
  }

  _login(){
    var user = {'email': this.state.email,
                'password' : this.state.password};
    if(this.state.isSignUp)
    {
      this.props.signUpUser(user);
    }
    else
    {
      this.props.loginUser(user);
    }
  }

  _loginWithoutAccount() {
    user = {'email': 'test@test.com',
            'password' : 'password'};
    if(this.state.isSignUp)
    {

    }
    else
    {
      this.props.loginUser(user);
    }
  }

  _logout(){
    this.props.logoutUser();
  }

  _resetPassword() {
    this.props.resetPassword(this.state.email);
  }
  _openSignupPage(){
    this.setState({isSignUp:!this.state.isSignUp});
  }
  _browse(){
    Alert.alert(
      'Coming soon',
      'This is the browse feature and it is currently being built',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    )
  }
  _openProfile(){
    Alert.alert(
      'Coming soon',
      'The profile feature and it is currently being built',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    )
  }
  renderRow(rowData){
    return (
      <TouchableHighlight
        onPress={()=> this.pressRow(rowData)}
        underlayColor = '#dddddd'
        style={styles.item}>
          <Image style={styles.item} source={{uri: rowData.Image}}>
            <View style={styles.fader}>
              <Text style={styles.itemText}>{rowData.Event_Name}</Text>
            </View>
          </Image>
      </TouchableHighlight>
    )
  }
  pressRow(rowData) {
    console.log('RowData: ',rowData);
    // this.setState({currentSelection:rowData});
    // this.setState({hasCurrentSelection:true});

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
    // this.currentIndex = 0;
    // var pageLengths = [];
    // var sumOfEvents = 0;
    //
    // var eventPages = [];
    // var pageNumber = 0;
    // while(this.currentIndex < this.state.items.length - 1)
    // {
    //   var randomNumberOfEventsPerPage = Math.floor(Math.random() * 2) + 2;//Generates a randomNumber (2-3)
    //   var eventsForPage = [];
    //
    //   for(var j = this.currentIndex ; j < this.currentIndex + randomNumberOfEventsPerPage; j++)
    //   {
    //     if(j < this.state.items.length)
    //     {
    //       eventsForPage.push(this.state.items[j]);
    //     }
    //   }
    //   this.currentIndex = this.currentIndex + randomNumberOfEventsPerPage;
    //   eventPages.push(<EventPage key={pageNumber} partOfFavorites={false} cellPressed={(cellData) => this.pressRow(cellData)} pageNumber={pageNumber} eventsForPage={eventsForPage} eventsPerPage={randomNumberOfEventsPerPage} style={[styles.card,{backgroundColor:'white'}]} width={CARD_WIDTH} height={CARD_HEIGHT}/>);
    //   pageNumber++;
    // }
    //
    // return eventPages;
    // var colors = ['white'];
    // var eventsPerPage = 3;
    // var numberOfPages = Math.ceil(this.state.items.length / eventsPerPage);
    // let Arr = new Array(numberOfPages).fill(0).map((a, i) => {
    //   // console.log('A:',a);
    //   // var data = this.props.template.entities.slides[a];
    //   var eventsForPage = []
    //
    //   for(var j = this.currentIndex ; j < this.currentIndex + eventsPerPage; j++)
    //   {
    //     if(j < this.state.items.length)
    //     {
    //       eventsForPage.push(this.state.items[j]);
    //     }
    //   }
    //
    //   this.currentIndex = this.currentIndex + eventsPerPage;
    //
    //   return <EventPage key={i} partOfFavorites={false} cellPressed={(cellData) => this.pressRow(cellData)} pageNumber={i} eventsForPage={eventsForPage} eventsPerPage={eventsPerPage} style={[styles.card,{backgroundColor: colors[i % colors.length]}]} width={CARD_WIDTH} height={CARD_HEIGHT}/>
    // })
    // return (Arr)
  }
  renderView(){
    return (
      <View>
        <Modal
          animationType='fade'
          transparent={false}
          visible={this.state.hasCurrentSelection}
          onRequestClose={() => {alert("Modal can not be closed.")}}
        >
            <EventCard currentSelection={this.state.currentSelection} closeSelection={() => this._closeSelection()}/>
        </Modal>

        <View style={styles.container}>
          <ScrollView ref='swiper' style={{height:height-HEADER_HEIGHT-TAB_HEIGHT,width:width,backgroundColor:'#E2E2E2'}}>
              {this.renderSlides()}
          </ScrollView>
        </View>
      </View>
    )
  }
  renderModal(){
    var loginButtonText = this.state.isSignUp ? 'Sign Up' : 'Login';
    var signUpButtonText = this.state.isSignUp ? 'Login' : 'Sign Up';
    var loginWithoutAccountButtonText = this.state.isSignUp ? '' : 'Login without an Account';
    var forgotPasswordButtonText = this.state.isSignUp ? '' : 'Forgot Password?';
    return (
      <Modal
          animationType={'none'}
          transparent={false}
          visible={!this.props.loggedIn}
          onRequestClose={() => {alert("Modal can not be closed.")}}
      >
        <View style={{flexDirection:'row'}}>
        <View style={styles.modalBackground}>
          <Image source={titleImage} style={styles.titleImage}/>
          <View style={styles.userNameView}>
            <TextInput style={styles.userNameTextInput}
              ref='email'
              onChangeText={(email) => this.setState({email})}
              placeholder='Email'
              placeholderTextColor='#C6E1E2'
              underlineColorAndroid='transparent'>
            </TextInput>
          </View>

          <View style={styles.passwordView}>
            <TextInput style={styles.userNameTextInput}
              secureTextEntry={!this.state.isSignUp}
              ref='password'
              onChangeText={(password) => this.setState({password})}
              placeholder='Password'
              placeholderTextColor='#C6E1E2'
              underlineColorAndroid='transparent'>
            </TextInput>
          </View>
          <Button
            onPress={() => this._resetPassword()}
            style={styles.forgotPasswordBlankButton}
            textStyle={styles.forgotPasswordText}>
            {forgotPasswordButtonText}
          </Button>
          <Button
            onPress={() => this._login()}
            style={styles.loginButton}
            textStyle={styles.buttonText}>
            {loginButtonText}
          </Button>
          <Button
            onPress={() => this._loginWithoutAccount()}
            style={styles.loginBlankButton}
            textStyle={styles.buttonBlankText}>
            {loginWithoutAccountButtonText}
          </Button>
          <Button
            onPress={() => this._openSignupPage()}
            style={styles.signupBlankButton}
            textStyle={styles.buttonBlankText}>
            {signUpButtonText}
          </Button>
        </View>
        </View>
      </Modal>
    )
  }
  render() {
    console.log('PROPS!')
    console.log(this.props)
    let user, readonlyMessage, viewToShow
    //if(firebase.auth().currentUser)
    if(this.props.loggedIn && this.props.user != {})
    {
      user = this.props.user
      readonlyMessage = <Text style={styles.offline}>Logged In {user.email}</Text>
      viewToShow = this.renderView();
    }
    else
    {
      readonlyMessage = <Text style={styles.offline}>Not Logged In</Text>
      viewToShow = this.renderModal();
    }

    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff'}
      : null;

    return (
      <View style={{flex:1}}>
        <StatusBar
          barStyle="light-content"
        />
        {viewToShow}
        <FilterModal showing={this.state.filterOpen} interests={this.state.interests} city={this.state.city} close={ () => this.closeFilters()} interestPressed={ (sentInterest) => this.handleInterest(sentInterest)} setLocation={(sentLocationString) => this.setLocation(sentLocationString)}/>
        <CreateEvent showing={this.state.eventModal} close={ () => this.onCloseCreateEvent()} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: HEADER_HEIGHT,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  innerContainer: {

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
  offline: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  modalButton: {
    margin: 10,
    backgroundColor: 'rgb(56,198,95)',
    height: 50,
  },
  titleImage: {
    left: width*.2,
    right: width*.2,
    width: width*.6,
    height: 150,
    resizeMode: 'contain', // or 'stretch'
    marginTop: Platform.OS == 'ios' ? 20 : 20,
    marginBottom: Platform.OS == 'ios' ? 20 : 20,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: Platform.OS == 'ios' ? height : height-20,
    backgroundColor: '#0E476A',
  },
  loginButton: {
    marginTop: 5,
    backgroundColor: '#F97237',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#EE6436',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBlankButton: {
    marginTop: 5,
    backgroundColor: 'transparent',
    height: 50,
    marginLeft: width*.2,
    marginRight: width*.2,
  },
  signupBlankButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    height: 44,
    left: width*.2,
    right: width*.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordBlankButton: {
    backgroundColor: 'transparent',
    height: 30,
    marginLeft: width*.2,
    marginRight: width*.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
  },
  buttonBlankText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height*.1,
    backgroundColor:'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bottomBarButton: {
    backgroundColor: 'transparent',
    height: height*.1,
    width: height*.1,
    flex:1,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    backgroundColor: 'transparent',
  },
  title: {
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: Platform.OS == 'ios' ? 55 : 45,
    height: 55,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 36,
    marginBottom: Platform.OS == 'ios' ? 40 : 30,
  },
  userNameView: {
    backgroundColor:'#7148BC22',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 15,
  },
  passwordView: {
    backgroundColor:'#7148BC22',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 5,
  },
  userNameTextInput: {
    flex: .85,
    height: 50,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: 'Futura-Medium',
    padding: 2,
    paddingLeft: 10,
    borderWidth: 2,
    borderColor: '#B166CE22',
  },
  scroll: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding:10,
  },
  seperator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  eventName: {
    fontSize: 24,
    color: '#48BBEC'
  },
  thumb: {
    width: 100,
    height: 100,
  },
  eventDateView: {
    backgroundColor:'transparent',
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    height: 150,
    resizeMode: 'contain',
  },
  eventMapView: {
    backgroundColor:'blue',
    right: 0,
    top: 0,
    width: 200,
    height: 100,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'red',
  },
  card: {
    backgroundColor: '#ccc',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'white',
    height: CARD_HEIGHT,
  },
})
