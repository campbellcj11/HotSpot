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

export default class UserLocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      initialLatitude : 'unknown',
      initialLongitude: 'unknown',
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      lastLatitude: 'unknown',
      lastLongitude: 'unknown',
    }
  }
  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("position! " + position);

        var initialPosition = JSON.stringify(position);//serializes object into string
        this.setState({
          initialLatitude: position.coords.latitude,
          initialLongitude: position.coords.longitude,
          initialPosition,
        })
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({
        lastPosition,
        lastLatitude: position.coords.latitude,
        lastLongitude: position.coords.longitude,
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    let initialPosition, lastPosition;
    initialPosition = this.state.initialPosition;
    lastPosition = this.state.lastPosition;
    return(
      <View style={styles.container}>
      <View>
        <Text style = {styles.location}>
          <Text>Initial latitude: </Text>
          {this.state.initialLatitude}
          </Text>
          <Text style = {styles.location}>
            <Text>Initial longitude: </Text>
            {this.state.initialLongitude}
          </Text>
          <Text style = {styles.location}>
            <Text>Last latitude: </Text>
            {this.state.lastLatitude}
          </Text>
          <Text style = {styles.location}>
            <Text>Last longitude: </Text>
            {this.state.lastLongitude}
          </Text>
      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    color: 'white',
    backgroundColor: 'transparent',
  }
})
