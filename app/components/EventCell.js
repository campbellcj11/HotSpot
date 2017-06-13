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
var {width,height} = Dimensions.get('window');

import testImage from '../images/gal_01.png'

export default class EventCell extends Component {
  constructor(props){
    super(props);

    this.state = {

    }
  }
  componentWillReceiveProps(nextProps){

  }
  render(){
    return(
      <View style={styles.container}>
        <TouchableHighlight key={this.props.rowData.id}>
          <View style={{overflow: 'hidden',borderTopLeftRadius:4,borderTopRightRadius:4,}}>
            <Image style={styles.eventImage} source={testImage} resizeMode={'cover'}/>
            <View style={{flexDirection:'row',marginVertical:4,marginHorizontal:8}}>
              <View style={styles.leftView}>
                <Text style={styles.title}>{this.props.rowData.title}</Text>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.time}>{this.props.rowData.startTime}</Text>
                  <Text style={styles.location}> - {this.props.rowData.location}</Text>
                </View>
                <Text style={styles.shortDescription}>{this.props.rowData.shortDescription}</Text>
              </View>
              <View style={styles.rightView}>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: appColors.WHITE,
    margin:8,
    borderRadius:4,
  },
  eventImage: {
    height:128,
    width:width-16,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
  },
  leftView:{
    flex:.7,
    borderRightWidth:1,
    borderRightColor:appColors.GRAY,
  },
  rightView:{
    flex:.3,
  },
  title:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 24,
    color: appColors.BLACK,
    marginBottom:2,
  },
  time:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 12,
    color: appColors.BLACK,
  },
  location:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 12,
    color: appColors.BLACK,
  },
  shortDescription:{
    fontFamily: appStyleVariables.SYSTEM_LIGHT_FONT,
    fontSize: 14,
    color: appColors.DARK_GRAY,
    marginVertical:8,
  }
});
