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
    return(<View/>)
  }
}
