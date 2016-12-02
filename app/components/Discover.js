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
import * as firebase from 'firebase';
var {height, width} = Dimensions.get('window');

const database = firebase.database();

import icon3 from '../images/search-icon.png'
const HEADER_HEIGHT = 64;
const TAB_HEIGHT = 50;

export default class Discover extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      tag:'',
      items: [],
      dataSource: ds,
    }
  }

  componentWillMount() {

  }

  renderRow(rowData){
    return (
      <TouchableHighlight
        underlayColor = '#dddddd'
        style = {styles.item}
      >
      <View style={styles.item}>
      <Image style={styles.item} source={{uri: rowData.Image}}>
        <View style={styles.fader}>
          <Text style={styles.itemText}>{rowData.Event_Name}</Text>
        </View>
        </Image>
      </View>
      </TouchableHighlight>
    )
  }

  renderEvent(tagEvents)
  {
    var items = [];
    var eventQuery = database.ref("events/");
    tagEvents.forEach((element) => {
      //console.log(element);
      eventQuery = database.ref("events/"+element);
      eventQuery.once('value',(snapshot) => {
        console.log("itExists"+element);
        console.log(snapshot.child("Image").exists());
        items.push({
          Key: element,
          Event_Name: snapshot.child("Event_Name").val(),
          Date: new Date(snapshot.child("Date").val()),
          Location: snapshot.child("Location").val(),
          Image: snapshot.child("Image").val(),
          Latitude: snapshot.child("Latitude").val(),
          Longitude:snapshot.child("Longitude").val(),
          Tags: snapshot.child("Tags").val(),
          Short_Description: snapshot.child("Short_Description").val(),
          Long_Description: snapshot.child("Long_Description").val(),
          Address: snapshot.child("Address").val(),
          Website: snapshot.child("Website").val(),
        });
     });
   });
   //console.log(items);
   this.setState({
     dataSource: this.state.dataSource.cloneWithRows(items),
     items: items,
   });
  }

  renderTag()
  {
     var index = 0;
     var tagEvents = [];
     var tag = this.state.tag;
     var tagQuery = database.ref("tags/"+tag).orderByKey();

     tagQuery.once("value", (snapshot) => {
         snapshot.forEach((childSnapshot) => {
           var key = childSnapshot.val();
           console.log("KEY: " + key + " Index: " + index);
           tagEvents[index] = key;
           index++;
         })
        this.renderEvent(tagEvents);
     });
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.searchView}>
          <Image source={icon3} style={{tintColor: '#a6a6a6',resizeMode: 'cover',margin: 5,width: 20, height: 20,}}/>
          <TextInput style={[styles.searchText, {textAlignVertical: 'center'}]}
                   placeholder='Search'
                   placeholderTextColor='#a6a6a6'
                   selectionColor='#000000'
                   onChangeText={(tag) => this.setState({tag})}
          >
          </TextInput>
          <Button
            style = {styles.searchButton}
            textStyle={styles.buttonText}
            onPress = {() => this.renderTag()}
          >
            Go
          </Button>
        </View>
        <View style={{flex:1}}>
          <ListView style={styles.scroll}
          contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow= {this.renderRow.bind(this)}>
          </ListView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: HEADER_HEIGHT,
  },
  searchView: {
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    margin: 5,
    borderRadius: 5,
    height:25,
  },
  searchText: {
    color: 'black',
    flex: 1,
    fontFamily: 'Futura-Medium',
  },
  buttonText: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Futura-Medium',
      height: 50,
      lineHeight: 50,
      backgroundColor: 'transparent',
  },
  searchButton: {
    backgroundColor: '#261851',
    flex: .20,
    borderColor: '#D200FF',
    height:25,
  },
  list: {
    // marginTop:10,
    // paddingTop:5,
    paddingBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap:'wrap',
  },
  item: {
    backgroundColor: '#CCC',
    width: width/3,
    height: 100,
    borderColor: '#D200FF',
  },
  fader: {
    backgroundColor: 'rgba(0,0,0,.6)',
    flex:1,
  },
  itemText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#48BBEC',
    fontSize: 15,
    fontFamily: 'Nexa Bold',
    padding: 2,
  },
    scroll: {
       flex: 1,
     },
})
