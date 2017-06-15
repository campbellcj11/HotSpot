import React, { Component } from 'react';
import { appStyleVariables, appColors } from '../styles';
import {Actions} from 'react-native-router-flux'
import {
  ScrollView,
  ListView,
  View,
  TextInput,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
  StatusBar,
  RefreshControl,
  Dimensions,
} from 'react-native';

//images
import closeIcon from '../images/close.png'

export default class FeedMenu extends Component {
  constructor(props){
    super(props);

    this.state = {

    }
  }
  componentWillReceiveProps(nextProps){
  }
  render(){
    return(
      <View style={styles.container} opacity={.95}>
        <TouchableHighlight style={styles.closeButton} underlayColor={'transparent'} onPress={() => this.props.hideMenu()} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
          <Image source={closeIcon}/>
        </TouchableHighlight>
        <View style={styles.menuButtonsHolder}>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.profile();this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Profile</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.locations({userLocations: this.props.userLocations});this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Locations</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.interests();this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Interests</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.eventSuggestion();this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Event Suggestion</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.feedback();this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Feedback</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.legal();this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Legal</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.stats();this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Stats (admin only)</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'} onPress={() => {Actions.newEvent();this.props.hideMenu()}} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.menuButtonText}>Add Event (admin only)</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.menuButton} underlayColor={'transparent'}>
            <Text style={styles.menuButtonText}>Logout</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'#40435B'
  },
  closeButton:{
    position:'absolute',
    top: Platform.OS == 'ios' ? 36 : 16,
    left:18,
  },
  menuButtonsHolder:{
    flex:1,
    marginTop: Platform.OS == 'ios' ? 64 : 44,
    marginBottom: Platform.OS == 'ios' ? 64 : 44,
    alignItems:'center',
    justifyContent:'space-between',
  },
  menuButton:{

  },
  menuButtonText:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 18,
    color: appColors.WHITE,
  },
});
