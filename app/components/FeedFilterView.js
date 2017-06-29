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

export default class FeedFilterView extends Component {
  constructor(props){
    super(props);
    this.state = {
      interests: this.props.interests,
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.interests != this.props.interests){
      this.setState({interests:nextProps.interests});
    }
  }
  render(){
    return(
      <View style={[styles.container,{height:this.props.height}]}>
        {/*<Text style={styles.title}>Show me...</Text>*/}
        <View style={styles.bottomHolder}>
          <TouchableHighlight underlayColor={'transparent'} style={styles.filterButton} onPress={() => Actions.feedInterestFilter()}>
            <Text style={styles.filterButtonText}>{ (this.state.interests && this.state.interests.length > 0) ? this.state.interests.length + ' interests' : 'All Interests'}</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} style={styles.filterButton} onPress={() => Actions.feedDateFilter()}>
            <Text style={styles.filterButtonText}>Dates</Text>
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
    marginVertical:8,
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
