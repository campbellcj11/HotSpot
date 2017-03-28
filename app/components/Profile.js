import React, { Component } from 'react'
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
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
import icon3 from '../images/settings.png'
import closeImage from '../images/delete.png'
import checkImage from '../images/check.png'
import styleVariables from '../Utils/styleVariables'


var {height, width} = Dimensions.get('window');

const HEADER_HEIGHT = Platform.OS == 'ios' ? 64 : 44;
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
      modalVisible: false,
      selectedGender: this.props.user.Gender,
      selectedAge: this.props.user.Age,
      categories: [],
      dataSource: ds,
      interests: this.props.interests,
    }
  //  this.currentUserID = firebase.auth().currentUser.uid;
    this.userRef = this.getRef().child('users/' + firebase.auth().currentUser.uid);
    this.userImageRef = this.getStorageRef().child('UserImages');
    this.categoriesRef = this.getRef().child('categories/'+firebase.auth().currentUser.uid);
  }

  componentWillMount() {
    Actions.refresh({
             renderRightButton: () => this.renderRightButton(),
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
  }
  renderRightButton(){
    return (
      <ImageButton image={icon3} style={{width:21,height:21}} imageStyle={{width:18,height:18,tintColor:'white'}} onPress={this.onRightPress.bind(this)}>
      </ImageButton>
    );
  }
  onRightPress(){
    this.setModalVisible(true);
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
      <ImageButton image={closeImage} style={{top:2,width:32,height:32}} imageStyle={{width:18,height:18,tintColor:'white'}} onPress={this._submitChanges.bind(this)}>
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
      this.setState({
        responseURI: response.uri,
      })
    }
  })
}

_submitChanges(){
  uploadImage(this.state.responseURI, firebase.auth().currentUser.uid + '.jpg')
  .then(url => this.setState({imageLocation: url}));
  //var imageLocation = this.userImageRef + '/' + firebase.auth().currentUser.uid + '.jpg';
  this.userRef.update({
    "First_Name": typeof(this.state.First_Name) != "undefined" ? this.state.First_Name : "",
    "Last_Name": typeof(this.state.Last_Name) != "undefined" ? this.state.Last_Name : "",
    "Age": typeof(this.state.selectedAge) != "undefined" ? this.state.selectedAge : "",
    "Image": typeof(this.state.imageLocation) != "undefined" ? this.state.imageLocation : "",
    "Gender": typeof(this.state.selectedGender) != "undefined" ? this.state.selectedGender : "",
    "Email": typeof(this.state.Email) != "undefined" ? this.state.Email : "",
    "Phone": typeof(this.state.Phone) != "undefined" ? this.state.Phone : "",
  })
  this.setModalVisible(false);
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

  renderModal()
  {
    var ageString = this.props.user.Age;
     var genderString = this.props.user.Gender;
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
        animationType={'none'}
        transparent={false}
        visible = {this.state.modalVisible}
        onRequestClose={() => {alert("Modal can not be closed.")}}
      >
        <View style = {styles.container_settings}>
          <View style = {styles.navigationBarStyle}>
            <TouchableHighlight style={{flex:.2,marginTop:20,}} onPress={() => {this.setModalVisible(false), this.setState({ Image: this.props.user.Image })}}>
              <Text style={{color:'#F97237',textAlign:'center'}}>Exit</Text>
            </TouchableHighlight>
            <Text style = {styles.navigationBarTextStyle}>
              Edit Profile
            </Text>
            <TouchableHighlight style={{flex:.2,marginTop:20,}} onPress={() => this._submitChanges()}>
              <Text style={{color: '#F97237',textAlign:'center'}}>Save</Text>
            </TouchableHighlight>
          </View>

          <KeyboardAwareScrollView scrollEnabled = {true} style={{backgroundColor: 'white'}}>

          <View style = {styles.settings_imageView}>
               <Image source={{uri: this.state.responseURI }} style={styles.userImage}/>
               <TouchableHighlight
               onPress={()=> this.renderImage()}
               underlayColor={'white'}>
                 <Text style={styles.settings_imageText}>Change Photo</Text>
               </TouchableHighlight>
          </View>

            <View style={styles.settings_InputView}>
            <Text style={styles.settings_Header}>First name</Text>

              <View style = {styles.settings_InfoField}>
              <TextInput
                style = {styles.TextInput}
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
                style = {styles.TextInput}
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
            <Text style={styles.settings_Header}>Email</Text>
              <View style = {styles.settings_InfoField}>
              <TextInput
                style = {styles.TextInput}
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

            <View style={styles.settings_InputView}>
            <Text style={styles.settings_Header}>Phone number</Text>
              <View style = {styles.settings_InfoField}>
              <TextInput
                style = {styles.TextInput}
                ref='Phone'
                placeholder={this.state.Phone.toString()}
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
            <Text style={styles.settings_Header}>Age</Text>
              <View style = {styles.settings_InfoField}>
              <ModalPicker
                selectStyle={{borderRadius:0, borderWidth: 0}}
                selectTextStyle={{fontSize: 14, fontFamily: styleVariables.systemRegularFont}}
                style ={{ borderRadius:0}}
                data={ageOptions}
                onChange={(age) => this.setState({selectedAge: age.label})}>

                <Text
                  style={{padding:10, height:CARD_HEIGHT*.075,fontSize: 14, fontFamily: styleVariables.systemRegularFont, color:'black'}}
                >
                {this.state.selectedAge.toString()}
                  </Text>
              </ModalPicker>
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
                onChange={(gender) => this.setState({selectedGender: gender.label})}>

                <Text
                  style={{padding:10, height:CARD_HEIGHT*.075,fontSize: 14, fontFamily: styleVariables.systemRegularFont, color: 'black'}}
                >
                  {this.state.selectedGender}
                  </Text>
              </ModalPicker>
              </View>
            </View>



{/*
          <KeyboardAwareScrollView scrollEnabled={false}>

          <View style={styles.settings_card}>
            <View style = {styles.settings_imageView}>
              <View style = {styles.settings_image}>
                <Image source={{uri: this.state.responseURI }} style={styles.userImage}/>
                <TouchableHighlight
                 onPress={()=> this.renderImage()}
                 underlayColor = '#dddddd'>
                  <Text style={styles.settings_imageText}>Change Photo</Text>
                </TouchableHighlight>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={styles.settings_NameView}>
                <View style = {styles.settings_Name}>
                  <Text style = {styles.settings_NameInput}>FIRST</Text>
                </View>
                <View style={styles.settings_FirstInput}>
                <TextInput
                  style = {styles.TextInput}
                  placeholder={this.state.First_Name}
                  ref='First_Name'
                  onChangeText={(First_Name) => this.setState({First_Name})}
                  placeholderTextColor='black'
                  underlineColorAndroid='transparent'>
                </TextInput>
                </View>
              </View>
              <View style={styles.settings_NameView}>
                <View style = {styles.settings_Name}>
                  <Text style = {styles.settings_NameInput}>LAST</Text>
                </View>
                <View style={styles.settings_LastInput}>
                <TextInput
                  style = {styles.TextInput}
                  ref='Last_Name'
                  onChangeText={(Last_Name) => this.setState({Last_Name})}
                  placeholder={this.state.Last_Name}
                  placeholderTextColor='black'
                  underlineColorAndroid='transparent'>
                </TextInput>
              </View>
             </View>
            </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
            </View>

            <View style={styles.settings_EmailView}>
              <View style = {styles.settings_Name}>
                <Text style = {styles.settings_NameInput}>EMAIL</Text>
              </View>
              <View style={styles.settings_EmailInput}>
              <TextInput
                style = {styles.TextInput}
                onChangeText={(Email) => this.setState({Email})}
                placeholder={this.props.user.Email}
                ref='Email'
                placeholderTextColor='black'
                underlineColorAndroid='transparent'
                keyboardType='email-address'
                >
              </TextInput>
              </View>
            </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={styles.settings_PhoneView}>
                <View style = {styles.settings_Name}>
                  <Text style = {styles.settings_NameInput}>PHONE</Text>
                </View>
                <View style={styles.settings_FirstInput}>
                <TextInput
                  style = {styles.TextInput}
                  ref='Phone'
                  placeholder={this.state.Phone}
                  placeholderTextColor='black'
                  onChangeText={(Phone) => this.setState({Phone})}
                  underlineColorAndroid='transparent'
                  keyboardType='numeric'
                  maxLength={10}
                >
                </TextInput>
                </View>
              </View>
              <View style={styles.settings_AgeView}>
                <View style = {styles.settings_Name}>
                  <Text style = {styles.settings_NameInput}>AGE</Text>
                </View>
                <View style={styles.settings_LastInput}>
                <ModalPicker
                  selectStyle={{borderRadius:0, borderWidth: 0}}
                  selectTextStyle={{fontSize: 15, fontFamily: 'Futura-Medium'}}
                  style ={{ borderRadius:0}}
                  data={ageOptions}
                  onChange={(age) => this.setState({selectedAge: age.label})}>

                  <TextInput
                    style={{padding:10, height:CARD_HEIGHT*.075}}
                    editable={false}
                    value = {this.state.selectedAge.toString()} />
                </ModalPicker>
              </View>
             </View>
            </View>

            <View style={{backgroundColor: 'transparent', height: CARD_HEIGHT*.02}}>
            </View>
            <View style={styles.settings_NameView}>
              <View style = {styles.settings_Name}>
                <Text style = {styles.settings_NameInput}>GENDER</Text>
              </View>
              <View style={styles.settings_FirstInput}>
              <ModalPicker
                selectStyle={{borderRadius:0, borderWidth: 0}}
                selectTextStyle={{fontSize: 15, fontFamily: 'Futura-Medium'}}
                style ={{flex: 1, borderRadius:0}}
                data={genderOptions}
                initValue= {genderString}
                onChange={(gender) => this.setState({selectedGender: gender.label})}>

                <TextInput
                  style={{padding:10, height:CARD_HEIGHT*.075}}
                  editable={false}
                  value = {this.state.selectedGender} />
              </ModalPicker>
              </View>
            </View>
          </View>

          </KeyboardAwareScrollView>

          */}
            </KeyboardAwareScrollView>
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
  renderInterests(){
    var interests = this.state.interests;//['Nightlife','Entertainment','Music','Food_Tasting','Family','Theater','Dining','Dance','Art','Fundraiser','Comedy','Festival','Sports','Class','Lecture','Fitness','Meetup','Workshop',];
    var interestsViews = [];

    for(var i=0;i<interests.length;i++)
    {
      var interest = interests[i];
      // var backgroundColor = this.props.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
      interestsViews.push(
          <Button ref={interest} key={i} style={[styles.interestsCell,{backgroundColor:'#0B82CC'}]} textStyle={styles.interestsCellText}>{interest}</Button>
      );
    }

    return interestsViews;
  }
  renderProfile() {
  return(
    <View style = {styles.innerContainer}>
    <View style= {styles.container_profile}>
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
       </View>
      <View style={styles.container_lower}>
        <View style={styles.profile_interestHeader}>
          <Text style={styles.profile_interests}>Interests</Text>
        </View>
        <View style={styles.interestsHolder}>
          {this.renderInterests()}
        </View>
      </View>
    </View>
  </View>
)
  }

  renderNotLoggedIn()
  {
    return (
      <View style={styles.container}>
        <Text style={{textAlign:'center',fontFamily:'Futura-Medium',fontSize:15,flex:1}}> Login or Signup to view profile </Text>
      </View>
    );
  }
  renderLoggedIn()
  {
    if(this.state.modalVisible === false)
    {
      return this.renderProfile();
    }
    else
    {
        return this.renderModal();
    }
  }
  render() {
    let viewToShow
    console.log("userref! " + this.userImageRef);

    viewToShow = (firebase.auth().currentUser.email != 'test@test.com') ? this.renderLoggedIn() : this.renderNotLoggedIn()
    return(
       <View style={{flex:1}}>
        {viewToShow}
       </View>
     )
  }
}
const styles = StyleSheet.create({
  creator_EventView: {
    width: width,
    height: CARD_HEIGHT *0.1,
    borderWidth: 2,
    borderColor: 'red',

  },
  creator_NameInput: {
    marginLeft:10,
    marginRight: 5,
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
    borderBottomWidth:.5,
    borderBottomColor: '#d3d3d3',
    borderWidth: 2,
    borderColor: 'blue',
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
  container_image: {
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  container_profile: {
    top: HEADER_HEIGHT,
    // borderWidth: 2,
    // borderColor: 'red',
    width: CARD_WIDTH,
    //top: height*.6,
    height: CARD_HEIGHT,
  },
  container_upper: {
    flex:1,
    // borderWidth: 2,
    // borderColor: 'blue',
    backgroundColor: '#0E476A',
  },
  container_lower: {
    flex:1.75,
    // borderWidth: 2,
    // borderColor: 'green',
  },
  container_settings: {
    backgroundColor: 'white',
    flex:1,
    flexDirection: 'column',
  },
  backgroundImage: {
    position: 'absolute',
    width: CARD_WIDTH,
    top: height*.6,
    height: height*.45,
    resizeMode: 'stretch', // or 'stretch'
  },
  userImage: {
    width: 100,
    //top: 20,
    height: 100,
    //resizeMode: 'cover', // or 'stretch'
    //justifyContent: 'center',
    borderRadius: 50,
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
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: CARD_WIDTH,
    height: height,
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

  },
  navigationBarStyle: {
    height: HEADER_HEIGHT,
    width: width,
    backgroundColor:'#0E476A',
    borderBottomWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navigationBarTextStyle: {
    marginTop:20,
    flex:.6,
    color:'#F97237',
    fontSize:20,
    fontFamily:'Futura-Medium',
    textAlign:'center',
    lineHeight: HEADER_HEIGHT-21,
  },
  settings_InputView: {
    width: width-20,
    height: CARD_HEIGHT *0.1,
    marginLeft: 10,
    borderBottomWidth: .5,
    borderBottomColor: styleVariables.greyColor,
  },
  settings_InfoField: {
    height: CARD_HEIGHT*.075,
    justifyContent: 'center',
  },
  TextInput: {
      flex: 1,
      fontSize: 14,
      fontFamily: styleVariables.systemRegularFont,

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
    width: 100,
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
    flex:1,
    marginLeft: 16,
    marginRight: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  interestsCell: {
    margin: 8,
  },
  interestsCellText: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 14,
    color: 'white',
  },
})
