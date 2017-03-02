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
import closeImage from '../images/delete.png'
import filterImage from '../images/filter.png'
import LinearGradient from 'react-native-linear-gradient';
var {width,height} = Dimensions.get('window');
import * as firebase from 'firebase';
import EventCard from './EventCard'
import EventPage from './EventPage'
import TagSelection from './TagSelection'
import Swiper from 'react-native-swiper';
import styleVariables from '../Utils/styleVariables'


const HEADER_HEIGHT = Platform.OS == 'ios' ? 64 : 44;
const TAB_HEIGHT = 50;
const CARD_WIDTH = width;
const CARD_HEIGHT = height - HEADER_HEIGHT - TAB_HEIGHT;

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

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

        resolve(url)
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
      County: '',
      Event_Date: '',
      Email_Contact: '',
      Event_Name: '',
      Event_Type: '',
      Image: '',
      Latitude: '',
      Event_Location: '',
      Longitude: '',
      Long_Description: '',
      Short_Description: '',
      Sort_Date: '',
      State: '',
      Status: '',
      Ticket_URI: '',
      Time: '',
      Website : '',
      eventID: '',
      allowUpload: false,
      responseURI: 'https://firebasestorage.googleapis.com/v0/b/projectnow-964ba.appspot.com/o/EventImages%2Fdefault.jpeg?alt=media&token=92477a25-408a-4edd-957e-4d6e3a469756',
      currentDate: new Date(),
      TagsVisible: false,
      tags: [],
      textHeight: CARD_HEIGHT*.075,
    }

    this.eventQueue = this.getRef().child('approvalQueue/');
    this.eventImageRef = this.getStorageRef().child('EventImages');

  }

  getRef() {
    return firebase.database().ref();
  }

  getStorageRef() {
    return firebase.storage().ref();
  }

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
  checkComplete(){
    var mergeDateAndTime = this.state.Event_Date+ " " + this.state.Time;
    var unixTime = new Date(mergeDateAndTime).getTime();
    if(
      this.state.Event_Address != '' &&
      this.state.City != '' &&
      this.state.Event_Name != '' &&
      this.state.Long_Description != '' &&
      this.state.Short_Description != '' &&
      this.state.State != ''
    )
    {
      return true;
    }
    else {
      return false;
    }
  }
  _submitEvent(userRef){
    var isComplete = this.checkComplete();
    if(isComplete)
    {
      var newEventKey = this.eventQueue.push().key;

      uploadImage(this.state.responseURI, newEventKey+'.jpg');
      var imageLocation = this.eventImageRef + '/'+newEventKey + '.jpg';
      var mergeDateAndTime = this.state.Event_Date+ " " + this.state.Time;
      var unixTime = new Date(mergeDateAndTime).getTime();
      firebase.database().ref('approvalQueue/'+newEventKey).update({
        "Address" : this.state.Event_Address,
        "City": this.state.City,
        "County": this.state.County,
        "Date": unixTime,
        "Email_Contact": this.state.Email_Contact,
        "Event_Name" : this.state.Event_Name,
        "Event_Type": this.state.Event_Type,
        "Image": imageLocation,
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
      });
      this.setState({
        responseURI: 'https://firebasestorage.googleapis.com/v0/b/projectnow-964ba.appspot.com/o/EventImages%2Fdefault.jpeg?alt=media&token=92477a25-408a-4edd-957e-4d6e3a469756'
      })
      this.props.close();
    }
    else
    {
      Alert.alert('Please fill out all of the information.');
    }
  }

  setEventVisible(visible){
    this.setState({
      eventModal: visible,
    })
  }



  onLeftPress(){
    this.setEventVisible(true);
  }

  onExitPress(){
    this.setEventVisible(false);
  }

  buttonPressed(sentTag) {
     console.log("tag!"+sentTag);
     console.log(this.state.tags);
    // console.log(this.state.interests.indexOf(sentInterest));
    if(this.state.tags.indexOf(sentTag) == -1)
    {
      var tags = this.state.tags;
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

  renderTags(){
    var tags = ['Nightlife','Entertainment','Music','Food_Tasting','Family','Theater','Dining','Dance','Art','Fundraiser','Comedy','Festival','Sports','Class','Lecture','Fitness','Meetup','Workshop',];
    var tagsView = [];

    for(var i = 0; i < tags.length; i++)
    {
      var tag = tags[i];
      var backgroundColor = this.state.tags.indexOf(tag) == -1 ? styleVariables.greyColor: '#0B82CC';
      tagsView.push(
        <Button ref={tag} key={i} style={[styles.tagsCell, {backgroundColor:backgroundColor}]} textStyle={styles.interestsCellText} onPress={this.buttonPressed.bind(this, tag)}>{tag}</Button>
      );
    }

    return tagsView;
  }

  render() {
    var saveButtonText = 'Submit';
    var changePhoto = 'Click here to add image';
    var tagString = '';
    var inputView = CARD_HEIGHT*.1;
    var textView = CARD_HEIGHT*.075;
    var dynamicTextHeight = this.state.textHeight;
    var expandingView = dynamicTextHeight + (inputView - textView);
    console.log("outer!"+ inputView);
    console.log("inner!"+ textView);
    console.log("state!"+ dynamicTextHeight);
    console.log("see!"+ expandingView);
    if(this.state.tags.length === 0)
    {
      tagString = 'Tags';
    }
    else {
      tagString = this.state.tags.join(', ');
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
      visible={this.state.TagsVisible}
      onRequestClose={() => {alert("Modal can not be closed.")}}
    >
    <View style={{flex:1, flexDirection: 'column'}}>
     <View style={{flex:1, backgroundColor:'#0E476A',position:'absolute',top:0,left:0,right:0,height:Platform.OS == 'ios' ? 64 : 44}}>
       <View style={{top:Platform.OS == 'ios' ? 20 : 0,flexDirection:'row'}}>
         <View>
         <ImageButton image={closeImage} style={{top:2,width:32,height:32}} imageStyle={{width:12,height:12,tintColor:'white'}} onPress={() => this.setState({TagsVisible: false})}>
         </ImageButton>
         </View>
       </View>
     </View>

       <View style = {styles.container_addEvent}>
         <View style={styles.interestsHolder}>
           {this.renderTags()}
         </View>
      </View>
     </View>
    </Modal>

      <View style={{flex:1, flexDirection: 'column'}}>
       <View style={{flex:1, backgroundColor:'#0E476A',position:'absolute',top:0,left:0,right:0,height:Platform.OS == 'ios' ? 64 : 44}}>
         <View style={{top:Platform.OS == 'ios' ? 20 : 0,flexDirection:'row'}}>
           <View>
           <ImageButton image={closeImage} style={{top:2,width:32,height:32}} imageStyle={{width:12,height:12,tintColor:'white'}} onPress={() => this.props.close()}>
           </ImageButton>
           </View>
         </View>
       </View>
       <View style = {styles.container_addEvent}>
              <KeyboardAwareScrollView>
       <ScrollView style={{flex:1}}>

       <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
         </View>
       <View style={styles.eventImageView}>
         <Image source={{uri: this.state.responseURI }} style={styles.eventImage}/>

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
         <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
         </View>
         <View style={styles.creator_EventView}>
           <View style={styles.creator_NameInput}>
             <TextInput
               style = {styles.TextInput}
               placeholder = 'Event Name'
               ref='Name'
               onChangeText={(Event_Name) => this.setState({Event_Name})}
               placeholderTextColor='black'
               underlineColorAndroid='transparent'
             >
             </TextInput>
           </View>
         </View>

           <View style={styles.creator_EventView}>
             <View style={styles.creator_NameInput}>
               <TextInput
                 style = {styles.TextInput}
                 placeholder = 'Address'
                 ref='address'
                 onChangeText={(Event_Address) => this.setState({Event_Address})}
                 placeholderTextColor='black'
                 underlineColorAndroid='transparent'
               >
               </TextInput>
             </View>
            </View>

            <View style = {styles.creator_DateTimeView}>
             <View style={styles.creator_DateInput}>
              <DatePicker
                style={{marginLeft: 10, marginRight: 5, borderBottomColor: '#d3d3d3', borderBottomWidth: .5,
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
                    color: 'black',
                    fontFamily: 'Futura-Medium',
                    fontSize: 15,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignItems: 'flex-start',
                  }
                }}
                onDateChange={(Event_Date) => {this.setState({Event_Date: Event_Date}), console.log("here!"+Event_Date)}}
              />
             </View>

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
                     color: 'black',
                     fontFamily: 'Futura-Medium',
                     fontSize: 15,
                   },
                   dateInput: {
                     borderWidth: 0,
                     alignItems: 'flex-start',
                   }
                 }}
                 onDateChange={(Time) => {this.setState({Time: Time}),console.log("here!"+Time)}}
               />
               </View>
             </View>

             <View style={styles.creator_EventView}>
             <Button
               onPress={() => this.setState({TagsVisible: true})}
               style={styles.tagButton}
               textStyle={styles.TagButtonText}>
               {tagString}
             </Button>
             </View>

             <View style={styles.creator_EventView}>
               <View style={styles.creator_NameInput}>
                 <TextInput
                   style = {styles.TextInput}
                   placeholder = 'Venue'
                   ref='Location'
                   onChangeText={(Event_Location) => this.setState({Event_Location})}
                   placeholderTextColor='black'
                   underlineColorAndroid='transparent'
                 >
                 </TextInput>
               </View>
             </View>

             <View style={[styles.creator_EventView, {height: Math.max(CARD_HEIGHT*.1,expandingView)}]}>
               <View style={[styles.creator_DynamicInput, {height: Math.max(CARD_HEIGHT*.075,this.state.textHeight)}]}>
                   <TextInput
                     style = {styles.TextInput}
                     placeholder = 'Short Description'
                     multiline={true}
                     ref='Short Description'
                     onChangeText={(Short_Description) => this.setState({Short_Description})}
                     placeholderTextColor='black'
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
             placeholderTextColor='black'
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
              placeholderTextColor='black'
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
                placeholderTextColor='black'
                underlineColorAndroid='transparent'
              >
              </TextInput>
            </View>
          </View>

          <View style={styles.creator_EventView}>
            <View style={styles.creator_NameInput}>
              <TextInput
                style = {styles.TextInput}
                placeholder = 'City'
                ref='City'
                onChangeText={(City) => this.setState({City})}
                placeholderTextColor='black'
                underlineColorAndroid='transparent'
              >
              </TextInput>
            </View>
          </View>

          <View style={styles.creator_EventView}>
            <View style={styles.creator_NameInput}>
              <TextInput
                style = {styles.TextInput}
                placeholder = 'State'
                ref='State'
                onChangeText={(State) => this.setState({State})}
                placeholderTextColor='black'
                underlineColorAndroid='transparent'
              >
              </TextInput>
            </View>
          </View>
         <Button
           onPress={() => Alert.alert('Almost There...', 'This feature will require a small, one-time fee or a monthly subscription, but it is available to testers for free.',            [
              {text: 'Create Event', onPress: () => this._submitEvent()},
            ])}
           style={styles.saveButton}
           textStyle={styles.saveButtonText}>
           {saveButtonText}
         </Button>
         <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
         </View>
                  </ScrollView>
         </KeyboardAwareScrollView>

       </View>
     </View>
    </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container_addEvent: {
      top: HEADER_HEIGHT,
      width: CARD_WIDTH,
      height: CARD_HEIGHT+TAB_HEIGHT,
      backgroundColor: 'white',
    },
    creator_DateTimeView: {
      width: width,
      height: CARD_HEIGHT *0.1,
      flexDirection: 'row',
      // borderWidth:2,
      // borderColor:'red',
    },
    creator_EventView: {
      width: width,
      height: CARD_HEIGHT *0.1,
      // borderWidth:2,
      // borderColor:'red',
    },
    creator_NameInput: {
      marginLeft:10,
      marginRight: 5,
      height: CARD_HEIGHT*.075,
      justifyContent: 'center',
      borderBottomWidth:.5,
      borderBottomColor: '#d3d3d3',
    },
    creator_DateInput: {
      flex:1,
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
      fontFamily: 'Futura-Medium',
      backgroundColor: 'transparent',
    },
    interestsCell: {
      margin: 8,
    },
    interestsHolder: {
      flex:1,
      marginLeft: 16,
      marginRight: 16,
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    interestsCellText: {
      fontFamily: styleVariables.systemBoldFont,
      fontSize: 14,
      color: 'white',
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
    saveButtonText: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Futura-Medium',
      backgroundColor: 'transparent',
    },
    tagButton: {
      marginLeft:10,
      marginRight: 10,
      height: CARD_HEIGHT*.075,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor:'white',
      borderBottomWidth:.5,
      borderBottomColor:'#d3d3d3',
    },
    TagButtonText: {
      color: 'black',
      fontSize: 15,
      textAlign: 'center',
      fontFamily: 'Futura-Medium',
    },
    TextInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Futura-Medium',
        borderBottomWidth:.5,
        borderBottomColor:'#f2f2f2',
    },
    tagsCell: {
      margin: 8,
    }
})
