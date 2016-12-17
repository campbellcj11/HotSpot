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
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
var {height, width} = Dimensions.get('window');


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
         <LinearGradient colors={['#095AA8', '#04FFC0']} style={styles.linearGradient}>
         <Image source={backgroundImage} style={styles.backgroundImage}/>
           <View>
             <Text style={styles.Title}> {this.props.user.First_Name}{" "}{this.props.user.Last_Name} </Text>
           </View>
           <View>
             <Image source={{uri: this.props.user.Image || ''}} style={styles.userImage}/>
           </View>
        </LinearGradient>
      </View>
     )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    top: height*.6,
    height: height*.45,
    resizeMode: 'stretch', // or 'stretch'
  },
  userImage: {
    position: 'absolute',
    width: width,
    top: 20,
    height: 200,
    resizeMode: 'contain', // or 'stretch'
    justifyContent: 'center',
    borderRadius: 100/2,
  },
  Title: {
    color: 'white',
    backgroundColor: 'transparent',
    top: 280,
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

})
