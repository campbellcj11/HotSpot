import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableHighlight,
  Image,
  Dimensions,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import backgroundImage from '../images/city.jpeg'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import logoutImage from '../images/arrows.png'
import searchImage from '../images/magnifying-glass.png'
import LinearGradient from 'react-native-linear-gradient';
var {height, width} = Dimensions.get('window');
import * as firebase from 'firebase';


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
    }
    this.itemsRef = this.getRef().child('events');
  }

  componentWillMount() {
    this.listenForItems(this.itemsRef);
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          Event_Name: child.val().Event_Name,
          Date: child.val().Date,
          Location: child.val().Location,
          image: child.val().image,
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  _login(){
    //hardcoded for prototype
    var user = {'email': this.state.email,
                'password' : this.state.password};
    if(this.state.email == '')
    {
      user = {'email': 'test@test.com',
                  'password' : 'password'};
    }
    this.props.loginUser(user);
  }

  _logout(){
    this.props.logoutUser();
  }

  _resetPassword() {
    //hardcoded for prototype - need to get email from user
    var user = {'email': this.state.email,
                'password' : this.state.password};
    this.props.resetPassword(user.email);
  }

renderRow(rowData){
  return (
    <TouchableHighlight
      onPress={()=> this.pressRow(rowData)}
      underlayColor = '#dddddd'
      style={styles.item}>
        <Image style={styles.item} source={{uri: rowData.image}}>
          <View style={styles.fader}>
            <Text style={styles.itemText}>{rowData.Event_Name}</Text>
          </View>
        </Image>
    </TouchableHighlight>
  )
}
pressRow(rowData) {
  console.log('RowData: ',rowData);
  this.setState({currentSelection:rowData});
  this.setState({hasCurrentSelection:true});
}
_closeSelection(){
  this.setState({currentSelection:{}});
  this.setState({hasCurrentSelection:false});
}

  render() {
    console.log('PROPS!')
    console.log(this.props)
    let user, readonlyMessage
    if(this.props.loggedIn && this.props.user != {})
    {
      user = this.props.user
      readonlyMessage = <Text style={styles.offline}>Logged In {user.email}</Text>
    }
    else
    {
      readonlyMessage = <Text style={styles.offline}>Not Logged In</Text>
    }

    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff'}
      : null;

    return (
      <View style={{flex:1}}>
        <Modal
            animationType={'none'}
            transparent={false}
            visible={!this.props.loggedIn}
        >
          <View style={{flexDirection:'row'}}>
            <Image source={backgroundImage} style={styles.backgroundImage} textStyle={styles.buttonText}>
              <LinearGradient colors={['#30404F', '#22B1C5']} style={styles.opacityLinearGradient}>
              </LinearGradient>
              <Text style={styles.title}>
                Project Now
              </Text>
              <View style={styles.userNameView}>
                <View style={styles.userNameOpacityView}>
                </View>
                <View style={styles.userNameImageView}>
                  <Image source={userImage} style={styles.userNameImage}>
                  </Image>
                </View>
                <TextInput style={styles.userNameTextInput}
                  ref='email'
                  onChangeText={(email) => this.setState({email})}
                  placeholder='email'
                  placeholderTextColor='#aaa'>
                </TextInput>
              </View>

              <View style={styles.userNameView}>
                <View style={styles.userNameOpacityView}>
                </View>
                <View style={styles.userNameImageView}>
                  <Image source={passwordImage} style={styles.userNameImage}>
                  </Image>
                </View>
                <TextInput style={styles.userNameTextInput}
                  secureTextEntry={true}
                  ref='password'
                  onChangeText={(password) => this.setState({password})}
                  placeholder='password'
                  placeholderTextColor='#aaa'>
                </TextInput>
              </View>
              <Button
                onPress={() => this._login()}
                style={styles.loginButton}
                textStyle={styles.buttonText}>
                Login
              </Button>
            </Image>
          </View>
        </Modal>

        <Modal
          animationType='fade'
          transparent={this.state.transparent}
          visible={this.state.hasCurrentSelection}
        >
            <View style={[styles.modalContainer, modalBackgroundStyle]}>
              <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
                <View style={styles.eventDateView}>
                </View>
                <View style={styles.eventMapView}>
                </View>
                <Text>This modal was presented animation.</Text>
                <Text>It is currently displayed in mode.</Text>
                <Button
                  onPress={() => this._closeSelection()}
                  style={styles.modalButton}
                  textStyle={styles.buttonText}
                >
                  Close
                </Button>
              </View>
            </View>
        </Modal>


        <View style={styles.container}>
          <LinearGradient colors={['#30404F', '#22B1C5']} style={styles.linearGradient}>
          </LinearGradient>
          <ListView style={styles.scroll}
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow= {this.renderRow.bind(this)}>
          </ListView>
          <View style={styles.bottomBar}>
            <ImageButton
              onPress={() => this._logout()}
              style={styles.logoutButton}
              image={logoutImage}/>
            <ImageButton
              onPress={() => this._logout()}
              style={styles.searchButton}
              image={searchImage}/>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Nexa Bold',
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
  backgroundImage: {
    width: width,
    height: height,
    resizeMode: 'cover', // or 'stretch'
  },
  opacityLinearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: .80,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  loginButton: {
    top: 100,
    backgroundColor: 'rgb(56,198,95)',
    height: 50,
    marginLeft: width*.2,
    marginRight: width*.2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height*.1,
    backgroundColor:'yellow',
  },
  logoutButton: {
    backgroundColor: '#D73C54',
    height: height*.1,
    marginLeft: width*.02,
    marginRight: 10,
    width: height*.1,
  },
  searchButton: {
    backgroundColor: 'blue',
    height: 50,
    marginLeft: 10,
    width: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Nexa Bold',
    height: 50,
    lineHeight: 50,
  },
  title: {
    color: 'white',
    backgroundColor: 'transparent',
    top: 40,
    height: 55,
    textAlign: 'center',
    fontFamily: 'Nexa Bold',
    fontSize: 42,
  },
  userNameView: {
    backgroundColor:'rgba(0,0,0,.5)',
    height: 50,
    top: 100,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 15,
  },
  userNameOpacityView: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'blue',
  },
  userNameImageView: {
    height: 50,
    backgroundColor: 'rgba(48,232,194,.69)',
  },
  userNameImage: {
    top:10,
    height:30,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  userNameTextInput: {
    flex: .85,
    height: 50,
    backgroundColor: 'transparent',
    color:'white',
    padding: 2,
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
    backgroundColor:'red',
    left: 0,
    top: 0,
    width: 100,
    height: 150,
  },
  eventMapView: {
    backgroundColor:'blue',
    right: 0,
    top: 0,
    width: 200,
    height: 100,
  },
})
