import React, { Component } from 'react';
import { appStyleVariables, appColors } from '../styles';
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

export default class FeedFilterView extends Component {
  constructor(props){
    super(props);

    this.state = {

    }
  }
  componentWillReceiveProps(nextProps){

  }
  render(){
    return(
      <View style={[styles.container,{height:this.props.height}]}>
        <Text style={styles.title}>Show me...</Text>
        <View style={styles.bottomHolder}>
          <TouchableHighlight style={styles.filterButton}>
            <Text style={styles.filterButtonText}>All Interests</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.filterButton}>
            <Text style={styles.filterButtonText}>All Dates</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.filterButton}>
            <Text style={styles.filterButtonText}>All Events</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: appStyleVariables.NAVIGATION_HEADER_BACKGROUND_COLOR,
    alignItems:'center',
  },
  title:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 18,
    color: appColors.WHITE,
    marginVertical:16,
  },
  bottomHolder:{
    flexDirection:'row',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  filterButton:{
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF10',
    borderColor: appColors.WHITE,
    borderWidth: 1,
    borderRadius: 4,
  },
  filterButtonText:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 14,
    color: appColors.WHITE,
    marginVertical:8,
    marginHorizontal:16,
  }
});
