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
  TouchableOpacity,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
var {height, width} = Dimensions.get('window');
import styleVariables from '../Utils/styleVariables'
import backArrow from '../imgs/arrow-left.png'
import hsGraphic from '../imgs/HotSpot-Graphic.png'
import forwardArrow from '../imgs/arrow-right.png'
import check from '../imgs/check.png'
import Swiper from 'react-native-swiper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import Autocomplete from 'react-native-autocomplete-input'
import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';


var eventActions = require("../actions/eventActions.js");

export default class Login extends Component {
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
    }
  }

  componentWillMount() {

  }
  resetSignupState(){
    // console.warn('resetSignupState');
    // this.setState({
    //   email: '',
    //   password: '',
    //   confirmPassword: '',
    //   firstName: '',
    //   lastName: '',
    // });
  }
  hasCorrectInformation(){

    var hasAlerted = false;

    if(this.state.index == 0) //loginInfo
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
    else if(this.state.index == 1) //basicInfo
    {
      if(this.state.firstName != '' && this.state.lastName != '')
      {
        return true;
      }
    }
    else if(this.state.index == 2) //optionalInfo
    {
      return true;
    }
    else if(this.state.index == 3) //interests
    {
      return true;
    }
    else if(this.state.index == 4) //locations
    {
      if(this.state.city != '')
      {
        return true;
      }
      else {
        Alert.alert("Please select a city");
        hasAlerted = true;
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

      }
    }
  }
  goBack(){
    this.setState({index: this.state.index-1},function(){
      this.refs.swiper.scrollBy(-1,true);
      this.props.updateIndex(this.state.index);
    })
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
  renderLoginInfoPage(){
    return(
      <View key={0} style={{flex:1}}>
        <KeyboardAwareScrollView>
          <Text style={styles.pageTitle}>Sign in Info</Text>
          <View style={styles.textInputHolder}>
            <TextInput style={styles.textInput}
              ref='email'
              onChangeText={(email) => this.setState({email})}
              placeholder='Email'
              placeholderTextColor='#DCE3E3'
              underlineColorAndroid='transparent'
              keyboardType={'email-address'}
              returnKeyType={'next'}
              onSubmitEditing={() => {this.refs.password.focus();}}>
            </TextInput>
          </View>
          <View style={styles.textInputHolder}>
            <TextInput style={styles.textInput}
              secureTextEntry={true}
              ref='password'
              onChangeText={(password) => this.setState({password})}
              placeholder='Password'
              placeholderTextColor='#DCE3E3'
              underlineColorAndroid='transparent'
              returnKeyType={'next'}
              onSubmitEditing={() => {this.refs.confirmPassword.focus();}}>
            </TextInput>
          </View>
          <View style={styles.textInputHolder}>
            <TextInput style={styles.textInput}
              secureTextEntry={true}
              ref='confirmPassword'
              onChangeText={(confirmPassword) => this.setState({confirmPassword})}
              placeholder='Confirm Password'
              placeholderTextColor='#DCE3E3'
              underlineColorAndroid='transparent'
              returnKeyType={'done'}
              onSubmitEditing={() => this.goForward()}>
            </TextInput>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
  renderBasicInfoPage(){
    return(
      <View key={1} style={{flex:1}}>
        <KeyboardAwareScrollView>
          <Text style={styles.pageTitle}>Basic Info</Text>
          <View style={styles.textInputHolder}>
            <TextInput style={styles.textInput}
              ref='firstName'
              onChangeText={(firstName) => this.setState({firstName})}
              placeholder='First Name'
              placeholderTextColor='#DCE3E3'
              underlineColorAndroid='transparent'
              returnKeyType={'next'}
              onSubmitEditing={() => {this.refs.lastName.focus();}}>
            </TextInput>
          </View>
          <View style={styles.textInputHolder}>
            <TextInput style={styles.textInput}
              ref='lastName'
              onChangeText={(lastName) => this.setState({lastName})}
              placeholder='Last Name'
              placeholderTextColor='#DCE3E3'
              underlineColorAndroid='transparent'
              returnKeyType={'done'}
              onSubmitEditing={() => this.goForward()}>
            </TextInput>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
  renderOptionalInfoPage(){
    return(
      <View key={2} style={{flex:1}}>
        <KeyboardAwareScrollView>
          <Text style={styles.pageTitle}>Optional Info</Text>
          <Text style={styles.pageSubTitle}>Optional Information helps us personalize your experience</Text>
          <View style={styles.textInputHolder}>
            <TextInput style={styles.textInput}
              ref='phone'
              onChangeText={(phoneNumber) => this.setState({phoneNumber})}
              placeholder='Phone Number'
              placeholderTextColor='#DCE3E3'
              underlineColorAndroid='transparent'
              keyboardType={'phone-pad'}>
            </TextInput>
          </View>
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
                  fontFamily: styleVariables.systemRegularFont,
                  fontSize: 16,
                },
                dateText:{
                  color: '#FFFFFF',
                  fontFamily: styleVariables.systemRegularFont,
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
        </KeyboardAwareScrollView>
      </View>
    )
  }
  renderInterestsPage(){
    interests = eventActions.renderPossibleInterests();

    var interestsViews = [];
    for (i in interests){
        var interest = i;
        var isSelected = this.state.interests.indexOf(interest) == -1 ? false : true;
        // var backgroundColor = this.state.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
        interestsViews.push(
            <Button ref={interest} underlayColor={'#0D5480'} key={i} style={isSelected ? styles.selectedCell : styles.interestCell} textStyle={isSelected ? styles.selectedCellText : styles.interestCellText} onPress={this.interestSelected.bind(this,interest)}>{interest}</Button>
        );
    }
    return(
      <View key={3} style={{flex:1}}>
        <Text style={styles.pageTitle}>Interests</Text>
        <ScrollView style={{marginBottom:130+32+88+16}}>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {interestsViews}
          </View>
        </ScrollView>
      </View>
    )
  }
  getPossibleLocation() {
    var unfilteredList = ['Columbia','Atlantic City','New York City','Dallas','Houston','Miami','Atlanta'];
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
        if(item.indexOf(this.state.locationSearch) != -1)
        {
          filteredList.push(item);
        }
      }
    }
    return filteredList;
  }
  renderRow(rowData){
    var isSelected = this.state.city == rowData ? true : false;
    return(
      <TouchableHighlight underlayColor={'#0D5480'} style={isSelected ? styles.selectedLocationCell : styles.locationCell} onPress = {() => this.pressRow(rowData)}>
        <Text style={isSelected ? styles.selectedLocationCellText : styles.locationCellText}>{rowData}</Text>
      </TouchableHighlight>
    )
  }
  pressRow(rowData){
    this.setState({city:rowData});
  }
  renderLocationPage(){
    var possibleLocations = this.getPossibleLocation();

    var ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    return(
      <View key={4} style={{flex:1}}>
        <Text style={styles.pageTitle}>Location</Text>
        <Text style={styles.pageSubTitle}>We only have events in select city at the moment</Text>
        <View style={styles.textInputHolder}>
          <TextInput style={styles.textInput}
            ref='locationSearch'
            onChangeText={(locationSearch) => this.setState({locationSearch})}
            placeholder='Search Location'
            placeholderTextColor='#DCE3E3'
            underlineColorAndroid='transparent'>
          </TextInput>
        </View>
        <View style={{height:height*.4}}>
          <ListView
            style={styles.locationList}
            dataSource={ds.cloneWithRows(possibleLocations)}
            renderRow= {this.renderRow.bind(this)}
            enableEmptySections={true}>
          </ListView>
        </View>
      </View>
    )
  }
  render() {
    var Arr = [this.renderLoginInfoPage(),this.renderBasicInfoPage(),this.renderOptionalInfoPage(),this.renderInterestsPage(),this.renderLocationPage()]
    this.lastIndex = Arr.length - 1;
    var isLastIndex = this.state.index == this.lastIndex ? true : false;

    return(
      <View style={styles.container}>
        <Swiper
          ref={'swiper'}
          loop={false}
          showsPagination={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps={true}
        >
          {Arr}
        </Swiper>
        <View style={styles.bottomButtonHolder}>
          <TouchableHighlight underlayColor={isLastIndex ? '#36BE4F' : '#EE6436'} style={isLastIndex ? styles.lastBottomButton : styles.bottomButton} onPress={() => this.goForward()}>
            <Image source={isLastIndex ? check : forwardArrow} style={{width:22,height:22,resizeMode:'contain'}}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomButtonHolder:{
    position: 'absolute',
    left:32,
    right:32,
    bottom:32,
    justifyContent:'center',
    alignItems:'center',
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
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 20,
    color: 'white',
    textAlign:'center',
    marginBottom:8,
  },
  pageSubTitle:{
    fontFamily: styleVariables.systemFont,
    fontSize: 12,
    color: 'white',
    textAlign:'center',
    marginBottom:8,
  },
  textInputHolder:{
    backgroundColor:'#0D5480',
    height: 44,
    marginLeft:32,
    marginRight: 32,
    flexDirection: 'row',
    marginBottom: 16,
  },
  textInput:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: styleVariables.systemFont,
    fontSize: 16,
    padding: 2,
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: '#414E5E',
  },
  datePicker:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    padding: 2,
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: '#414E5E',
  },
  interestCell:{
    margin:8,
    borderWidth:2,
    borderColor:'#414E5E',
    backgroundColor:'#0D5480',
  },
  selectedCell:{
    margin:8,
    borderWidth:2,
    borderColor:'#FFFFFF',
    backgroundColor:'#0D5480',
  },
  interestCellText:{
    fontFamily: styleVariables.systemFont,
    fontSize: 18,
    color: '#DCE3E3',
  },
  selectedCellText:{
    fontFamily: styleVariables.systemBoldFont,
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
    fontFamily: styleVariables.systemFont,
    fontSize: 16,
    color: '#DCE3E3',
  },
  selectedLocationCellText:{
    fontFamily:styleVariables.systemBoldFont,
    fontSize:16,
    color:'white',
  }
})
