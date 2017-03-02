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
import Swiper from 'react-native-swiper';

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

  _submitEvent(userRef){
    var newEventKey = this.eventQueue.push().key;
    console.log("key!",newEventKey);

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
      "Ticket_URI": this.state.Ticket_URI,
      "Website" : this.state.Website,
    });
    this.props.close();
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

  render() {
    var saveButtonText = 'Create your event!';
    var changePhoto = 'Change Image';
    return(
    <Modal
      animationType={'slide'}
      transparent = {false}
      visible = {this.props.showing}
      onRequestClose={() => {alert("Modal can not be closed.")}}
    >
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
         textStyle={styles.buttonText}>
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

           <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
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

           <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
           </View>
           <View style={styles.creator_EventView}>
             <View style={styles.creator_NameInput}>
              <DatePicker
                style={{width: null}}
                date={this.state.Event_Date}
                mode="date"
                placeholder="select date"
                format="MMMM DD, YYYY"
                minDate={this.state.currentDate}
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                }}
                onDateChange={(Event_Date) => {this.setState({Event_Date: Event_Date}), console.log("here!"+Event_Date)}}
              />
             </View>
           </View>

             <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
             </View>
             <View style={styles.creator_EventView}>
               <View style={styles.creator_NameInput}>
               <DatePicker
                 style={{width: null}}
                 mode="time"
                 placeholder="select time"
                 date={this.state.Time}
                 format="h:mm a"
                 showIcon={false}
                 confirmBtnText="Confirm"
                 cancelBtnText="Cancel"
                 customStyles={{
                 }}
                 onDateChange={(Time) => {this.setState({Time: Time}),console.log("here!"+Time)}}
               />
               </View>
             </View>

             <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
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

               <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
               </View>
               <View style={styles.creator_EventView}>
                 <View style={styles.creator_NameInput}>
                   <TextInput
                     style = {styles.TextInput}
                     placeholder = 'Short Description'
                     ref='Short Description'
                     onChangeText={(Short_Description) => this.setState({Short_Description})}
                     placeholderTextColor='black'
                     underlineColorAndroid='transparent'
                   >
                   </TextInput>
                 </View>
               </View>

        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
        </View>
        <View style={styles.creator_EventView}>
          <View style={styles.creator_NameInput}>
             <TextInput
             style = {styles.TextInput}
             placeholder = 'Long Description'
             ref='long Description'
             onChangeText={(Long_Description) => this.setState({Long_Description})}
              placeholderTextColor='black'
              underlineColorAndroid='transparent'
              >
            </TextInput>
          </View>
        </View>

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
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

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
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

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
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

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
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
           onPress={() => this._submitEvent()}
           style={styles.saveButton}
           textStyle={styles.buttonText}>
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
      // borderWidth: 2,
      // borderColor: 'green',
      width: CARD_WIDTH,
      height: CARD_HEIGHT+TAB_HEIGHT,
      backgroundColor: '#f2f2f2',
    },
    creator_EventView: {
      width: width,
      height: CARD_HEIGHT *0.1,
    },
    creator_NameInput: {
      marginLeft:10,
      marginRight: 10,
      height: CARD_HEIGHT*.075,
      justifyContent: 'center',
      backgroundColor:'white',
      borderWidth:.5,
      borderColor:'#d3d3d3',
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
      backgroundColor: '#F97237',
      borderRadius: 10,
      height: 35,
      marginLeft: 100,
      marginRight: 100,
      alignItems: 'center',
      justifyContent: 'center',
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
    TextInput: {
        // borderWidth: 2,
        // borderColor: 'blue',
        width: width,
        height: 25,
        paddingLeft: 10,
        fontSize: 15,
        fontFamily: 'Futura-Medium',
    },
})
