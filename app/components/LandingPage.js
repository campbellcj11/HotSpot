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
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
var {height, width} = Dimensions.get('window');
import styleVariables from '../Utils/styleVariables'
import hsGraphic from '../imgs/HotSpot-Graphic.png'
import landingImage from '../imgs/Landing-Image.png'
import LinearGradient from 'react-native-linear-gradient'
import Swiper from 'react-native-swiper'

import LoginView from './LoginView'

export default class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignUp: false,
    }
  }

  componentWillMount() {

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
      <LoginView key={1} isSignUp={this.state.isSignUp} goBack={() => this.setToLanding()}/>
    )
  }
  renderView(){
    return(
      <View key={0} style={styles.container}>
        <Image source={landingImage} style={styles.backgroundImage}/>
        <LinearGradient
          start={{x: 0.0, y: 1.0}} end={{x: 0.0, y: 0.5}}
          locations={[0,1]}
          colors={['#0E476A', '#FFFFFF00']}
          style={{position:'absolute',left:0,right:0,top:0,bottom:0}}
        />
        <Image source={hsGraphic} style={styles.titleImage}/>
        <View>
          <View style={{flexDirection:'row',marginHorizontal:16}}>
          <Button
            onPress={() => this.setToLogin()}
            style={styles.actionButton}
            textStyle={styles.buttonText}
            underlayColor={'#F17C49'}
          >
            Sign in
          </Button>
          <Button
            onPress={() => this.setToSignup()}
            style={[styles.actionButton,{marginLeft:32}]}
            textStyle={styles.buttonText}
            underlayColor={'#F17C49'}
          >
            Sign up
          </Button>
          </View>
          <Button
            onPress={() => this._loginWithoutAccount()}
            style={styles.loginBlankButton}
            textStyle={styles.buttonBlankText}
          >
            Use without account
          </Button>
        </View>
      </View>
    )
  }
  render() {
    var Arr = [this.renderView(),this.renderLogin()];
    return(
      <Modal >
        <StatusBar barStyle="light-content"/>
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
    backgroundColor:'#0E476A',
    justifyContent:'flex-end',
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
    position:'absolute',
    top: height*.05,
    left: width*.2,
    right: width*.2,
    width: width*.6,
    height: 150,
    resizeMode: 'contain', // or 'stretch'
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
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 28,
  },
  loginBlankButton:{
    marginLeft:32,
    marginRight:32,
    marginBottom:40,
    marginTop:16,
  },
  buttonBlankText:{
    textAlign:'center',
    color:'white',
    fontFamily: styleVariables.systemFont,
    fontSize: 18,
  }
})
