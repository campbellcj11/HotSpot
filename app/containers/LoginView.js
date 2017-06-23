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
import Button from '../components/Button'
import { Actions } from 'react-native-router-flux';
var {height, width} = Dimensions.get('window');
import { appStyleVariables, appColors } from '../styles';
import backArrow from '../images/back.png'
import hsGraphic from '../images/HotSpot-Graphic.png'
// import SocialAuth from 'react-native-social-auth';

import SignupView from './SignupView'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signupIndex:0,
      email: '',
      password: '',
      credentials: null,
      error: '',
    }
  }

  componentWillMount() {

  }
  updateIndex(newIndex){
    this.setState({signupIndex:newIndex});
  }
  login(){
    var user = {'email': this.state.email,
                'password' : this.state.password};

    this.props.loginUser(user);
  }
  loginWithFacebook()
  {
    //   SocialAuth.setFacebookApp({id: '1738197196497592', name: 'projectnow'});
    //   SocialAuth.getFacebookCredentials(["email", "public_profile"],
    //   SocialAuth.facebookPermissionsType.read).then((credentials) => {
    //   this.setState({
    //     error: null,
    //     credentials,
    //   })
    //   console.log(this.state.credentials);
    //   this._initFacebookUser(this.state.credentials.accessToken)
    // })
    // .catch((error) => {
    //   this.setState({
    //     error,
    //     credentials: null,
    //   })
    // })
  }

  _initFacebookUser(token)
  {
    var user;
    console.log("Fetching data");
    fetch('https://graph.facebook.com/v2.6/me?fields=first_name,last_name,picture,email,locale,timezone,gender&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {
      // Some user object has been set up somewhere, build that user here
      user = {'email': json.email,
              'password' : json.id};

      this.props.loginUser(user);
    })
    .catch(() => {
      console.log('ERROR GETTING DATA FROM FACEBOOK')
    })
    console.log(user);
  }
  resetPassword(){
    this.props.resetPassword(this.state.email);
  }
  goBack(){
    if(this.props.isSignUp)
    {
      if(this.state.signupIndex == 0){
        this.props.goBack();
        // this.refs.signupView.resetSignupState();
      }
      else{
        this.refs.signupView.goBack();
      }
    }
    else
    {
      this.props.goBack();
    }

  }
  renderLogin(){
    var loginButtonText = this.state.isSignUp ? 'Sign Up' : 'Login';
    var signUpButtonText = this.state.isSignUp ? 'Login' : 'Sign Up';
    var loginWithoutAccountButtonText = this.state.isSignUp ? '' : 'Login without an Account';
    var forgotPasswordButtonText = this.state.isSignUp ? '' : 'Forgot Password?';
    var loginWithFacebookButtonText = this.state.isSignUp ? 'Signup with Facebook' : 'Login with Facebook';
    var loginWithTwitterButtonText = this.state.isSignUp ? 'Signup with Twitter' : 'Login with Twitter';
    var loginWithGoogleButtonText = this.state.isSignUp ? 'Signup with Google' : 'Login with Google';
    return(
      <View>
      <View style={styles.userNameView}>
        <TextInput style={styles.userNameTextInput}
          ref='email'
          onChangeText={(email) => this.setState({email})}
          placeholder='Email'
          placeholderTextColor='#C6E1E2'
          underlineColorAndroid='transparent'>
        </TextInput>
      </View>

      <View style={styles.passwordView}>
        <TextInput style={styles.userNameTextInput}
          secureTextEntry={!this.state.isSignUp}
          ref='password'
          onChangeText={(password) => this.setState({password})}
          placeholder='Password'
          placeholderTextColor='#C6E1E2'
          underlineColorAndroid='transparent'>
        </TextInput>
      </View>
      <Button
        onPress={() => this.resetPassword()}
        style={styles.forgotPasswordBlankButton}
        textStyle={styles.forgotPasswordText}>
        {forgotPasswordButtonText}
      </Button>
      <Button
        onPress={() => this.login()}
        style={styles.loginButton}
        textStyle={styles.buttonText}>
        {loginButtonText}
      </Button>
      <Button
        onPress={() => this.loginWithFacebook()}
        style={styles.blankButton}
        textStyle={styles.buttonBlankText}>
        {loginWithFacebookButtonText}
      </Button>
        </View>
    )
  }
  renderSignup(){
    return(
      <SignupView ref={'signupView'} updateIndex={(newIndex) => this.updateIndex(newIndex)} signUp={(user,responseURI) => this.props.signUpUser(user,responseURI)}/>
    )
  }
  render() {
    var viewToShow = this.props.isSignUp ? this.renderSignup() : this.renderLogin();
    var title = this.props.isSignUp ? 'Sign up' : 'Sign in';
    return(
      <View style={styles.container}>
        <View ref={'topBar'} style={styles.topBar}>
          <View style={{flex:.3}}>
            <TouchableHighlight onPress={() => this.goBack()} underlayColor={'transparent'}>
              <View style={{flexDirection:'row',alignItems:'center',marginLeft:4}}>
                <Image source={backArrow} style={{width:12,height:12,resizeMode:'contain'}}/>
                <Text style={{color:'white',fontFamily:appStyleVariables.SYSTEM_FONT,fontSize:14}}>Back</Text>
              </View>
            </TouchableHighlight>
          </View>
          <Text style={{flex:.4,textAlign:'center',color:'white',fontFamily:appStyleVariables.SYSTEM_BOLD_FONT,fontSize:24}}>{title}</Text>
          <View style={{flex:.3}}>
          </View>
        </View>
        <Image source={hsGraphic} style={styles.titleImage}/>
        <View style={{flex:1,paddingTop:130}}>
        {viewToShow}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#0E476A',
  },
  topBar:{
    paddingTop:20,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  titleImage: {
    position:'absolute',
    top: height*.05,
    left: width*.2,
    right: width*.2,
    width: width*.6,
    height: 150,
    resizeMode: 'contain', // or 'stretch'
  },
  userNameView: {
    backgroundColor:'#0D5480',
    height: 44,
    marginLeft:32,
    marginRight: 32,
    flexDirection: 'row',
    marginBottom: 15,
  },
  passwordView: {
    backgroundColor:'#0D5480',
    height: 44,
    marginLeft:32,
    marginRight: 32,
    flexDirection: 'row',
    marginBottom: 5,
  },
  userNameTextInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_FONT,
    padding: 2,
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: '#414E5E',
  },
  loginButton: {
    marginTop: 5,
    backgroundColor: '#F97237',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#EE6436',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordBlankButton: {
    backgroundColor: 'transparent',
    height: 30,
    marginLeft: 32,
    marginRight: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: appStyleVariables.SYSTEM_FONT,
  },
  facebookLogin: {
    marginTop: 5,
    backgroundColor: '#3B5998',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#3B5998',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookLoginText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    backgroundColor: 'transparent',
  },
  buttonBlankText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: appStyleVariables.SYSTEM_FONT,
  },
  blankButton:{
    marginLeft:32,
    marginRight:32,
    marginTop:8,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: appStyleVariables.SYSTEM_FONT,
    backgroundColor: 'transparent',
  },
})
