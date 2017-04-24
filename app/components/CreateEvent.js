///////////////////////
/*

Author: ProjectNow Team
Class: CreateEvent
Description: Displays inputs that allow users to create an event. 

*/
///////////////////////
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import DatePicker from 'react-native-datepicker'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import titleImage from '../images/hs-title.png'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import logoutImage from '../images/arrows.png'
import searchImage from '../images/magnifying-glass.png'
import plusImage from '../images/plus.png'
import closeImage from '../imgs/close.png'
import checkImage from '../imgs/check.png'
import arrow_right from '../imgs/arrow-right.png'
import filterImage from '../images/filter.png'
import LinearGradient from 'react-native-linear-gradient';
import NativeMethodsMixin from 'NativeMethodsMixin'
import * as firebase from 'firebase';
import EventCard from './EventCard'
import EventPage from './EventPage'
import TagSelection from './TagSelection'
import Swiper from 'react-native-swiper';
import styleVariables from '../Utils/styleVariables'

var eventActions = require("../actions/eventActions.js");
var {width,height} = Dimensions.get('window');
const HEADER_HEIGHT = styleVariables.titleBarHeight;
const TAB_HEIGHT = 50;
const CARD_WIDTH = width;
const CARD_HEIGHT = height - HEADER_HEIGHT;
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;


/* This variable returns the url of the event image saved in Firebase storage DB */
const uploadImage = (uri, imageName, mime = 'image/jpg') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null
      const imageRef = firebase.storage().ref('EventImages').child(imageName)

      fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL();
      })
      .then((url) => {

        resolve(url)//returns firebase URL
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default class CreateEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Address : '',
      City: '',
      _city: '',
      locationSearch: '',
      County: '',
      Event_Date: '',
      Email_Contact: '',
      Event_Name: '',
      Event_Type: '',
      imageLocation:'',
      Latitude: '',
      Event_Location: '',
      Longitude: '',
      Long_Description: '',
      optionalVisible: false,
      Short_Description: '',
      Sort_Date: '',
      State: '',
      Status: '',
      Ticket_URI: '',
      Time: '',
      Website : '',
      eventID: '',
      allowUpload: false,
      responseURI: '',
      currentDate: new Date(),
      TagsVisible: false,
      citiesVisible: false,
      tags: [],
      textHeight: CARD_HEIGHT*.075,
    }

    //reference to events in approval queue table
    this.eventQueue = this.getRef().child('approvalQueue/');

    //reference to event images stored in firebase storage
    this.eventImageRef = this.getStorageRef().child('EventImages');

  }

  //reference to Firebase DB
  getRef() {
    return firebase.database().ref();
  }

  //reference to Firebase storage DB
  getStorageRef() {
    return firebase.storage().ref();
  }

  /* This function renders the image selected from User's device. It utilizes
  the package 'react-native-image-picker'*/
  renderImage(){
    ImagePicker.showImagePicker((response) => {
      if(response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }else {
        this.setState({
          responseURI: response.uri,
        })
      }
    })
  }

  /*This function serves as a simple text input validation. Ensure the required fields
  contain proper values */
  checkComplete(){
    var mergeDateAndTime = this.state.Event_Date+ " " + this.state.Time;
    var unixTime = new Date(mergeDateAndTime).getTime();
    //empty field check
    if(
      this.mergeDateAndTime != '' &&
      this.state.Event_Address != '' &&
      this.state._city != '' &&
      this.state.Event_Name != '' &&
      this.state.Short_Description != '' &&
      this.state.State != '' &&
      this.state.tags.length != 0
    )
    {
      //proceed to optional information input
      //renders optional info modal
      this.setOptionalInfoVisible(true);
    }
    else {
      Alert.alert('Please fill out all of the information.');
    }
  }

  /*This function is called once an event is submitted for approval. Upon submission,
  an event object is created in Firebase DB and stored in the approval queue*/
  _submitEvent(userRef){
      var newEventKey = this.eventQueue.push().key;
      var mergeDateAndTime = this.state.Event_Date+ " " + this.state.Time;
      var unixTime = new Date(mergeDateAndTime).getTime();

      //Uploads image from user device to firebase storage DB.
      uploadImage(this.state.responseURI, newEventKey+'.jpg')
          .then(url => firebase.database().ref('approvalQueue/'+newEventKey).update({
            "Image": url,
          })
          )
        .catch((error) => {
        reject(error)
           });

      //new event object is created with unique key and values are saved to firebase.
      firebase.database().ref('approvalQueue/'+newEventKey).update({
        "Address" : this.state.Event_Address,
        "City": this.state._city,
        "County": this.state.County,
        "Date": unixTime,
        "Email_Contact": this.state.Email_Contact,
        "Event_Name" : this.state.Event_Name,
        "Event_Type": this.state.Event_Type,
        "Latitude": this.state.Latitude,
        "Location": this.state.Event_Location,
        "Longitude": this.state.Longitude,
        "Long_Description": this.state.Long_Description,
        "Short_Description": this.state.Short_Description,
        "Sort_Date": unixTime,
        "State": this.state.State,
        "Status": this.state.Status,
        "Tags": this.state.tags,
        "Ticket_URI": this.state.Ticket_URI,
        "Website" : this.state.Website,
      })

      this.setState({
        responseURI: '',
        optionalVisible: false,
        _city: '',
        Event_Name: '',
        Event_Address: '',
        Email_Contact: '',
        Event_Location: '',
        Long_Description: '',
        Short_Description: '',
        State: '',
        tags: '',
        Website: '',
        Time: '',
        Event_Date: '',
      })

      //create event modal is closed upon submission
      this.props.close();

    }

  // setEventVisible(visible){
  //   this.setState({
  //     eventModal: visible,
  //   })
  // }
  // onLeftPress(){
  //   this.setEventVisible(true);
  // }
  //
  // onExitPress(){
  //   this.setEventVisible(false);
  // }

  /*This function is called once a tag has been selected. The tag will be added
  to the dynamic list of tags.
  */
  buttonPressed(sentTag) {
     console.log("tag!"+sentTag);
     console.log(this.state.tags);
    // console.log(this.state.interests.indexOf(sentInterest));
    if(this.state.tags.indexOf(sentTag) == -1)
    {
      var tags = this.state.tags ? this.state.tags : [];
      tags.push(sentTag);
      this.setState({tags:tags});
    }
    else
    {
      var tags = this.state.tags;
      var index = tags.indexOf(sentTag);
      tags.splice(index,1);
      this.setState({tags:tags});
    }

  }

  /*This function renders the dynamic list of possible tags available to the user.*/
  renderTags(){
    //calls renderPossibleInterests function found in eventActions.js
    tags = eventActions.renderPossibleInterests();

    var interestsViews = [];
    for (i in tags){
      var tag = i;
      var isSelected = this.state.tags.indexOf(tag) == -1 ? false : true;

      //push selected interests to interestsView array.
      interestsViews.push(
          <Button ref={tag} underlayColor={'#FFFFFF'} key={i}
          style={isSelected ? styles.selectedCell : styles.interestCell}
          textStyle={isSelected ? styles.selectedCellText : styles.interestCellText}
          onPress={this.buttonPressed.bind(this,tag)}>{tag.toUpperCase()}</Button>
      );
    }
    //return array of selected interests
    return interestsViews;
  }

  /*This function will render the optional info modal.*/
  setOptionalInfoVisible(visible) {
    this.setState({
      optionalVisible: visible,
    });
  }

 /*This function will render the content of the optional info modal */
  renderOptionalInfo() {
    var saveButtonText = 'Submit';
    var changePhoto = 'Click here to add image';
    var tagString = '';
    var inputView = CARD_HEIGHT*.1;
    var textView = CARD_HEIGHT*.075;
    var dynamicTextHeight = this.state.textHeight;
    var expandingView = dynamicTextHeight + (inputView - textView);


    return (
      <View style={{flex:1}}>
  <KeyboardAwareScrollView>
      <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
    </View>
    <Text style = {styles.text_header}>Optional Info</Text>


    <View style={styles.creator_EventView}>
      <View style={styles.creator_NameInput}>
        <TextInput
          style = {styles.TextInput}
          placeholder = 'Venue'
          ref='Location'
          onChangeText={(Event_Location) => this.setState({Event_Location})}
          placeholderTextColor={styleVariables.greyColor}
          underlineColorAndroid='transparent'
        >
        </TextInput>
      </View>
    </View>
        <View style={styles.creator_EventView}>
            <View style={styles.creator_NameInput}>
              <TextInput
              style = {styles.TextInput}
              placeholder = 'Website'
              ref='website'
              onChangeText={(Website) => this.setState({Website})}
              placeholderTextColor={styleVariables.greyColor}
              underlineColorAndroid='transparent'
              >
            </TextInput>
          </View>
        </View>

          <View style={styles.creator_EventView}>
            <View style={styles.creator_NameInput}>
              <TextInput
                style = {styles.TextInput}
                placeholder = 'Email Contact'
                ref='contact'
                onChangeText={(Email_Contact) => this.setState({Email_Contact})}
                placeholderTextColor={styleVariables.greyColor}
                underlineColorAndroid='transparent'
              >
              </TextInput>
            </View>
          </View>

          <View style={[styles.creator_EventView, {height: Math.max(CARD_HEIGHT*.1,expandingView)}]}>
            <View style={[styles.creator_DynamicInput, {height: Math.max(CARD_HEIGHT*.075,this.state.textHeight)}]}>
               <TextInput
               style = {[styles.TextInput]}
               placeholder = 'Long Description'
               ref='long Description'
               multiline={true}
               onChangeText={(Long_Description) => this.setState({Long_Description})}
               onContentSizeChange={(event) => {
                 this.setState({textHeight: event.nativeEvent.contentSize.height});
               }}
               placeholderTextColor={styleVariables.greyColor}
               underlineColorAndroid='transparent'
                >
              </TextInput>
            </View>
          </View>

          <View style = {{flex:1, alignItems: 'center'}}>
            <ImageButton image={checkImage} style={styles.saveBasicInput}
              onPress={() => Alert.alert('Almost There...',
              'This feature will require a small, one-time fee or a monthly subscription, but it is available to testers for free.',            [
              {text: 'Create Event', onPress: () => this._submitEvent()},
            ])}>
            </ImageButton>
          </View>
       </KeyboardAwareScrollView>
    </View>

    )
  }

 /*This function will render the dynamic list of locations available to the user.*/
  renderLocation(){
    var possibleLocations = this.getPossibleLocations();

    var ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    return(
      <View style={{flex:1}}>
        <View style={styles.TextInputHolder}>
          <TextInput style={styles.cityInput}
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
            renderRow= {this.renderLocationRow.bind(this)}
            enableEmptySections={true}>
          </ListView>

        </View>
      </View>
    )
  }

  /*This function will render the list of locations based on the filtered search. */
  getPossibleLocations() {
    //calls renderPossibleLocations function found in eventActions.js
    var unfilteredList = eventActions.renderPossibleLocations();
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

  /*This function will render to style and layout of the each individual location*/
  renderLocationRow(rowData){
    var isSelected = this.state._city == rowData ? true : false;
    return(
      <TouchableHighlight underlayColor={'#FFFFFF'} style={isSelected ? styles.selectedLocationCell : styles.locationCell} onPress = {this.pressRow.bind(this,rowData)}>
        <Text style={isSelected ? styles.selectedLocationCellText : styles.locationCellText}>{rowData}</Text>
      </TouchableHighlight>
    )
  }

  /*Sets the state variable to the selected city.*/
  pressRow(rowData){
    this.setState({_city:rowData});
  }

  /*This function renders the Create Event component */
  render() {
    var saveButtonText = 'Submit';
    var changePhoto = 'Click here to add image';
    var tagString = '';
    var cityString = '';
    var inputView = CARD_HEIGHT*.1;
    var textView = CARD_HEIGHT*.075;
    var dynamicTextHeight = this.state.textHeight;
    var expandingView = dynamicTextHeight + (inputView - textView);
    var citySelected = this.state._city === '' ? false : true;
    var tagSelected = this.state.tags.length === 0 ? false : true;
    if(this.state.tags.length === 0)
    {
      tagString = 'Tags';
    }
    else {
      tagString = this.state.tags.join(', ');
    }
    if(this.state._city === '')
    {
      cityString = 'City';
    }
    else {
      cityString = this.state._city;
    }

    return(
      <Modal
        animationType={'slide'}
        transparent = {false}
        visible = {this.props.showing}
        onRequestClose={() => {alert("Modal can not be closed.")}}
      >
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.citiesVisible}
          onRequestClose={() => {alert("Modal can not be closed.")}}
        >
          <View style = {styles.container_settings}>
            {/*Location selection modal*/}
            <View style = {styles.navigationBarStyle}>
              <Text style = {styles.navigationBarTextStyle}>
                Select City
              </Text>
              <ImageButton image={checkImage} style={{top:8}} onPress={() => this.setState({citiesVisible: false})}>
              </ImageButton>
            </View>

            <View style = {styles.container_addEvent}>
              <View style={styles.interestsHolder}>
                {/*Location selection modal*/}
                {this.renderLocation()}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.TagsVisible}
          onRequestClose={() => {alert("Modal can not be closed.")}}
        >
          <View style = {styles.container_settings}>
            <View style = {styles.navigationBarStyle}>
              <Text style = {styles.navigationBarTextStyle}>
                Select Tags
              </Text>
              <ImageButton image={closeImage} style={{top:8}} onPress={() => this.setState({TagsVisible: false})}>
              </ImageButton>
            </View>
            <ScrollView style={{height:height-HEADER_HEIGHT}}>
              <View style={styles.interestsHolder}>
                {/*Tag selection modal*/}
                {this.renderTags()}
              </View>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.optionalVisible}
          onRequestClose={() => {alert("Modal can not be closed.")}}
        >
          <View style={{flex:1, flexDirection: 'column'}}>
            <View style={{flex:1, backgroundColor:'#0E476A',position:'absolute',
            top:0,left:0,right:0,height:Platform.OS == 'ios' ? 64 : 44}}>
              <View style={{top:Platform.OS == 'ios' ? 20 : 0,flexDirection:'row'}}>
                <View>
                  <ImageButton image={closeImage} style={{left:4,top:8,width:24,height:24}} imageStyle={{width:16,height:16,tintColor:'white'}} onPress={() => this.setState({optionalVisible: false})}>
                  </ImageButton>
                </View>
              </View>
            </View>

            <View style = {styles.container_addEvent}>
              {/*Optional Information modal*/}
              {this.renderOptionalInfo()}
            </View>
          </View>
        </Modal>

        <View style = {styles.container_settings}>
          <View style = {styles.navigationBarStyle}>
            <Text style = {styles.navigationBarTextStyle}>
              Create Event
            </Text>

            <ImageButton image={closeImage} style={{top:8}} onPress={() => this.props.close()}>
            </ImageButton>
          </View>

          {/*Renders text fields for event creation.*/}
          <KeyboardAwareScrollView>
            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
            </View>
            <Text style = {styles.text_header}>Basic Info</Text>

            {/*Event Name input.*/}
            <View style={styles.creator_EventView}>
              <View style={styles.creator_NameInput}>
                <TextInput
                  style = {styles.TextInput}
                  placeholder = 'Event Name'
                  ref='Name'
                  onChangeText={(Event_Name) => this.setState({Event_Name})}
                  placeholderTextColor={styleVariables.greyColor}
                  underlineColorAndroid='transparent'
                >
                </TextInput>
              </View>
            </View>

            {/*Event date selection.*/}
            <View style = {styles.creator_DateTimeView}>
              <View style={styles.creator_DateInput}>
                <DatePicker
                  style={{marginLeft: 10, marginRight: 5,
                    borderBottomColor: '#d3d3d3', borderBottomWidth: .5,
                  }}
                  date={this.state.Event_Date}
                  mode="date"
                  placeholder="Date"
                  format="MMMM DD, YYYY"
                  minDate={this.state.currentDate}
                  showIcon={false}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    placeholderText: {
                      color: styleVariables.greyColor,
                      fontFamily: styleVariables.systemRegularFont,
                      fontSize: 15,
                    },
                    dateInput: {
                      borderWidth: 0,
                      alignItems: 'flex-start',
                    }
                  }}
                  onDateChange={(Event_Date) => {this.setState({Event_Date: Event_Date})}}
               />
            </View>

            {/*Event time selection.*/}
            <View style={styles.creator_TimeInput}>
              <DatePicker
                style={{marginLeft: 5, borderBottomColor: '#d3d3d3', borderBottomWidth: .5,}}
                mode="time"
                placeholder="Time"
                date={this.state.Time}
                format="h:mm a"
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  placeholderText: {
                    color: styleVariables.greyColor,
                    fontFamily: styleVariables.systemRegularFont,
                    fontSize: 15,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignItems: 'flex-start',
                  }
                }}
                onDateChange={(Time) => {this.setState({Time: Time})}}
              />
            </View>
         </View>

         <View style={styles.creator_EventView}>
           <View style={styles.creator_NameInput}>
             <TextInput
                style = {styles.TextInput}
                placeholder = 'Address'
                ref='address'
                onChangeText={(Event_Address) => this.setState({Event_Address})}
                placeholderTextColor= {styleVariables.greyColor}
                underlineColorAndroid='transparent'
              >
              </TextInput>
            </View>
           </View>

           <View style={styles.creator_EventView}>
             <View style={styles.creator_NameInput}>

               <Button
                 onPress={() => this.setState({citiesVisible: true})}
                 style={styles.tagButton}
                 textStyle={citySelected ? styles.TagButtonSelected : styles.TagButtonText}>
                 {cityString}
               </Button>
             </View>
           </View>

           <View style={styles.creator_EventView}>
             <View style={styles.creator_NameInput}>
               <TextInput
                 style = {styles.TextInput}
                 placeholder = 'State'
                 ref='State'
                 onChangeText={(State) => this.setState({State})}
                 placeholderTextColor={styleVariables.greyColor}
                 underlineColorAndroid='transparent'
                >
                </TextInput>
             </View>
           </View>

           <View style={styles.creator_EventView}>
             <View style={styles.creator_NameInput}>

             <Button
               onPress={() => this.setState({TagsVisible: true})}
               style={styles.tagButton}
               textStyle={tagSelected ? styles.TagButtonSelected : styles.TagButtonText}>
               {tagString}
             </Button>
           </View>
         </View>

         <View style={[styles.creator_EventView, {height: Math.max(CARD_HEIGHT*.1,expandingView)}]}>
           <View style={[styles.creator_DynamicInput, {height: Math.max(CARD_HEIGHT*.075,this.state.textHeight)}]}>
             <TextInput
                style = {styles.TextInput}
                placeholder = 'Short Description (<250 characters)'
                multiline={true}
                ref='Short Description'
                onChangeText={(Short_Description) => this.setState({Short_Description})}
                placeholderTextColor={styleVariables.greyColor}
                underlineColorAndroid='transparent'
              >
              </TextInput>
            </View>
          </View>

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
          </View>

          <View style={styles.imageView}>
            <Button
              onPress={() => this.renderImage()}
              style={styles.imageButton}
              textStyle={styles.imageButtonText}>
              {changePhoto}
            </Button>
          </View>

          <View style={styles.eventImageView}>
            <Image source={{uri: this.state.responseURI }} style={styles.eventImage}/>
          </View>

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
          </View>

          <View style={{flex:1, alignItems: 'center'}}>
            <ImageButton image={arrow_right} style={styles.saveBasicInput}  onPress={() => this.checkComplete()}>
            </ImageButton>
          </View>
          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container_addEvent: {
      top: HEADER_HEIGHT,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      backgroundColor: 'white',
    },
    container_settings: {
      backgroundColor: 'white',
      flex:1,
      flexDirection: 'column',
    },
    creator_DateTimeView: {
      width: width,
      height: CARD_HEIGHT *0.1,
      flexDirection: 'row',

    },
    creator_EventView: {
      width: width,
      height: CARD_HEIGHT *0.1,

    },
    creator_NameInput: {
      marginLeft:20,
      marginRight: 20,
      height: CARD_HEIGHT*.075,
      justifyContent: 'center',
      borderBottomWidth:.5,
      borderBottomColor: '#d3d3d3',
    },
    creator_DateInput: {
      flex:1,
      marginLeft: 10,
      justifyContent: 'center',
      height: CARD_HEIGHT*.075,
    },
    creator_TimeInput: {
      flex: 1,
      justifyContent: 'center',
      height: CARD_HEIGHT*.075,
    },
    creator_DynamicInput: {
      marginLeft:10,
      marginRight: 10,
      height: CARD_HEIGHT*.075,
      justifyContent: 'center',
      backgroundColor:'white',
      borderBottomWidth:.5,
      borderBottomColor: '#d3d3d3'
    },
    eventImage: {
      flex: 1,
    },
    eventImageView: {
      height: CARD_HEIGHT*.25,
      width: width,
      paddingLeft: 10,
      paddingRight: 10,
    },
    locationList:{
      marginLeft:32,
      marginRight: 32,
      marginBottom: 16,
    },
    imageView: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageButton: {
      backgroundColor: 'white',
      borderRadius: 10,
      height: 35,
      marginLeft: 100,
      marginRight: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageButtonText: {
      color: 'black',
      fontSize: 12,
      textAlign: 'center',
      fontFamily: styleVariables.systemRegularFont,
      backgroundColor: 'transparent',
    },
    interestsHolder: {
      flex:1,
      marginLeft: 16,
      marginRight: 16,
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    interestCell:{
      margin:8,
      borderWidth:1,
      borderColor:'#848484',
      backgroundColor:'#FFFFFF',
      borderRadius:4,
    },
    navigationBarStyle: {
      height: HEADER_HEIGHT,
      width: width,
      paddingRight: 10,
      paddingLeft: 20,
      backgroundColor:'#0E476A',
      borderBottomWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    navigationBarTextStyle: {
      marginTop:20,
      flex:.6,
      color: 'white',
      //color:'#F97237',
      fontSize:20,
      fontFamily:'Futura-Medium',
      textAlign:'center',
      lineHeight: HEADER_HEIGHT-21,
    },
    selectedCell:{
      marginHorizontal: 7,
      marginVertical:8,
      borderWidth:2,
      borderColor:'#0B82CC',
      backgroundColor:'#FFFFFF',
      borderRadius:4,
    },
    interestCellText:{
      fontFamily: styleVariables.systemFont,
      fontSize: 16,
      color: '#848484',
    },
    selectedCellText:{
      fontFamily: styleVariables.systemBoldFont,
      fontSize: 15,
      color: '#0B82CC',
    },
    saveButton: {
      backgroundColor: '#F97237',
      borderRadius: 25,
      height: 50,
      marginLeft:20,
      marginRight: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveBasicInput: {
      backgroundColor: '#3CD758',
      height: 75,
      width: 75,
      borderRadius: height/2,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      fontFamily: styleVariables.systemBoldFont,
      backgroundColor: 'transparent',
    },
    tagButton: {
      //marginLeft:10,
      //marginRight: 10,
      height: CARD_HEIGHT*.075,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor:'white',
      borderBottomWidth:.5,
      borderBottomColor:'#d3d3d3',
    },
    TagButtonText: {
      color: styleVariables.greyColor,
      fontSize: 15,
      textAlign: 'center',
      fontFamily: styleVariables.systemRegularFont,
    },
    TagButtonSelected: {
      color: 'black',
      fontSize: 15,
      textAlign: 'center',
      fontFamily: styleVariables.systemRegularFont,
    },
    text_header: {
      fontFamily: styleVariables.systemBoldFont,
      color: '#F97237',
      fontSize: 18,
      textAlign: 'center',
    },
    TextInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: styleVariables.systemRegularFont,
        borderBottomWidth:.5,
        borderBottomColor:'#f2f2f2',
    },
    TextInputHolder:{
      backgroundColor:'#FFFFFF',
      height: 44,
      marginLeft:32,
      marginRight: 32,
      flexDirection: 'row',
      marginBottom: 16,
    },
    cityInput:{
      flex: 1,
      height: 44,
      backgroundColor: 'transparent',
      color:'black',
      fontFamily: styleVariables.systemFont,
      fontSize: 16,
      padding: 2,
      paddingLeft: 16,
      borderWidth: 1,
      borderColor: '#848484',
      borderRadius:4,
    },
    locationCellText:{
      fontFamily: styleVariables.systemFont,
      fontSize: 16,
      color: '#848484',
    },
    selectedLocationCellText:{
      fontFamily:styleVariables.systemBoldFont,
      fontSize:16,
      color:'#0B82CC',
    },
    locationCell:{
      marginHorizontal:8,
      marginVertical:4,
      paddingLeft:8,
      height:32,
      borderWidth:1,
      backgroundColor:'#FFFFFF',
      borderColor:'#848484',
      justifyContent:'center',
      borderRadius:4,
    },
    selectedLocationCell:{
      marginHorizontal:8,
      marginVertical:4,
      paddingLeft:8,
      height:32,
      borderWidth:2,
      backgroundColor:'#FFFFFF',
      borderColor:'#0B82CC',
      justifyContent:'center',
      borderRadius:4,
    },
    tagsCell: {
      margin: 8,
    }
})
