import React, { Component } from 'react'
import { connect } from 'react-redux';
import backgroundImage from '../images/City-Light.png'
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
import addImage from '../images/plus.png'
import styleVariables from '../Utils/styleVariables'
import LinearGradient from 'react-native-linear-gradient'
import Moment from 'moment'
import Swiper from 'react-native-swiper';
import SortableGrid from 'react-native-sortable-grid';
import DatePicker from 'react-native-datepicker'
import profileIcon from '../imgs/profile.png'
var eventActions = require("../actions/eventActions.js");
var userActions = require("../actions/userActions.js");

import postcardImage1 from '../images/postcard1.png'
import postcardImage2 from '../images/postcard2.jpg'
import postcardImage2_1 from '../images/postcard2_1.jpg'
import postcardImage2_2 from '../images/postcard2_2.jpg'
import postcardImage2_3 from '../images/postcard2_3.jpg'
import postcardImage4 from '../images/postcard4.jpg'

import PostcardView from './PostcardView'

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
        console.log("error!" + error);
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
      selectedAge: this.props.user.Age,
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
  }

  componentWillMount() {
    Actions.refresh({
             //renderRightButton: () => this.renderRightButton(),
        })
  }

  componentDidMount() {
    //this.renderCategories();
  }
  componentWillReceiveProps(nextProps){
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
  // renderRightButton(){
  //   return (
  //     <ImageButton image={settingsImage} style={{width:21,height:21}} imageStyle={{width:18,height:18,tintColor:'white'}} onPress={this.onRightPress.bind(this)}>
  //     </ImageButton>
  //   );
  // }
  onRightPress(){
    this.setModalVisible(true);
  }
  logout(){
    this.settingsVisible(false);
    Actions.tab1();
    this.props.logoutUser();
  }
  getRef() {
    return firebase.database().ref();
  }

  getStorageRef() {
    return firebase.storage().ref();
  }

  setModalVisible(visible) {
  this.setState({modalVisible: visible});
}

  resetSettingsValues() {
    this.setState({
      settingsModal: false,
      Email: this.props.user.Email,
      city: this.props.city,

    })
  }

  resetInfoValues() {
    this.setState({
      First_Name: this.props.user.First_Name,
      Last_Name: this.props.user.Last_Name,
      Phone: this.props.user.Phone,
      Age: this.props.user.Age ? this.props.user.Age : '',
      Gender: this.props.user.Gender,
      modalVisible: false,
    })
  }

  settingsVisible(visible) {
    this.setState({settingsModal: visible});
}
  closeModal(){
    this.setState({modalVisible: false});

  }

  renderSaveButton(){
    return (
      <ImageButton image={checkImage} style={{width:32,height:32}} imageStyle={{width:18,height:18,tintColor:'white'}} onPress={this.closeModal.bind(this)}>
      </ImageButton>
    );
  }
  renderLeftButton(){
    return(
      <ImageButton image={closeImage} style={{top:8,width:32,height:32}} imageStyle={{width:18,height:18,tintColor:'white'}} onPress={this._submitChanges.bind(this)}>
      </ImageButton>
    )
  }

renderImage(){
  ImagePicker.showImagePicker((response) => {
    if(response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }else {
      this.setState({userImageLocation: response.uri});
      uploadImage(response.uri, firebase.auth().currentUser.uid + '.jpg')
      .then(url => this.saveImage(url));
    }
  })
}

saveImage(url){
  this.userRef.update({ "Image": typeof(url) != "undefined" ? url : "", })
  this.setState({imageLocation: url});
}

_submitChanges(){
  //var imageLocation = this.userImageRef + '/' + firebase.auth().currentUser.uid + '.jpg';
  this.userRef.update({
    "First_Name": typeof(this.state.First_Name) != "undefined" ? this.state.First_Name : "",
    "Last_Name": typeof(this.state.Last_Name) != "undefined" ? this.state.Last_Name : "",
    "DOB": typeof(this.state.dob) != "undefined" ? this.state.dob : "",
    "Gender": typeof(this.state.Gender) != "undefined" ? this.state.Gender : "",
    "Phone": typeof(this.state.Phone) != "undefined" ? this.state.Phone : "",
  })
  this.setModalVisible(false);
}

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
  })
  this.props.saveLocation(this.state.city);
  this.settingsVisible(false);
  }
}

saveInterests(){
  this.props.saveInterests(this.state.interests);
  this.setState({TagsVisible: false});
}

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
  }

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
              Edit Profile
            </Text>
            <ImageButton image={close} style={{top:8}} onPress={() => this.resetSettingsValues()}>
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
              {/*<View style={{flexDirection:'row',marginLeft:16,marginRight:16}}>
                <TextInput
                  style={styles.locationInput}
                  placeholder={'City'}
                  value={this.state.city}
                  onChangeText={(text) => this.setCity(text)}
                  underlineColorAndroid='transparent'
                />
                <Button onPress={() => this.getLocation()}>Locate Me</Button>
              </View>*/}
            </View>

            <View style= {{flex:1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20}}>
              <ImageButton image={checkImage} style={styles.saveInput}  onPress={() => this._saveSettings()}>
              </ImageButton>
            </View>

            <Button style={{marginHorizontal:32,marginVertical:32,height:44,backgroundColor:'#F97237',borderWidth: 1,borderColor: '#EE6436',borderRadius:22}} textStyle={{textAlign:'center',fontFamily:styleVariables.systemBoldFont,fontSize:16,color:'white'}} onPress={() => this.logout()}>Logout</Button>

            </KeyboardAwareScrollView>

         </View>
     </Modal>
    )
  }

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
  }

  getPossibleLocations() {
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
{
            // <View style={styles.settings_InputView}>
            // <Text style={styles.settings_Header}>Age</Text>
            //   <View style = {styles.settings_InfoField}>
            //   <ModalPicker
            //     selectStyle={{borderRadius:0, borderWidth: 0}}
            //     selectTextStyle={{fontSize: 14, fontFamily: styleVariables.systemRegularFont}}
            //     style ={{ borderRadius:0}}
            //     data={ageOptions}
            //     onChange={(age) => this.setState({selectedAge: age.label})}>
            //
            //     <Text
            //       style={{padding:10, height:CARD_HEIGHT*.075,fontSize: 14, fontFamily: styleVariables.systemRegularFont, color:'black'}}
            //     >
            //     {this.state.selectedAge.toString()}
            //       </Text>
            //   </ModalPicker>
            //   </View>
            // </View>
          }
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
                onChange={(Gender) => this.setState({Gender: gender.label})}>

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
  }

  renderRow(rowData){
    <View style={styles.item}>
      <View style={{flex:.75}}>
        <Text style={{color:'#F97237'}}>{rowData.Category_Name}</Text>
      </View>
    </View>
  }

  renderLocationRow(rowData){
    var isSelected = this.state.city == rowData ? true : false;
    return(
      <TouchableHighlight underlayColor={'#FFFFFF'} style={isSelected ? styles.selectedLocationCell : styles.locationCell} onPress = {this.pressRow.bind(this,rowData)}>
        <Text style={isSelected ? styles.selectedLocationCellText : styles.locationCellText}>{rowData}</Text>
      </TouchableHighlight>
    )
  }

  pressRow(rowData){
    this.setState({city:rowData});
  }

  setTagsVisible(visible) {
    this.setState({
      TagsVisible: visible,
    });
  }
  // renderTagSelection(){
  //   <Modal
  //     animationType={'slide'}
  //     transparent={false}
  //     visible={this.state.TagsVisible}
  //     onRequestClose={() => {alert("Modal can not be closed.")}}
  //   >
  //   <View style={{flex:1, flexDirection: 'column'}}>
  //    <View style={{flex:1, backgroundColor:'#0E476A',position:'absolute',top:0,left:0,right:0,height:Platform.OS == 'ios' ? 64 : 44}}>
  //      <View style={{top:Platform.OS == 'ios' ? 20 : 0,flexDirection:'row'}}>
  //        <View>
  //        <ImageButton image={closeImage} style={{top:2}} imageStyle={{tintColor:'white'}} onPress={() => this.setState({TagsVisible: false})}>
  //        </ImageButton>
  //        </View>
  //      </View>
  //    </View>
  //
  //      <View style = {styles.container_profile}>
  //        <View style={styles.interestsHolder}>
  //          {/*this.renderTags()*/}
  //        </View>
  //     </View>
  //    </View>
  //   </Modal>
  // }

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
  }
  renderTags(){
    // Call to database to populate the possible tags
    interests = eventActions.renderPossibleInterests();

    var interestsViews = [];
    for (i in interests){
      var interest = i;
      var isSelected = this.state.interests.indexOf(interest) == -1 ? false : true;
      // var backgroundColor = this.state.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
      interestsViews.push(
          <Button ref={interest} underlayColor={'#FFFFFF'} key={i} style={isSelected ? styles.selectedCell : styles.interestCell} textStyle={isSelected ? styles.selectedCellText : styles.interestCellText} onPress={this.buttonPressed.bind(this,interest)}>{interest.toUpperCase()}</Button>
      );
    }

    return interestsViews;
  }

  renderInterests(){
    interests = this.state.interests;

    if(interests.length > 0)
    {
      var interestsViews = [];
      for (var i=0;i<interests.length;i++){
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
  }
  openPostCard(sentPostCardInfo){
    this.setState({hasPostCardSelected:true,selectedPostCardInfo:sentPostCardInfo});
  }
  closePostCard(){
    this.setState({hasPostCardSelected:false,currentIndex:0},
      function(){
        this.props.savePostcards(this.state.postcards);
        this.setState({selectedPostCardInfo:{}})
    })
  }
  renderPostcards(){
    var maxViews = 5;

    // var postCards = [{name:'Coachella',date: new Date(),cardImage: postcardImage1,color:'#0E476A',userImages:[]},{name:'Drake @ Colonial Life Arena',date: new Date(), cardImage: postcardImage2,color:'#F06D37',userImages:[postcardImage2_1,postcardImage2_2,postcardImage2_3]}]
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
        )
      }

      return (
        <View>
          {postCardViews}
        </View>
      )
    }
    else {
      return <Text style={{flex:1,marginVertical:8,fontFamily:styleVariables.systemFont,textAlign:'center'}}>No postcards selected</Text>
    }
  }
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
  }
  renderProfile() {
    if (this.state.Phone && this.state.Phone.length > 9) {
      let first = this.state.Phone.substring(0,3);
      let second = this.state.Phone.substring(3,6);
      let third = this.state.Phone.substring(6,11);
      var phoneString = first + '-' + second + '-' + third;
    } else if (this.state.Phone) {
      var phoneString = this.state.Phone
    } else {
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
                    <TouchableHighlight onPress={() => {this.settingsVisible(true)}}  underlayColor={'transparent'}>
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
                        <TouchableHighlight onPress={() => {this.setState({TagsVisible: true})}}  underlayColor={'transparent'}>
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
    {/*
    <View style = {styles.innerContainer}>
    <View style= {styles.ile}>
      <View style= {styles.container_upper}>
        <View style={styles.container_image}>
          <Image source={{uri: this.state.imageLocation }} style={styles.userImage}/>
        </View>
        <View>
          <Text style={styles.profile_username}> {this.state.First_Name}{" "}{this.state.Last_Name} </Text>
        </View>
        <View>
          <Text style={styles.userLocation}>{this.props.location}</Text>
        </View>
        <Button style={{marginLeft:32,marginRight:32}} textStyle={{color:'white',textAlign:'center'}} onPress={() => this.logout()}>Sign out</Button>
       </View>
      <ScrollView style={styles.container_lower}>
        <View style={styles.profile_interestHeader}>
          <Text style={styles.profile_interests}>Interests</Text>
        </View>
        <View style={styles.interestsHolder}>
          {this.renderInterests()}
        </View>
        <View style={styles.profile_interestHeader}>
          <Text style={styles.profile_interests}>Post Cards</Text>
        </View>
        <View>
          {this.renderPostcards()}
        </View>
      </ScrollView>
    </View>
  </View>
  */}
  </View>
)
  }

  renderNotLoggedIn()
  {
    return (
      <View style={{flex:1,}}>
        <Button style={{backgroundColor:'#F97237',borderWidth:1,borderColor:'#EE6436',margin:16,borderRadius:22}} textStyle={{textAlign:'center',fontFamily:styleVariables.systemFont,fontSize:16,color:'white'}} onPress={() => this.logout()}> Sign in or Sign up to view profile </Button>
      </View>
    );
  }
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
  }
  render() {
    let viewToShow
    console.log("userref! " + this.userImageRef);

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
}
const styles = StyleSheet.create({
  creator_EventView: {
    width: width,
    height: CARD_HEIGHT *0.1,

  },
  creator_NameInput: {
    marginLeft:10,
    marginRight: 5,
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
    borderBottomWidth:.5,
    borderBottomColor: '#d3d3d3',
  },
  linearGradient: {
    flex:1,
  },
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
    // flex: 1,
    // flexDirection: 'column',
    // borderColor: 'black',
    // borderWidth: 2,
  },
  innerContainer:{
    flex: 1,
    flexDirection: 'column',
    // borderColor: 'black',
    // borderWidth: 2,
  },
  settings_card: {
    top: 0,
    width:CARD_WIDTH,
    height:CARD_HEIGHT+TAB_HEIGHT,
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
    // borderWidth: 2,
    // borderColor: 'green',
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
  filterTypeTitle: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 24,
    color: '#F97237',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    marginTop:8,
    textAlign:'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: CARD_WIDTH,
    top: height*.6,
    height: height*.45,
    resizeMode: 'stretch', // or 'stretch'
  },
  userImage: {
    width: CARD_HEIGHT* .15,
    height: CARD_HEIGHT* .15,

    //resizeMode: 'cover', // or 'stretch'
    //justifyContent: 'center',
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
  profile_username: {
    // borderWidth: 2,
    // borderColor: 'pink',
    color: 'white',
    backgroundColor: 'transparent',
    height: 30,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 18,
  },
  picker: {
    width: 100
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
    // borderWidth: 2,
    // borderColor: 'black',
    color: 'white',
    backgroundColor: 'transparent',
    height: 25,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 12,
  },
  loginButton: {
    marginTop: 5,
    backgroundColor: '#50E3C2',
    height: 50,
    // marginLeft:20,
    // marginRight: 20,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#22FFCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile_interests: {
    height: 25,
    paddingLeft: CARD_WIDTH * .04,
    textAlign: 'left',
    fontFamily: 'Futura-Medium',
    fontSize: 18,
    color: 'black',
    backgroundColor: 'transparent',
  },
  profile_interestHeader: {
    borderBottomWidth: .5,
    borderBottomColor: '#4F4F4F',
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',

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
    //color:'#F97237',
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
    // resizeMode: 'cover', // or 'stretch'
    //justifyContent: 'center',
    borderRadius: 50,
  },
  settings_imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: CARD_HEIGHT * .4,
    // borderWidth: 2,
    // borderColor: 'red',
  },
  settings_closeModal: {
    paddingTop: 3,
    paddingLeft: 3,

  },
  settings_saveModal: {
    paddingTop: 3,
    paddingRight: 3,
  },
  settings_imageText: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 18,

  },
  settings_NameView: {
    // borderBottomWidth: .75,
    // borderBottomColor: '#d3d3d3',
    width: width/2,
    height: CARD_HEIGHT * .1,
  },

  settings_EmailView: {
    // borderBottomWidth: .75,
    // borderBottomColor: '#d3d3d3',
    width: width,
    height: CARD_HEIGHT * .1,
  },
  settings_PhoneView: {
    width: CARD_WIDTH*.75,
    height: CARD_HEIGHT * .1,
  },
  settings_AgeView: {
    width: CARD_WIDTH*.25,
    height: CARD_HEIGHT * .1,
  },
  settings_NameInput: {
    // borderWidth: 2,
    // borderColor: 'red',
    //height:25,
    //paddingLeft: 10,
    //paddingTop: 10,
    fontSize: 12,
    color:'black',
  },
  settings_Name: {
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
    paddingLeft: 10,
    //paddingTop: 2,
  },
  settings_EmailInput: {
    marginLeft:10,
    marginRight: 10,
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
    backgroundColor:'white',
    borderWidth:.5,
    borderColor:'#d3d3d3',
  },
  settings_FirstInput: {
    marginLeft:10,
    marginRight: 5,
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
    backgroundColor:'white',
    borderWidth:.5,
    borderColor:'#d3d3d3',
  },
  settings_LastInput: {
    marginLeft:5,
    marginRight:10,
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
    backgroundColor:'white',
    borderWidth:.5,
    borderColor:'#d3d3d3',
  },
  profile_Icon: {
    height: 25,
    width:25,
  },
  uploadAvatar: {
    width: 100,
    height: 100,
  },

  view_iconView: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // borderWidth: 2,
    // borderColor: 'red',
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
  tagsCell: {
    margin: 8,
  }
})
