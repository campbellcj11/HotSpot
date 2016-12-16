import React, { Component } from 'react'
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import backgroundImage from '../images/City-Dark.png'
import * as firebase from 'firebase';
import UserLocation from './UserLocation';
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
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
var {height, width} = Dimensions.get('window');
const HEADER_HEIGHT = 64;
const TAB_HEIGHT = 50;
const CARD_WIDTH = width;
const CARD_HEIGHT = height - HEADER_HEIGHT - TAB_HEIGHT;

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {

  }

  render() {
    return(
       <View style={styles.container}>
         <LinearGradient colors={['#3023AE', '#C86DD7']} style={styles.linearGradient}>
         <Image source={backgroundImage} style={styles.backgroundImage}/>
          <View style={styles.profileContainer}>
            <View style={{flex:1, borderBottomWidth:2, borderBottomColor:'black'}}>
              <View style={styles.userName}>
                <Text style={styles.Title}> {this.props.user.First_Name}{" "}{this.props.user.Last_Name} </Text>
              </View>
              <View style={{flex:1, paddingBottom:100}}>
                <Image source={{uri: this.props.user.Image || ''}} style={styles.userImage}/>
              </View>
            </View>
            <View style={{flex:1}}>
              <UserLocation />
            </View>
          </View>
        </LinearGradient>
      </View>
     )
  }
}
const styles = StyleSheet.create({
  profileContainer: {
    marginTop: HEADER_HEIGHT,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    marginBottom: TAB_HEIGHT,
    flex: 1,
    flexDirection: 'column',
    borderColor: 'black',
    borderWidth: 5,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    top: height*.6,
    height: height*.45,
    resizeMode: 'stretch', // or 'stretch'
  },
  userImage: {
    flex:1,
    position: 'absolute',
    width: width,
    //top: 20,
    height: 150,
    resizeMode: 'contain', // or 'stretch'
    justifyContent: 'center',
    borderRadius: 100/2,
  },
  Title: {
    color: 'white',
    backgroundColor: 'transparent',
    //top: 280,
    height: 55,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 36,
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
  userName: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
