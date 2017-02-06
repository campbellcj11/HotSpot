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
import EventCell from './EventCell'
var {height, width} = Dimensions.get('window');


export default class EventPage extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }
  render3PageLayout()
  {
    return(
      <View style={this.props.style}>
        <EventCell key={0} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.props.cellPressed(cellInfo)} large={true} eventInfo={this.props.eventsForPage.length >= 1 ? this.props.eventsForPage[0]: {}} style={{width:this.props.width,height:this.props.height*.66,borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>

        <View style={{flexDirection:'row',width:this.props.width,height:this.props.height*.34}}>
          <EventCell key={1} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.props.cellPressed(cellInfo)} large={false} eventInfo={this.props.eventsForPage.length >= 2 ? this.props.eventsForPage[1]: {}} style={{width:this.props.width*.5,borderRightWidth:1,borderRightColor:'#EEEEEE',borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>

          <EventCell key={2} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.props.cellPressed(cellInfo)} large={false} eventInfo={this.props.eventsForPage.length >= 3 ? this.props.eventsForPage[2]: {}} style={{width:this.props.width*.5,borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>
        </View>
      </View>
    )
  }
  render2PageLayout()
  {
    return(
      <View style={this.props.style}>
        <EventCell key={0} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.props.cellPressed(cellInfo)} large={true} eventInfo={this.props.eventsForPage.length >= 1 ? this.props.eventsForPage[0]: {}} style={{width:this.props.width,height:this.props.height*.5,borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>

        <View style={{flexDirection:'row',width:this.props.width,height:this.props.height*.5}}>
          <EventCell key={1} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.props.cellPressed(cellInfo)} large={true} eventInfo={this.props.eventsForPage.length >= 2 ? this.props.eventsForPage[1]: {}} style={{width:this.props.width,borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>
        </View>
      </View>
    )
  }
  render1PageLayout()
  {
    return(
      <View style={this.props.style}>
        <EventCell key={0} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.props.cellPressed(cellInfo)} large={true} eventInfo={this.props.eventsForPage.length >= 1 ? this.props.eventsForPage[0]: {}} style={{width:this.props.width,height:this.props.height,borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>
      </View>
    )
  }
  render() {
    var viewToShow;
    if(this.props.eventsPerPage == 3)
    {
      viewToShow = this.render3PageLayout();
    }
    else if(this.props.eventsPerPage == 2)
    {
      viewToShow = this.render2PageLayout();
    }
    else
    {
      viewToShow = this.render1PageLayout();
    }
    return(
      viewToShow
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
