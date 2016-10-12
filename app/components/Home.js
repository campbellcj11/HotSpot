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
} from 'react-native'
import Button from './Button'
import { Actions } from 'react-native-router-flux';
import backgroundImage from '../images/city.jpeg'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import LinearGradient from 'react-native-linear-gradient';
var {height, width} = Dimensions.get('window');

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email:'',
      password:'',
    }
  }

  componentWillMount() {

  }

  _login(){
    //hardcoded for prototype
    var user = {'email': this.state.email,
                'password' : this.state.password};
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

    return (
      <View>
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
                  placeholder='email'>
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
                  placeholder='password'>
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

        <View style={styles.container}>
          <LinearGradient colors={['#30404F', '#22B1C5']} style={styles.linearGradient}>
          </LinearGradient>
          {readonlyMessage}
          <Button
            onPress={() => this._logout()}
            style={styles.logoutButton}
            textStyle={styles.buttonText}>
            Logout
          </Button>
          <View style={styles.bottomBar}>

          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
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
    top: 200,
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
    opacity: .57,
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
    marginLeft: 50,
    marginRight: 50,
  },
  logoutButton: {
    top: 100,
    backgroundColor: '#D73C54',
    height: 50,
    marginLeft: 50,
    marginRight: 50,
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
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor:'yellow',
  },
})
