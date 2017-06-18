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

import LinearGradient from 'react-native-linear-gradient';

import menuIcon from '../images/menu.png'

export default class LocationCell extends Component {
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
        <TouchableHighlight
          underlayColor={'transparent'}
          delayLongPress={250}
          {...this.props.sortHandlers}
        >
          <View style={{flexDirection:'row'}}>
              <Image style={styles.image} source={this.props.rowData.image} resizeMode={'cover'}>
                <LinearGradient colors={['#33333395', '#33333300']} style={styles.linearGradient}>
                  <Text style={styles.city}>{this.props.rowData.city}</Text>
                </LinearGradient>
              </Image>
            <View style={{width:(width-32)*.2,justifyContent:'center',alignItems:'center'}}>
              <Image style={{tintColor: appColors.DARK_GRAY}} source={menuIcon}/>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:16,
    marginVertical:8,
  },
  linearGradient: {
    height: 40,
    borderRadius: 4,
  },
  image:{
    width: (width-32)*.8,
    height: 96,
    borderRadius: 4,
  },
  city:{
    marginTop:8,
    marginLeft:8,
    marginRight:8,
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 24,
    color: appColors.WHITE,
  },
});
