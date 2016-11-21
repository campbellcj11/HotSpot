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


export default class EventCell extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }
  render() {
    console.log('Event Info: ', this.props.eventInfo);
    console.log('Event Name: ', this.props.eventInfo.Event_Name);
    console.log('Event Image: ', this.props.eventInfo.Image);
    return(
      <TouchableHighlight style={this.props.style} onPress={(cellInfo) => this.props.cellPressed(this.props.eventInfo)}>
        <View style={styles.container}>
            <Image source={{uri: this.props.eventInfo.Image || ''}} style={styles.image}/>
            <View style={{flex:.5}}>
              <View style={{flex:.3,backgroundColor:'transparent'}}>
                <Text style={{paddingLeft:20,flex: this.props.large ? .05:.20,fontFamily:'Nexa Bold',fontSize:10}}>{this.props.eventInfo.Location}</Text>
                <Text style={{flex:.80,fontFamily:'Nexa Bold',fontSize:18,paddingLeft:20,color:'black'}}>{this.props.eventInfo.Event_Name}</Text>
              </View>
            </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    backgroundColor:'transparent',
    flex:.5,
    resizeMode: 'cover',
    margin: 20,
  },

})
