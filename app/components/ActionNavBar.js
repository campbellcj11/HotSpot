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
import backIcon from '../images/back.png'

export default class FeedNavBar extends Component {
  constructor(props){
    super(props);

    this.state = {
      userLocations: this.props.userLocations,
      hasCurrentLocation: this.props.currentLocation ? true : false,
      currentLocation: this.props.currentLocation,
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.userLocations != this.props.userLocations){
      this.setState({userLocations: nextProps.userLocations})
    }
    if(nextProps.currentLocation != this.props.currentLocation){
      this.setState({
        hasCurrentLocation: nextProps.currentLocation ? true : false,
        currentLocation: nextProps.currentLocation
      })
    }
  }
  renderLocationDots(){
    var arr = [];
    for(var i=0;i<this.props.userLocations.length;i++){
      var location = this.props.userLocations[i];
      var locationID = location.id;
      var locationName = location.name;
      var isActive = (this.state.currentLocation.id == locationID) ? true : false;
      arr.push(
        <View key={i} style={isActive ? styles.activeDot : styles.dot}/>
      )
    }
    return arr
  }
  render(){
    return(
      <View style={[styles.container,{height:this.props.height,paddingTop:this.props.paddingTop}]}>
        <View style={styles.leftViewHolder}>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => Actions.pop()} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
            <Text style={styles.leftButtonText}>{this.props.leftButtonText}</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.middleViewHolder}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <View style={styles.rightViewHolder}>
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.props.submitPressed()} hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}>
          <Text style={styles.rightButtonText}>{this.props.rightButtonText}</Text>
        </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: appStyleVariables.NAVIGATION_HEADER_BACKGROUND_COLOR,
    flexDirection: 'row',
  },
  leftViewHolder:{
    flex:.2,
    justifyContent:'center',
    marginLeft: 16,
  },
  middleViewHolder:{
    flex:.6,
    alignItems:'center',
    justifyContent:'center',
  },
  rightViewHolder:{
    flex:.2,
    justifyContent:'center',
    alignItems:'flex-end',
    marginRight: 16,
  },
  title:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 18,
    color: appColors.WHITE,
  },
  leftButtonText:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 14,
    color: appColors.ORANGE,
  },
  rightButtonText:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 14,
    color: appColors.GREEN,
  },
});
