///////////////////////
/*

Author: ProjectNow Team
Class: Profile
Description: Page containing all profile information for a user.
This page opens up different modals for editing settings according to
what the user clicks. 
Note:

*/
///////////////////////
import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import {
  ActivityIndicator,
  AppRegistry,
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
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Picker,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ModalPicker from 'react-native-modal-picker'
import Button from './Button'
import ImageButton from './ImageButton'
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Actions } from 'react-native-router-flux';
import settingsImage from '../images/settings.png'
import closeImage from '../images/delete.png'
import close from '../imgs/close.png'
import checkImage from '../imgs/check.png'
import styleVariables from '../Utils/styleVariables'
import LinearGradient from 'react-native-linear-gradient'
import Moment from 'moment'
import Swiper from 'react-native-swiper';
import DatePicker from 'react-native-datepicker'
import profileIcon from '../imgs/profile.png'
import PostcardView from './PostcardView'

var eventActions = require("../actions/eventActions.js");
var userActions = require("../actions/userActions.js");
var {height, width} = Dimensions.get('window');

const HEADER_HEIGHT = styleVariables.titleBarHeight;
const TAB_HEIGHT = 50;
const CARD_WIDTH = width;
const CARD_HEIGHT = height - HEADER_HEIGHT - TAB_HEIGHT;
const database = firebase.database();
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

// Uploads selected image to firebase storage
// Image is saved as a Blob
const uploadImage = (uri, imageName, mime = 'image/jpg') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null
      const imageRef = firebase.storage().ref('UserImages').child(imageName)

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

export default class Profile extends Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      First_Name: this.props.user.First_Name,
      Last_Name: this.props.user.Last_Name,
      Age: this.props.user.Age ? this.props.user.Age : '',
      Gender: this.props.user.Gender,
      responseURI: this.props.user.Image,
      Phone: this.props.user.Phone ? this.props.user.Phone : '',
      imageLocation: this.props.user.Image,
      Image: this.props.user.Image,
      Email: this.props.user.Email,
      city: this.props.city,
      dob: this.props.user.DOB ? this.props.user.DOB : '',
      locationSearch: '',
      modalVisible: false,
      settingsModal: false,
      categories: [],
      dataSource: ds,
      interests: this.props.interests,
      hasPostCardSelected: false,
      selectedPostCardInfo: {},
      currentIndex: 0,
      postcardSettingsOpen: false,
      postcards: this.props.postcards,
      TagsVisible: false,
      tags: [],
      userImageLocation: this.props.user.Image,
    }
  //  this.currentUserID = firebase.auth().currentUser.uid;
    this.userRef = this.getRef().child('users/' + firebase.auth().currentUser.uid);
    this.userImageRef = this.getStorageRef().child('UserImages');
    this.categoriesRef = this.getRef().child('categories/'+firebase.auth().currentUser.uid);
    //this.props.loadUserData();
  } /*end Constructor*/

  componentWillMount() {
    Actions.refresh({
             //renderRightButton: () => this.renderRightButton(),
    })
  }

  componentDidMount() {
    //this.renderCategories();
  }

  /* //Invoked before a mounted component recieves props */
  componentWillReceiveProps(nextProps){

    //tests for updated prop values to ensure match
    if(nextProps.interests != this.props.interests)
    {
      this.setState({interests:nextProps.interests});
    }
    if(nextProps.postcards != this.props.postcards)
    {
      this.setState({postcards:nextProps.postcards});
    }
    if(nextProps.city != this.props.location)
    {
      this.setState({
        city: nextProps.city,
      })
    }
  }

  /* Log user out of Account */
  logout(){
    this.settingsVisible(false); //hides settings Modal
    Actions.tab1();
    this.props.logoutUser(); // calls logoutUser function found in userActions.js
  }

  /* Reference to Firebase DB */
  getRef() {
    return firebase.database().ref();
  }

  /* Reference to Firebase storage DB
      Storage includes user & event images */
  getStorageRef() {
    return firebase.storage().ref();
  }

  /* Hide or display Basic Info modal*/
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  /* Resets values in settings modal if modifications are not saved */
  resetSettingsValues() {
    this.setState({
      settingsModal: false,
      Email: this.props.user.Email,
      city: this.props.city,
    });
  }

  /* Resets values in basic info modal if modifications are not saved */
  resetInfoValues() {
    this.setState({
      First_Name: this.props.user.First_Name,
      Last_Name: this.props.user.Last_Name,
      Phone: this.props.user.Phone,
      Age: this.props.user.Age ? this.props.user.Age : '',
      Gender: this.props.user.Gender,
      modalVisible: false,
    });
  }

  /* Hide or display settings modal*/
  settingsVisible(visible) {
    this.setState({settingsModal: visible});
  }

  /* Closes basic info modal*/
  closeModal(){
    this.setState({modalVisible: false});
  }

  renderSaveButton(){
    return (
      <ImageButton image={checkImage} style={{width:32,height:32}}
        imageStyle={{width:18,height:18,tintColor:'white'}}
        onPress={this.closeModal.bind(this)}>
      </ImageButton>
    );
  }

  renderLeftButton(){
    return(
      <ImageButton image={closeImage} style={{top:8,width:32,height:32}}
        imageStyle={{width:18,height:18,tintColor:'white'}}
        onPress={this._submitChanges.bind(this)}>
      </ImageButton>
    )
  }

  /* Renders Image selected from User's device*/
  renderImage(){
    ImagePicker.showImagePicker((response) => {
      if(response.didCancel)
      {
        console.log('User cancelled image picker');
      }
      else if (response.error)
      {
        console.log('ImagePicker Error: ', response.error);
      }
      else
      {
        //new image will immediately render as new profile picture
        this.setState({userImageLocation: response.uri});

        //retrieved image is uploaded into Firebase storage DB
        uploadImage(response.uri, firebase.auth().currentUser.uid + '.jpg')
        .then(url => this.saveImage(url));
      }
    })
  }

  /* Image location in Firebase is saved under User table*/
  saveImage(url){
    //updates to new location of User Image
    this.userRef.update({ "Image": typeof(url) != "undefined" ? url : "", })
    this.setState({imageLocation: url});
  }

  /* Saves modification to basic information*/
  _submitChanges(){
    var user = this.setupUser();

    //Basic info values are updated in Firebase user table
    this.userRef.update({
      "First_Name": typeof(this.state.First_Name) != "undefined" ? this.state.First_Name : "",
      "Last_Name": typeof(this.state.Last_Name) != "undefined" ? this.state.Last_Name : "",
      "DOB": typeof(this.state.dob) != "undefined" ? this.state.dob : "",
      "Gender": typeof(this.state.Gender) != "undefined" ? this.state.Gender : "",
      "Phone": typeof(this.state.Phone) != "undefined" ? this.state.Phone : "",
    })

    //user props are updated to reflect new modifications
    this.props.saveUserData(user);
    this.setModalVisible(false);
  }

  /* sets user table values to updated state variables */
  setupUser(){
    return{
      Admin: this.props.user.Admin,
      DOB: this.state.dob,
      Email: this.props.user.Email,
      First_Name: this.state.First_Name,
      Gender: this.state.Gender,
      Image: this.props.user.Image,
      Last_Login: this.props.user.Last_Login,
      Last_Name: this.state.Last_Name,
      Phone: this.state.Phone,
      Registered: this.props.user.Registered,
    }
  }

  /* modifications in settings modal are saved to user table */
  _saveSettings(){
    var test = this.state.Email;
    if(!test.includes('@'))
    {
      Alert.alert('Please enter valid email address.');
    }
    else
    {
      this.userRef.update({
        "Email": typeof(this.state.Email) != "undefined" ? this.state.Email : "",
        "City": typeof(this.state.city) != "undefined" ? this.state.city : "",
      })
      this.props.saveLocation(this.state.city);
      this.settingsVisible(false);
    }
  }

  /* Selected interests are saved */
  saveInterests(){
    this.props.saveInterests(this.state.interests);
    this.setState({TagsVisible: false});
  }

  /* Render Interests to be displayed in profile page */
  renderCategories(){
    var index = 0;
    var categoryQuery = database.ref("categories/"+this.currentUserID);
    var categories = [];
    categoryQuery.once('value', snapshot => {
      snapshot.forEach((childSnapshot) => {
        var key = childSnapshot.key;
        categories.push(key);
      })
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(categories),
        categories: categories,
      });
    });
  } /*end renderCategories*/

  /*
  This function renders the Settings modal where users can update their location
  */
  renderSettingsModal()
  {
    return(
      <Modal
        animationType={'slide'}
        transparent={false}
        visible = {this.state.settingsModal}
        onRequestClose={() => this.resetSettingsValues()}
      >
        <View style = {styles.container_settings}>
          <View style = {styles.navigationBarStyle}>
            <Text style = {styles.navigationBarTextStyle}>
              Edit Settings
            </Text>
            <ImageButton image={close} style={{top:8}}
              onPress={() => this.resetSettingsValues()}>
            </ImageButton>
          </View>


          <KeyboardAwareScrollView scrollEnabled = {true} style={{backgroundColor: 'white'}}>
            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
            </View>

            <Text style = {styles.text_header}>Settings</Text>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
            </View>
            <View style={styles.settings_InputView}>
              <Text style={styles.settings_Header}>Email</Text>
              <View style = {styles.settings_InfoField}>
                <TextInput
                  style = {styles.FieldInput}
                  placeholder={this.props.user.Email}
                  ref='Email'
                  onChangeText={(Email) => this.setState({Email})}
                  placeholderTextColor='black'
                  underlineColorAndroid='transparent'
                  keyboardType='email-address'>
                </TextInput>
              </View>
            </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
            </View>

            <View>
              <View style={{marginLeft: 20}}>
                <Text style={styles.settings_Header}>Location</Text>
              </View>
              {this.renderLocation()}
            </View>

            <View style= {{flex:1, justifyContent: 'flex-end', alignItems: 'center',
              paddingBottom: 20}}>

              <ImageButton image={checkImage} style={styles.saveInput}
                onPress={() => this._saveSettings()}>
              </ImageButton>
            </View>

            <Button style={{marginHorizontal:32,marginVertical:32,height:44,
              backgroundColor:'#F97237',borderWidth: 1,borderColor: '#EE6436',
              borderRadius:22}} textStyle={{textAlign:'center',
              fontFamily:styleVariables.systemBoldFont,fontSize:16,color:'white'}}
              onPress={() => this.logout()}>Logout
            </Button>

            </KeyboardAwareScrollView>

         </View>
     </Modal>
    )
  } /*end renderSettingsModal()*/

  /*
  This function renders the dynamic list of available locations. User can select
  desired location to filter events.
  */
  renderLocation(){
    var possibleLocations = this.getPossibleLocations();
    var ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});

    return(
      <View style={{flex:1}}>
        <View style={styles.TextInputHolder}>
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
            renderRow= {this.renderLocationRow.bind(this)}
            enableEmptySections={true}>
          </ListView>
        </View>

      </View>
    )
  } /*end renderLocation*/

  /*
  This function retrieves the possible locations that exist for events.
  */
  getPossibleLocations() {
    //enables a one-time update for dynamic changes in location list.
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
        if(item.indexOf(this.state.locationSearch) != -1) {
          filteredList.push(item);
        }
      }
    }

    return filteredList;
  } /*end getPossibleLocations*/

  /*
  This function renders the Basic Info modal where users can update their basic information
  */
  renderModal()
  {
    var ageString = this.props.user.Age;
     var genderString = this.props.user.Gender ? this.props.user.Gender: 'Select Gender';
     var DOBString = this.props.user.DOB ? this.props.user.DOB : 'Date of Birth';
     var phoneString = this.props.user.Phone ? this.props.user.Phone.toString() : '';
    const genderOptions = [
      {key: 0, label: 'Male'},
      {key: 1, label: 'Female'},
      {key: 2, label: 'Not Specified'},
    ]

    const ageOptions = [];
    var ageObject = {};
    for(var i = 0; i < 121; i++)
    {
      ageObject = {
        key: i,
        label: i,
      };
      ageOptions.push(ageObject);
    }


    return(
      <Modal
        animationType={'slide'}
        transparent={false}
        visible = {this.state.modalVisible}
        onRequestClose={() => this.resetInfoValues()}
      >
        <View style = {styles.container_settings}>
          <View style = {styles.navigationBarStyle}>
            <Text style = {styles.navigationBarTextStyle}>
              Edit Profile
            </Text>
            <ImageButton image={close} style={{top:8}} onPress={() => this.resetInfoValues()}>
            </ImageButton>
          </View>


          <KeyboardAwareScrollView scrollEnabled = {true} style={{backgroundColor: 'white'}}>

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
            </View>
          <Text style = {styles.text_header}>Basic Info</Text>

            <View style={styles.settings_InputView}>
            <Text style={styles.settings_Header}>First name</Text>

              <View style = {styles.settings_InfoField}>
              <TextInput
                style = {styles.FieldInput}
                placeholder={this.state.First_Name}
                ref='First_Name'
                onChangeText={(First_Name) => this.setState({First_Name})}
                placeholderTextColor='black'
                underlineColorAndroid='transparent'>
              </TextInput>
              </View>
            </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
              </View>

            <View style={styles.settings_InputView}>
            <Text style={styles.settings_Header}>Last name</Text>
              <View style = {styles.settings_InfoField}>
              <TextInput
                style = {styles.FieldInput}
                placeholder={this.state.Last_Name}
                ref='Last_Name'
                onChangeText={(Last_Name) => this.setState({Last_Name})}
                placeholderTextColor='black'
                underlineColorAndroid='transparent'>
              </TextInput>
              </View>
            </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
              </View>

            <View style={styles.settings_InputView}>
            <Text style={styles.settings_Header}>Phone number</Text>
              <View style = {styles.settings_InfoField}>
              <TextInput
                style = {styles.FieldInput}
                ref='Phone'
                placeholder={phoneString}
                placeholderTextColor='black'
                onChangeText={(Phone) => this.setState({Phone})}
                underlineColorAndroid='transparent'
                keyboardType='numeric'
                maxLength={10}>
              </TextInput>
              </View>
            </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
              </View>
          <View style={styles.settings_InputView}>
          <Text style={styles.settings_Header}>DOB</Text>
            <View style = {styles.settings_InfoField}>
          <DatePicker
            ref='DOB'
            style={styles.datePicker}
            date={this.state.dob}
            mode="date"
            placeholder= {DOBString}
            format="MMMM DD, YYYY"
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              placeholderText: {
                color:'black',
                fontFamily: styleVariables.systemRegularFont,
                fontSize: 14,
              },
              dateText:{
                color: 'black',
                fontFamily: styleVariables.systemRegularFont,
                fontSize: 14,
              },
              dateInput: {
                borderWidth: 0,
                alignItems: 'flex-start',
              }
            }}
            onDateChange={(dob) => {this.setState({dob: dob})}}
          />
          </View>
          </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02,}}>
            </View>

            <View style={styles.settings_InputView}>
            <Text style={styles.settings_Header}>Gender</Text>
              <View style = {styles.settings_InfoField}>
              <ModalPicker
                selectStyle={{borderRadius:0, borderWidth: 0}}
                selectTextStyle={{fontSize: 14, fontFamily: styleVariables.systemRegularFont}}
                style ={{flex: 1, borderRadius:0}}
                data={genderOptions}
                initValue= {genderString}
                onChange={(Gender) => this.setState({Gender: Gender.label})}>

                <Text
                  style={{padding:10, height:CARD_HEIGHT*.075,fontSize: 14, fontFamily: styleVariables.systemRegularFont, color: 'black'}}
                >
                  {this.state.Gender}
                  </Text>
              </ModalPicker>
              </View>
            </View>
            </KeyboardAwareScrollView>

            <View style= {{flex:1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20}}>
            <ImageButton image={checkImage} style={styles.saveInput}  onPress={() => this._submitChanges()}>
            </ImageButton>
            </View>

         </View>
     </Modal>
    )
  } /*end renderModal*/


  renderRow(rowData){
    <View style={styles.item}>
      <View style={{flex:.75}}>
        <Text style={{color:'#F97237'}}>{rowData.Category_Name}</Text>
      </View>
    </View>
  } /*end renderRow*/

  /*
  This function renders the style and layout of each individual location found in
  the listview. These locations are rendered in the Settings modal.

  */
  renderLocationRow(rowData){
    var isSelected = this.state.city == rowData ? true : false;
    return(
      <TouchableHighlight underlayColor={'#FFFFFF'} style={isSelected ? styles.selectedLocationCell : styles.locationCell} onPress = {this.pressRow.bind(this,rowData)}>
        <Text style={isSelected ? styles.selectedLocationCellText : styles.locationCellText}>{rowData}</Text>
      </TouchableHighlight>
    )
  } /*end renderLocationRow*/

  /*
  This function updates the state variable 'city' to reflect the selected city
  */
  pressRow(rowData){
    this.setState({city:rowData});
  }

  /*
  This function renders the Tags modal, which enables the user to select interests.
  */
  setTagsVisible(visible) {
    this.setState({
      TagsVisible: visible,
    });
  }

  /*
  This function is called if a User selects an interest in the Tags modal.
  */
  buttonPressed(sentInterest){
    if(this.state.interests.indexOf(sentInterest) == -1)
    {
      var interests = this.state.interests;
      interests.push(sentInterest);
      this.setState({interests:interests});
    }
    else
    {
      var interests = this.state.interests;
      var index = interests.indexOf(sentInterest);
      interests.splice(index,1);
      this.setState({interests:interests});
    }
  } /*end buttonPressed*/


  /*
  This function renders the dynamic list of interests available to the user.
  */
  renderTags(){
    // Call to database to populate the possible tags
    interests = eventActions.renderPossibleInterests();

    var interestsViews = [];
    for (i in interests)
    {
      var interest = i;
      var isSelected = this.state.interests.indexOf(interest) == -1 ? false : true;
      // var backgroundColor = this.state.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
      interestsViews.push(
          <Button ref={interest} underlayColor={'#FFFFFF'} key={i} style={isSelected ? styles.selectedCell : styles.interestCell} textStyle={isSelected ? styles.selectedCellText : styles.interestCellText} onPress={this.buttonPressed.bind(this,interest)}>{interest.toUpperCase()}</Button>
      );
    }

    return interestsViews;
  } /*end renderTags*/

  /*
  This function retrieves the list of interests selected by the user. The interests
  will render in the profile component.
  */
  renderInterests(){
    interests = this.state.interests;

    if(interests.length > 0)
    {
      var interestsViews = [];
      for (var i=0;i<interests.length;i++)
      {
        var interest = interests[i];
        var isSelected = this.state.interests.indexOf(interest) == -1 ? false : true;
        // var backgroundColor = this.state.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
        interestsViews.push(
            <Button ref={interest} underlayColor={'#FFFFFF'} key={i} style={isSelected ? styles.selectedCell : styles.interestCell} textStyle={isSelected ? styles.selectedCellText : styles.interestCellText}>{interest.toUpperCase()}</Button>
        );
      }

      return interestsViews;
    }
    else{
      return <Text style={{flex:1,marginVertical:8,fontFamily:styleVariables.systemFont,textAlign:'center'}}>No interests selected</Text>
    }
  } /*end renderInterests*/

  /*
  This function sets the current postcards information.
  */
  openPostCard(sentPostCardInfo){
    this.setState({hasPostCardSelected:true,selectedPostCardInfo:sentPostCardInfo});
  }  /*end openPostCard*/

  /*
  This function closes the postcard
  */
  closePostCard(){
    this.setState({hasPostCardSelected:false,currentIndex:0},
      function(){
        this.props.savePostcards(this.state.postcards);
        this.setState({selectedPostCardInfo:{}})
    })
  } /*end closePostCard*/

  /*
  This function renders the array of postcards in the profile component
  */
  renderPostcards(){
    var maxViews = 5;
    var postCardViews = [];
    var postCards = this.state.postcards || [];

    if(postCards.length > 0)
    {
      for(var i=0;i<postCards.length;i++)
      {
        var postCard = postCards[i];
        var postCardColor = postCard.color;//'#0B82CC' '#0E476A' '#F06D37'
        // var backgroundColor = this.props.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
        //<Button ref={postCard} key={i} style={[styles.postCard,{backgroundColor:'#0B82CC'}]} textStyle={styles.interestsCellText}>{postCard.name}</Button>
        // postCardViews.push(
        //     <FaderView key={i}/>
        // );
        postCardViews.push(
          <TouchableHighlight key={i} style={{width:width,height:90,justifyContent:'center',marginBottom:8}} onPress={this.openPostCard.bind(this,postCard)}>
          <View style={{flex:1}}>
            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0}}>
              <Image style={{flex:1}} source={postCard.cardImage} resizeMode={'cover'}/>
            </View>
            <LinearGradient
              start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
              locations={[0,1]}
              colors={[postCardColor, '#FFFFFF00']}
              style={{position:'absolute',left:0,right:0,top:0,bottom:0}}
            />
            <Text style={{position:'absolute',left:8,top:8,right:8,backgroundColor:'transparent',fontFamily:styleVariables.systemBoldFont,fontSize:24,color:'white'}}>{postCard.name}</Text>
            <View style={{position:'absolute',left:-4,bottom:8,paddingLeft:12,paddingRight:8,borderRadius:4,backgroundColor:'#FFFFFF60'}}>
              <Text style={{fontFamily:styleVariables.systemBoldFont,fontSize:14,color:postCardColor}}>{Moment(postCard.date).format('MMM DD, YYYY')}</Text>
            </View>
          </View>
          </TouchableHighlight>
        ) //end push to postCardViews array
      } //end for loop

      return (
        <View>
          {postCardViews}
        </View>
      )
    }
    else
    {
      return <Text style={{flex:1,marginVertical:8,fontFamily:styleVariables.systemFont,textAlign:'center'}}>No postcards selected</Text>
    }
  }  /*end renderPostcards*/

  /*
  This function renders the postcard modal one selected.
  */
  renderPostCardModal(){
    return (
      <Modal
        animationType={'fade'}
        transparent={false}
        visible = {true}
        onLayout={() => {console.warn(10);}}
      >
        <PostcardView postcardInfo={this.state.selectedPostCardInfo} closePostCard={() => this.closePostCard()}/>
      </Modal>
    )
  }  /*end PostCardModal*/

  /*
  This function renders the base Profile component
  */
  renderProfile() {
    if (this.state.Phone && this.state.Phone.length > 9)
    {
      let first = this.state.Phone.substring(0,3);
      let second = this.state.Phone.substring(3,6);
      let third = this.state.Phone.substring(6,11);
      var phoneString = first + '-' + second + '-' + third;
    }
    else if (this.state.Phone)
    {
      var phoneString = this.state.Phone
    }
    else
    {
      var phoneString = ''
    }

  return(
    <View style = {{flex: 1,backgroundColor:'#E2E2E2'}}>
      <ScrollView scrollEnabled={true} style={styles.scrolling_profile}>
        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.05,}}/>
        <View style={styles.container_image}>
          <Image source={{uri: this.state.userImageLocation }} style={styles.userImage}/>
          <View style={styles.changePhoto}>
            <TouchableHighlight
              onPress={()=> this.renderImage()}
              underlayColor={'white'}>
                <Text style={styles.settings_imageText}>Change Photo</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.025}}/>
        <View style={styles.container_info}>
          <View style={{flexDirection: 'row', paddingLeft: 45, paddingRight: 35}}>
            <View style={{flex: 1}}>
              <Text style={styles.text_header}> Basic Info </Text>
            </View>
          <View>
            <TouchableHighlight onPress={() => {this.setModalVisible(true)}} underlayColor={'transparent'}>
              <Text style={{color:'#0B82CC',textAlign:'center'}}>Edit</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.025}}/>

        <View style={styles.infoBox}>
          <View style={styles.innerBox}>
            <Text style = {styles.infoText}>{this.state.First_Name}</Text>
          </View>
        </View>

        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>

        <View style={styles.infoBox}>
          <View style={styles.innerBox}>
            <Text style = {styles.infoText}>{this.state.Last_Name}</Text>
          </View>
        </View>

        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>

        <View style={styles.infoBox}>
          <View style={styles.innerBox}>
            <Text style = {styles.infoText}>{phoneString}</Text>
          </View>
        </View>

        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>

        <View style={styles.infoBox}>
          <View style={styles.innerBox}>
            <Text style = {styles.infoText}>{this.state.dob}</Text>
          </View>
        </View>

        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>

        <View style={styles.infoBox}>
          <View style={styles.innerBox}>
            <Text style = {styles.infoText}>{this.state.Gender}</Text>
          </View>
        </View>

        <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>

        <View style={styles.container_info}>
          <View style={{flexDirection: 'row', paddingLeft: 45, paddingRight: 35}}>
            <View style={{flex: 1}}>
              <Text style={styles.text_header}> Settings </Text>
            </View>
            <View>
              <TouchableHighlight onPress={() => {this.settingsVisible(true)}}
                underlayColor={'transparent'}>
                  <Text style={{color:'#0B82CC',textAlign:'center'}}>Edit</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>
          <View style={styles.infoBox}>
            <View style={styles.innerBox}>
              <Text style = {styles.infoText}>{this.state.Email}</Text>
            </View>
          </View>

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>

          <View style={styles.infoBox}>
            <View style={styles.innerBox}>
              <Text style = {styles.infoText}>{this.state.city}</Text>
            </View>
          </View>

          <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.015,}}/>

          <View style={styles.container_info}>
            <View style={{flexDirection: 'row', paddingLeft: 45, paddingRight: 35}}>
              <View style={{flex: 1}}>
                <Text style={styles.text_header}>Interests</Text>
              </View>
              <View>
                <TouchableHighlight onPress={() => {this.setState({TagsVisible: true})}}
                  underlayColor={'transparent'}>
                  <Text style={{color:'#0B82CC',textAlign:'center'}}>Edit</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.interestsHolder}>
              {this.renderInterests()}
            </View>
          </View>

          <View style={styles.container_info}>
            <Text style={styles.text_header}>Post Cards</Text>
            <View>
              {this.renderPostcards()}
            </View>
          </View>
         </View>
        </View>
        </ScrollView>
      </View>
    )
  }

  /*
  This function renders the view shown to users who are not logged in.
  */
  renderNotLoggedIn()
  {
    return (
      <View style={{flex:1,}}>
        <Button style={{backgroundColor:'#F97237',borderWidth:1,borderColor:'#EE6436',margin:16,borderRadius:22}} textStyle={{textAlign:'center',fontFamily:styleVariables.systemFont,fontSize:16,color:'white'}} onPress={() => this.logout()}> Sign in or Sign up to view profile </Button>
      </View>
    );
  }  /*end renderNotLoggedIn*/

  /*
  This function renders the component shown to users who are logged in.
  */
  renderLoggedIn()
  {
    if(this.state.modalVisible === false && this.state.settingsModal === false && this.state.hasPostCardSelected === false && this.state.TagsVisible === false)
    {
      return this.renderProfile();
    }
    else if(this.state.hasPostCardSelected === true)
    {
      return this.renderPostCardModal();
    }
    else if(this.state.modalVisible === true)
    {
        return this.renderModal();
    }else if(this.state.settingsModal === true){
      return this.renderSettingsModal();
    }else
    {
      return(
      <Modal
        animationType={'none'}
        transparent={false}
        visible = {this.state.TagsVisible}
        onRequestClose={() => {this.setState({TagsVisible:false})}}
      >
       <View style = {styles.container_settings}>
         <View style = {styles.navigationBarStyle}>
           <Text style = {styles.navigationBarTextStyle}>
             Edit Interests
           </Text>
           <ImageButton image={checkImage} style={{top:8}} onPress={() => this.saveInterests()}>
           </ImageButton>
         </View>

         <View style = {styles.container_addEvent}>
           <View style={styles.interestsView}>
             {this.renderTags()}
           </View>
        </View>
       </View>
      </Modal>
    )
    }
  }  /*end renderLoggedIn*/

  /*
  This function renders the Profile component.
  */
  render() {
    let viewToShow

    if(this.props.loggedIn)
    {
      viewToShow = (firebase.auth().currentUser.email != 'test@test.com') ? this.renderLoggedIn() : this.renderNotLoggedIn()
      return(
         <View style={styles.container_profile}>
          {viewToShow}
         </View>
       )
    }
    else {
      return <View/>
    }
  }

}  /*end Profile Component*/

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFFFFF',
    width: 200,
    height: 30,
    borderWidth: .75,
    flexDirection: 'row',
    borderColor:'#d3d3d3'
  },
  list: {
    paddingBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap:'wrap',
  },
  scroll: {
    height:CARD_HEIGHT*.65,
  },
  scrolling_profile: {
    height: height - HEADER_HEIGHT - TAB_HEIGHT - 25,
    width: CARD_WIDTH,
    backgroundColor: '#E2E2E2',
  },
  datePicker:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    padding: 2,
    //paddingLeft: 16,
  },
  container: {
    top: Platform.OS == 'ios' ? 64:44,
    height: height - (Platform.OS == 'ios' ? 64:44) - 45,
    bottom: 45,
  },
  container_Info: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  },
  container_image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT* .15,
    flexDirection: 'row',
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: 'center',
  },
  infoBox: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT* .08,
    paddingLeft: 50,
    paddingRight:50,
    backgroundColor:'transparent',
  },
  infoText: {
    padding: 10,
    fontFamily: styleVariables.systemRegularFont,
    color: styleVariables.greyColor,
    fontSize: 16,
    backgroundColor:'transparent',
  },
  innerBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 7,
    justifyContent: 'center',
  },
  text_header: {
    fontFamily: styleVariables.systemBoldFont,
    color: '#F97237',
    fontSize: 18,
    textAlign: 'center',
  },
  container_profile: {
    paddingTop: HEADER_HEIGHT,
    paddingBottom: TAB_HEIGHT,
    flex:1,
    width: CARD_WIDTH,
  },
  container_addEvent: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      backgroundColor: 'white',
    },
  container_upper: {
    flex:1,
    backgroundColor: '#0E476A',
  },
  container_lower: {
    flex:1.75,
    backgroundColor:'#E2E2E2',
  },
  container_settings: {
    backgroundColor: 'white',
    flex:1,
    flexDirection: 'column',
  },
  changePhoto: {
    flex: 1,
    height: CARD_HEIGHT* .15,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingLeft: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  userImage: {
    width: CARD_HEIGHT* .15,
    height: CARD_HEIGHT* .15,
  },
  locationList:{
    marginLeft:32,
    marginRight: 32,
    marginBottom: 16,
  },
  interestsView: {
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
  interestCellText:{
    fontFamily: styleVariables.systemFont,
    fontSize: 18,
    color: '#848484',
  },
  userLocation: {
    color: 'white',
    backgroundColor: 'transparent',
    height: 25,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 12,
  },
  selectedCell:{
    marginHorizontal: 7,
    marginVertical:8,
    borderWidth:2,
    borderColor:'#0B82CC',
    backgroundColor:'#FFFFFF',
    borderRadius:4,
  },
  selectedCellText:{
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 17,
    color: '#0B82CC',
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
    fontSize:20,
    fontFamily:'Futura-Medium',
    textAlign:'center',
    lineHeight: HEADER_HEIGHT-21,
  },
  saveInput: {
    backgroundColor: '#3CD758',
    height: 75,
    width: 75,
    borderRadius: height/2,
  },
  settings_InputView: {
    width: width-40,
    height: CARD_HEIGHT *0.1,
    marginLeft: 20,
    borderBottomWidth: .5,
    borderBottomColor: styleVariables.greyColor,
  },
  settings_InfoField: {
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
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
  FieldInput: {
      flex: 1,
      fontSize: 14,
      fontFamily: styleVariables.systemRegularFont,
  },
  textInput:{
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
  TextInputHolder:{
    backgroundColor:'#FFFFFF',
    height: 44,
    marginLeft:32,
    marginRight: 32,
    flexDirection: 'row',
    marginBottom: 16,
  },
  settings_Header: {
    fontFamily: styleVariables.systemRegularFont,
    fontSize: 12,
    color: styleVariables.greyColor,

  },
  settings_image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  settings_imageText: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 18,

  },
  interestsHolder: {
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor:'#E2E2E2',
  },
  interestCell:{
    margin:8,
    borderWidth:1,
    borderColor:'#848484',
    backgroundColor:'#FFFFFF',
    borderRadius:4,
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
    fontSize: 18,
    color: '#848484',
  },
  selectedCellText:{
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 17,
    color: '#0B82CC',
  },
})
