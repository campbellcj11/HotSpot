import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
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
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  ActivityIndicator
} from 'react-native'
import Button from '../components/Button'
import { Actions } from 'react-native-router-flux';
var {height, width} = Dimensions.get('window');
import { appStyleVariables, appColors } from '../styles';
import backArrow from '../images/back.png'
import hsGraphic from '../images/HotSpot-Graphic.png'
import forwardArrow from '../images/forward.png'
import profileIcon from '../images/profile.png'
import Swiper from 'react-native-swiper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
// import ModalPicker from 'react-native-modal-picker'
// import SocialAuth from 'react-native-social-auth';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { INTERESTS } from '../lib/constants.js';
import Moment from 'moment';
import landingImage from '../images/Landing-Image.png'

// var userActions = require("../actions/userActions.js");
// var eventActions = require("../actions/eventActions.js");

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default class SignupView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index:0,
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dob: '',
      gender: '',
      interests: [],
      city: '',
      locationSearch: '',
      gender: '',
      imageUrl: '',
      possibleLocations: this.props.possibleLocations,
      userLocations: [],
      possibleLocationsHash: {},
      loadingLocations: true,
      signupLoading: false,
    }
  }
  componentDidMount() {
    this.props.getPossibleLocations();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.possibleLocations != this.props.possibleLocations){
      this.processPossibleLocations(nextProps.possibleLocations);
      this.setState({
        possibleLocations: nextProps.possibleLocations,
        loadingLocations: false,
      });
    }
  }
  processPossibleLocations(sentPossibleLocations)
  {
    var hash = {};
    for(var i=0;i<sentPossibleLocations.length;i++)
    {
      var possibleLocation = sentPossibleLocations[i];
      if(Object.keys(hash).indexOf(possibleLocation.state) == -1)
      {
        hash[possibleLocation.state] = [possibleLocation];
      }
      else
      {
        var hashArray = hash[possibleLocation.state];
        hashArray.push(possibleLocation);
        hash[possibleLocation.state] = hashArray;
      }
    }
    this.setState({possibleLocationsHash:hash});
  }
  signup(){
    var dob = this.state.dob != '' ? new Date(this.state.dob).getTime()/1000 : null;
    var localeIds = [];
    for(var i=0;i<this.state.userLocations.length;i++)
    {
      var locale = this.state.userLocations[i];
      localeIds.push(locale.id);
    }
    var user = {};
    if(dob)
    {
      user = {
        email: this.state.email,
        password: this.state.password,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        dob: dob,
        interests: this.state.interests,
        phone: this.state.phoneNumber,
        locales: localeIds,
        gender: this.state.gender
      }
    }
    else{
      user = {
        email: this.state.email,
        password: this.state.password,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        interests: this.state.interests,
        phone: this.state.phoneNumber,
        locales: localeIds,
        gender: this.state.gender
      }
    }
    // userActions.saveInterests(this.state.interests);
    // userActions.saveLocation(this.state.city);
    // console.log('User: ', user);
    this.props.signUp(user, () => {this.setState({signupLoading: false})});
  }
  hasCorrectInformation(){

    var hasAlerted = false;

    if(this.state.index == 0) //locations
    {
      if(this.state.userLocations.length != 0)
      {
        return true;
      }
      else {
        Alert.alert("Please select a city");
        hasAlerted = true;
      }
    }
    else if(this.state.index == 1) //basicInfo
    {
      return true;
    }
    else if(this.state.index == 2) //basicInfo
    {
      if(this.state.firstName != '' && this.state.lastName != '' && this.state.email != '' && this.state.password != '')
      {
        return true;
      }
      else {
        Alert.alert("Some infomation was left blank");
        hasAlerted = true;
      }
    }
    else if(this.state.index == 3) //interests
    {
      if(this.state.interests.length > 0)
      {
        return true;
      }
      else {
        Alert.alert("Please select at least one interest");
        hasAlerted = true;
      }
    }
    else if(this.state.index == 4) //login info
    {
      if(this.state.email != '' && this.state.password != '')
      {
        if(this.state.password == this.state.confirmPassword)
        {
          return true;
        }
        else{
          Alert.alert("Passwords do not match");
          hasAlerted = true;
        }
      }
    }

    if(!hasAlerted)
    {
      Alert.alert("Please enter all information");
    }

    return false;
  }
  goForward(){
    if(this.state.index != this.lastIndex)
    {
      if(this.hasCorrectInformation())
      {
        this.setState({index: this.state.index+1},function(){
          this.refs.swiper.scrollBy(1,true);
          this.props.updateIndex(this.state.index);
        })
      }
    }
    else
    {
      if(this.hasCorrectInformation())
      {
        this.setState({signupLoading:true});
        this.signup();
      }
    }
  }
  goBack(){
    if(this.state.index == 0)
    {
      this.props.goBack();
    }
    else {
      this.setState({index: this.state.index-1},function(){
        this.refs.swiper.scrollBy(-1,true);
        this.props.updateIndex(this.state.index);
      })
    }
  }
  interestSelected(sentInterest){
    if(this.state.interests.indexOf(sentInterest) == -1)
    {
      var interests = this.state.interests;
      interests.push(sentInterest);
      this.setState({interests:interests});
    }
    else {
      var interests = this.state.interests;
      var index = interests.indexOf(sentInterest);
      interests.splice(index,1);
      this.setState({interests:interests});
    }
  }
  signUpWithFacebook()
  {
    //   SocialAuth.setFacebookApp({id: '1738197196497592', name: 'projectnow'});
    //   SocialAuth.getFacebookCredentials(["email", "public_profile"],
    //   SocialAuth.facebookPermissionsType.read).then((credentials) => {
    //   this.setState({
    //     error: null,
    //     credentials,
    //   })
    //   console.log(this.state.credentials);
    //   this._initFacebookUser(this.state.credentials.accessToken)
    // })
    // .catch((error) => {
    //   this.setState({
    //     error,
    //     credentials: null,
    //   })
    // })
  }

  _initFacebookUser(token)
  {
    var user;
    // console.log("Fetching data");
    fetch('https://graph.facebook.com/v2.6/me?fields=first_name,last_name,picture,email,locale,timezone,gender&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {
      // Some user object has been set up somewhere, build that user here
      this.setState({
        email:  json.email,
        password: json.id,
        firstName:  json.first_name,
        lastName:  json.last_name,
        gender: json.gender,
      });
      // console.log(this.state.email);
      // console.log(this.state.password);
      // console.log(this.state.firstName);
      // console.log(this.state.lastName);
      // console.log(this.state.gender);
    })
    .catch(() => {
      // console.log('ERROR GETTING DATA FROM FACEBOOK')
    })
    //this.state.index = this.state.index+1;

      this.setState({index: this.state.index+2},function(){
      this.refs.swiper.scrollBy(2,true);
      this.props.updateIndex(this.state.index);
    })
  }

  uploadPhoto()
  {
      //here we should upload a photo

  }

  renderLoginInfoPage(){
    return(
      <View key={0} style={{flex:1}}>
        <Text style={styles.pageTitle}>Finish Sign up to begin</Text>
        <KeyboardAwareScrollView>
          <View>
            <View style={styles.userNameView}>
              <TextInput style={styles.userNameTextInput}
                ref='fName'
                onChangeText={(firstName) => this.setState({firstName})}
                placeholder='First Name'
                placeholderTextColor='#C6E1E2'
                underlineColorAndroid='transparent'>
              </TextInput>
            </View>
            <View style={styles.userNameView}>
              <TextInput style={styles.userNameTextInput}
                ref='lName'
                onChangeText={(lastName) => this.setState({lastName})}
                placeholder='Last Name'
                placeholderTextColor='#C6E1E2'
                underlineColorAndroid='transparent'>
              </TextInput>
            </View>
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
            {
              this.state.signupLoading ?
                <ActivityIndicator style={{marginTop:4}}/>
              :
                <Button
                  underlayColor={'#2D2D2D'}
                  onPress={() => this.goForward()}
                  style={styles.loginButton}
                  textStyle={styles.buttonText}>
                  Sign up
                </Button>
            }

          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }

  renderOptionalInfoPage(){
    interests = INTERESTS;

    var interestsViews = [];
    for (i in interests){
        var interest = interests[i];
        var isSelected = this.state.interests.indexOf(interest) == -1 ? false : true;
        interestsViews.push(
            <Button ref={interest} underlayColor={'transparent'} key={i} style={isSelected ? styles.selectedCell : styles.interestCell} textStyle={isSelected ? styles.selectedCellText : styles.interestCellText} onPress={this.interestSelected.bind(this,interest)}>{interest.toUpperCase()}</Button>
        );
    }
    return(
      <View key={2} style={{flex:1}}>
          <Text style={styles.pageTitle}>Provide more information to personalize experience</Text>
          <ScrollView height={250}>
          <View style={styles.textInputHolder}>
            <DatePicker
              ref='dob'
              style={styles.datePicker}
              date={this.state.dob}
              mode="date"
              placeholder="Date of Birth"
              format="MMMM DD, YYYY"
              showIcon={false}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                placeholderText: {
                  color: '#DCE3E3',
                  fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
                  fontSize: 16,
                },
                dateText:{
                  color: '#FFFFFF',
                  fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
                  fontSize: 16,
                },
                dateInput: {
                  borderWidth: 0,
                  alignItems: 'flex-start',
                }
              }}
              onDateChange={(dob) => {this.setState({dob: dob})}}
            />
          </View>
          <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:8}}>
            {interestsViews}
          </View>
        </ScrollView>
      </View>
    )
  }
  getPossibleLocations() {
    var unfilteredList = this.state.possibleLocations;
    var filteredList = [];
    if(this.state.locationSearch == '')
    {
      filteredList = unfilteredList;
    }
    else
    {
      for(var i=0;i<unfilteredList.length;i++)
      {
        var item = unfilteredList[i];
        if(item.name.indexOf(this.state.locationSearch) != -1)
        {
          filteredList.push(item);
        }
      }
    }
    return filteredList;
  }
  renderRow(rowData){
    var isSelected = this.state.userLocations.indexOf(rowData.id) != -1 ? true : false;
    return(
      <TouchableHighlight underlayColor={'#0D5480'} style={isSelected ? styles.selectedLocationCell : styles.locationCell} onPress = {() => this.pressRow(rowData)}>
        <Text style={isSelected ? styles.selectedLocationCellText : styles.locationCellText}>{rowData.name}</Text>
      </TouchableHighlight>
    )
  }
  toggleLocation(location){
    var locations = this.state.userLocations;
    var foundLocation;
    var wasFound = false;
    for(var i=0;i<locations.length;i++)
    {
      var userLocation = locations[i];
      if(location.id == userLocation.id)
      {
        foundLocation = userLocation;
        wasFound = true;
        break;
      }

    }
    if(wasFound)
    {
      var index = locations.indexOf(foundLocation);
      locations.splice(index,1);
    }
    else
    {
      locations.push(location);
    }
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
    this.setState({userLocations: locations});
  }
  renderLocation(location){
    var boxWidth = (width*.85)/3;
    var isSelected = false;
    for(var i=0;i<this.state.userLocations.length;i++)
    {
      var userLocation = this.state.userLocations[i];
      if(location.id == userLocation.id)
      {
        isSelected = true;
        break;
      }
    }
    return (
      <TouchableHighlight key={location.id} underlayColor={'transparent'} onPress={this.toggleLocation.bind(this,location)}>
        <View style={{width:boxWidth,height:66,justifyContent:'center',alignItems:'center',marginBottom:8}}>
          <Image style={{width:44,height:44,borderRadius:22,backgroundColor: isSelected ? appColors.WHITE : '#C3C3C3'}} source={location.image}/>
          <Text style={{fontFamily:appStyleVariables.SYSTEM_REGULAR_FONT,fontSize:14,color: isSelected ? appColors.WHITE : '#C3C3C3'}}>{location.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  renderLocationSection(state,locations){
    locationsViews = [];
    for(var i=0;i<locations.length;i++)
    {
      var location = locations[i];
      locationsViews.push(
        this.renderLocation(location)
      )
    }
    return (
      <View key={state} style={{flexDirection:'row',alignItems:'center',paddingTop:8,marginHorizontal:8,borderBottomWidth:1,borderBottomColor: '#C3C3C3'}}>
        <View style={{flex:.1}}>
          <Text style={{fontFamily:appStyleVariables.SYSTEM_BOLD_FONT,fontSize:24,color:appColors.WHITE}}>{state}</Text>
        </View>
        <View style={{flex:.9,flexDirection:'row',flexWrap:'wrap'}}>
          {locationsViews}
        </View>
      </View>
    )
  }
  renderPossibleLocations(){
    var possibleLocationsViews = [];
    for(var i=0;i<Object.keys(this.state.possibleLocationsHash).length;i++)
    {
      var state = Object.keys(this.state.possibleLocationsHash)[i];
      var locations = this.state.possibleLocationsHash[state];
      if(locations)
      {
        possibleLocationsViews.push(
          this.renderLocationSection(state,locations)
        )
      }
    }
    return possibleLocationsViews
  }
  renderLocationPage(){
    return(
      <View key={4} style={{flex:1}}>
        <Text style={styles.pageTitle}>Select locations that are of interest to you</Text>
        {
          this.state.loadingLocations ?
            <ActivityIndicator style={{marginTop:4}}/>
          :
            <View style={{flex:1}}>
              <ScrollView width={width}>
                {this.renderPossibleLocations()}
              </ScrollView>
            </View>
        }
      </View>
    )
  }
  render() {
    var Arr = [this.renderLocationPage(),this.renderOptionalInfoPage(),this.renderLoginInfoPage()]
    this.lastIndex = Arr.length - 1;
    var isLastIndex = this.state.index == this.lastIndex ? true : false;

    return(
      <View style={styles.container}>
        <Image source={landingImage} style={styles.backgroundImage} blurRadius={25}/>
        <View ref={'topBar'} style={styles.topBar}>
          <View style={{flex:.3}}>
            <TouchableHighlight onPress={() => this.goBack()} underlayColor={'transparent'}>
              <View style={{flexDirection:'row',alignItems:'center',marginLeft:4}}>
                <Image source={backArrow} style={{width:12,height:12,resizeMode:'contain'}}/>
                <Text style={{color:'white',fontFamily:appStyleVariables.SYSTEM_REGULAR_FONT,fontSize:14}}>Back</Text>
              </View>
            </TouchableHighlight>
          </View>
          <Text style={{flex:.4,textAlign:'center',color:'white',fontFamily:appStyleVariables.SYSTEM_REGULAR_FONT,fontSize:16,backgroundColor:'transparent'}}>HotSpot</Text>
          <View style={{flex:.3}}>
            {
              this.state.index == 1 ?
              <TouchableHighlight onPress={() => this.goForward()} underlayColor={'transparent'}>
                <View style={{alignItems:'flex-end',marginRight:4}}>
                  <Text style={{color:'white',fontFamily:appStyleVariables.SYSTEM_REGULAR_FONT,fontSize:14}}>Skip</Text>
                </View>
              </TouchableHighlight>
              :
                null
            }
          </View>
        </View>
        <Swiper
          ref={'swiper'}
          loop={false}
          showsPagination={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps={'always'}
          style={{marginTop:8}}
        >
          {Arr}
        </Swiper>
        {
          isLastIndex ?
            null
          :
            <View style={styles.bottomButtonHolder}>
              <TouchableHighlight
                onPress={() => this.goForward()}
                style={styles.signUpButton}
                underlayColor={'#111111'}
              >
                <Text style={styles.signUpButtonText}>Continue</Text>
              </TouchableHighlight>
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:appColors.BLACK,
  },
  topBar:{
    paddingTop:20,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  backgroundImage:{
    position: 'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
    resizeMode:'cover',
  },
  bottomButtonHolder:{
    position: 'absolute',
    left:32,
    right:32,
    bottom:16,
    justifyContent:'center',
    alignItems:'center',
  },
  buttonBlankText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
  },
  blankButton:{
    marginLeft:32,
    marginRight:32,
    marginTop:8,
  },
  bottomButton:{
    width:44,
    height:44,
    backgroundColor:'#F97237',
    borderWidth: 1,
    borderColor: '#EE6436',
    borderRadius:22,
    justifyContent:'center',
    alignItems:'center',
  },
  lastBottomButton:{
    width:44,
    height:44,
    backgroundColor:'#3CD758',
    borderWidth: 1,
    borderColor: '#36BE4F',
    borderRadius:22,
    justifyContent:'center',
    alignItems:'center',
  },
  pageTitle:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 24,
    color: 'white',
    textAlign:'center',
    marginBottom:8,
    marginHorizontal:8,
  },
  pageSubTitle:{
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 12,
    color: 'white',
    textAlign:'center',
    marginBottom:8,
  },
  textInputHolder:{
    height: 44,
    marginLeft:12,
    marginRight: 12,
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.BLACK,
  },
  imageUploadHolder:{
    height: 88,
    width: 88,
    backgroundColor:'#0D5480',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageTouch:{
      height:88,
      width: 88,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#414E5E',
      alignSelf:'center',
      marginBottom: 16,
  },
  imageText:{
      fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
      fontSize: 16,
      color:'white',
      padding: 2,
  },
  textInput:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 16,
    padding: 2,
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: '#414E5E',
  },
  modalPicker:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    padding: 2,
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: '#414E5E',
  },
  modalText:{
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 16,
    padding: 2,
    paddingTop: 8,
  },
  noGenderText:{
    color:'#DCE3E3',
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 16,
    padding: 2,
    paddingTop: 8,
  },
  datePicker:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
  },
  interestCell:{
    margin:8,
    borderWidth:2,
    borderColor:'#C3C3C3',
    backgroundColor:'transparent',
  },
  selectedCell:{
    margin:8,
    borderWidth:2,
    borderColor:'#FFFFFF',
    backgroundColor:'transparent',
  },
  interestCellText:{
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 18,
    color: '#DCE3E3',
  },
  selectedCellText:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 17,
    color: 'white',
  },
  locationList:{
    marginLeft:32,
    marginRight: 32,
    marginBottom: 16,
  },
  locationCell:{
    marginHorizontal:8,
    marginVertical:4,
    paddingLeft:8,
    height:32,
    borderWidth:2,
    backgroundColor:'#0D5480',
    borderColor:'#414E5E',
    justifyContent:'center'
  },
  selectedLocationCell:{
    marginHorizontal:8,
    marginVertical:4,
    paddingLeft:8,
    height:32,
    borderWidth:2,
    backgroundColor:'#0D5480',
    borderColor:'#FFFFFF',
    justifyContent:'center'
  },
  locationCellText:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 16,
    color: '#DCE3E3',
  },
  selectedLocationCellText:{
    fontFamily:appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize:16,
    color:'white',
  },
  userNameView: {
    height: 44,
    marginLeft:32,
    marginRight: 32,
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.BLACK,
  },
  passwordView: {
    height: 44,
    marginLeft:32,
    marginRight: 32,
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.BLACK,
  },
  userNameTextInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
  },
  loginButton: {
    marginTop:4,
    backgroundColor: appColors.BLACK,
    height: 44,
    marginLeft:32,
    marginRight: 32,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: appColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    backgroundColor: 'transparent',
  },
  signUpButton:{
    height:66,
    borderWidth:1,
    borderColor: appColors.WHITE,
    marginHorizontal:32,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#000000',
  },
  signUpButtonText:{
    textAlign:'center',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 24,
    marginHorizontal:24,
  },
})
