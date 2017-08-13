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
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
var {height, width} = Dimensions.get('window');
import { appStyleVariables, appColors } from '../styles';
import hsGraphic from '../images/HotSpot-Graphic.png'
import landingImage from '../images/Landing-Image.png'
import LinearGradient from 'react-native-linear-gradient'
import Swiper from 'react-native-swiper'

import LoginView from '../containers/LoginView'

class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignUp: false,
    }
  }
  loginWithoutAccount() {
    user = {'email': 'hsdemo@hsdemo.com',
            'password' : 'hsdemo1'};

    this.props.loginUser(user);
  }
  setToLanding(){
    this.refs.swiper.scrollBy(-1,true);
  }
  setToLogin(){
    this.setState({isSignUp: false},function(){
      this.refs.swiper.scrollBy(1,true);
    });
  }
  setToSignup(){
    this.setState({isSignUp: true},function(){
      this.refs.swiper.scrollBy(1,true);
    });
  }
  renderLogin(){
    return(
      <LoginView key={1} loginUser={(user) => {this.props.loginUser(user)}} isSignUp={this.state.isSignUp} signUpUser={(user,responseURI) => this.props.signUpUser(user,responseURI)} goBack={() => this.setToLanding()} possibleLocations={this.props.possibleLocations} getPossibleLocations={() => this.props.getPossibleLocations()}/>
    )
  }
  renderView(){
    return(
      <View key={0} style={styles.container}>
        <View style={{alignItems:'flex-end',marginRight:8,marginTop:4}}>
          <TouchableHighlight
            onPress={() => this.setToLogin()}
            style={styles.signInButton}
            underlayColor={'transparent'}
          >
            <Text style={styles.signInButtonText}>Have an account?</Text>
          </TouchableHighlight>
        </View>
        <View style={{alignItems:'center',marginHorizontal:16}}>
          <Image source={hsGraphic} style={styles.titleImage}/>
          <Text style={styles.description}> Welcome to HotSpot. Find all your big ticket and local experiences in one place.</Text>
        </View>
        <View style={{flex:1,justifyContent:'flex-end'}}>
          <Text style={styles.description}>Create your custom experience</Text>
          <TouchableHighlight
            onPress={() => this.setToSignup()}
            style={styles.signUpButton}
            underlayColor={'#111111'}
          >
            <Text style={styles.signUpButtonText}>Let's Get Started</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.loginWithoutAccount()}
            style={styles.loginBlankButton}
            underlayColor={'transparent'}
          >
            <Text style={styles.buttonBlankText}>Use as Guest</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  render() {
    var Arr = [this.renderView(),this.renderLogin()];
    return(
      <Modal >
        <StatusBar barStyle="light-content"/>
        <Image source={landingImage} style={styles.backgroundImage}/>
        <Swiper
          ref={'swiper'}
          loop={false}
          showsPagination={false}
          scrollEnabled={false}
        >
          {Arr}
        </Swiper>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'transparent',
    paddingTop:20,
  },
  backgroundImage:{
    position: 'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
    resizeMode:'cover',
  },
  titleImage: {
    // position:'absolute',
    // top: height*.05,
    // left: width*.2,
    // right: width*.2,
    // width: width*.6,
    height: 150,
    resizeMode: 'contain', // or 'stretch'
  },
  signInButton:{

  },
  signInButtonText:{
    textAlign:'center',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 18,
  },
  signUpButton:{
    height:66,
    borderWidth:1,
    borderColor: appColors.WHITE,
    marginHorizontal:32,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#000000',
  },
  signUpButtonText:{
    textAlign:'center',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 24,
  },
  description:{
    backgroundColor:'transparent',
    textAlign:'center',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 18,
    marginBottom:16,
  },
  actionButton:{
    flex:1,
    height:66,
    backgroundColor: '#F97237',
    borderWidth:1,
    borderColor:'#EE6436',
    borderRadius:33,
  },
  buttonText:{
    textAlign:'center',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 28,
  },
  loginBlankButton:{
    marginLeft:32,
    marginRight:32,
    marginBottom:16,
    marginTop:16,
  },
  buttonBlankText:{
    textAlign:'center',
    color:'white',
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 18,
  }
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    userLocations: state.user.userLocations,
    fetchedEvents: state.events.fetchedEvents,
    fetchedEventsHash: state.events.fetchedEventsHash,
    possibleLocations: state.app.possibleLocations ? state.app.possibleLocations : [],
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
