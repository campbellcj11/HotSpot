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
      Age: this.props.user.Age,
      Gender: this.props.user.Gender,
      Phone: this.props.user.Phone,
      responseURI: this.props.user.Image,
      Image: this.props.user.Image,
      Email: this.props.user.Email,
      modalVisible: false,
      selectedGender: this.props.user.Gender,
      selectedAge: this.props.user.Age,
      categories: [],
      dataSource: ds,

    }
    this.currentUserID = firebase.auth().currentUser.uid;
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
  uploadImage(this.state.responseURI, firebase.auth().currentUser.uid + '.jpg');
  var imageLocation = this.userImageRef + '/' + firebase.auth().currentUser.uid + '.jpg';

  this.userRef.update({
    "First_Name": this.state.First_Name,
    "Last_Name": this.state.Last_Name,
    "Age": this.state.selectedAge.label,
    "Image": imageLocation,
    "Gender": this.state.selectedGender.label,
    "Email": this.state.Email,
    "Phone": this.state.Phone,
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
    var ageString = this.props.user.Age.toString();
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

          <KeyboardAwareScrollView scrollEnabled={false}>
          <ScrollView style={{flex:1}} scrollEnabled={false}>
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
                  placeholder={this.state.Phone.toString()}
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
                  initValue= {ageString}
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
          </ScrollView>
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
  renderProfile() {
  return(
    <View style = {styles.innerContainer}>
    <View style= {styles.container_profile}>
      <View style= {styles.container_upper}>
        <View style={styles.container_image}>
          <Image source={{uri: this.state.Image}} style={styles.userImage}/>
        </View>
        <View>
          <Text style={styles.profile_username}> {this.state.First_Name}{" "}{this.state.Last_Name} </Text>
        </View>
        <View>
          <Text style={styles.userLocation}></Text>
        </View>
       </View>
      <View style={styles.container_lower}>
        <View style={styles.profile_interestHeader}>
          <Text style={styles.profile_interests}>Interests</Text>
        </View>
        <View style={{flex:1}}>
        <ListView style={styles.scroll}
        contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderRow= {this.renderRow.bind(this)}>
        </ListView>
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

    viewToShow = (firebase.auth().currentUser.email != 'test@test.com') ? this.renderLoggedIn() : this.renderNotLoggedIn()
    return(
       <View style={{flex:1}}>
        {viewToShow}
       </View>
     )
  }
}
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
    //  borderWidth: 2,
    //  borderColor: 'red',
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
    backgroundColor: '#f2f2f2',
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

  TextInput: {
    // borderWidth: 2,
    // borderColor: 'blue',
    width: width,
    height: 25,
    paddingLeft: 10,
    fontSize: 15,
    fontFamily: 'Futura-Medium',
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
  }
})
