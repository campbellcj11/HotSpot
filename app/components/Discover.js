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
  ScrollView,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
var {height, width} = Dimensions.get('window');
import EventCell from './EventCell'

const database = firebase.database();

import icon3 from '../images/search-icon.png'
const HEADER_HEIGHT = 64;
const TAB_HEIGHT = 50;

export default class Discover extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      searchText:'',
      items: [],
      dataSource: ds,
    }
  }

  componentWillMount() {

  }
  pressRow(rowData) {
    console.log('RowData2: ',rowData);
    // this.setState({currentSelection:rowData});
    // this.setState({hasCurrentSelection:true});

    Actions.tab3_2({title:rowData.Event_Name,currentSelection:rowData});
  }

  renderSlides() {

    var eventCells = [];
    // console.warn(this.state.items.length);
    for(var i=0;i < this.state.items.length; i++)
    {
      var cellInfo = this.state.items[i];
    //   console.log('Cell Info ',i,': ',cellInfo);
      eventCells.push(
        <EventCell key={i} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.pressRow(cellInfo)} large={true} eventInfo={cellInfo} style={{marginBottom:8,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>
      );
    }

    return (eventCells)
  }

  renderEvent(tagEvents)
  {
    var items = [];
    var queryString = '/events/' + this.props.location;
    var eventQuery = database.ref(queryString);
    tagEvents.forEach((element) => {
      eventQuery = database.ref(queryString+'/'+element);
      eventQuery.once('value',(snapshot) => {
        // var tagsRef = this.getRef().child('tags/' + child.key);
        // console.log('Snapshot');
        // console.log(snapshot);
        var Tags = [];
        // // items = [];
        // tagsRef.on("value", (snapshot) => {
        //   snapshot.forEach((childUnder) => {
        //     Tags.push(childUnder.key);
        //   });
        var today = new Date();
        var timeUTC = today.getTime();
        if (snapshot.child("Date").val() >= timeUTC)
        {
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
            MainTag: this.state.searchText,
            Address: snapshot.child("Address").val(),
            Website: snapshot.child("Website").val(),
          });
        }
     });
   });
   console.warn('Items length: ',items.length);
   //sort by date
   var today = new Date();
   var timeUTC = today.getTime();
   items.sort(function(a, b){
     return a.Date-b.Date
   })

   //console.log(items);
   this.setState({
     dataSource: this.state.dataSource.cloneWithRows(items),
     items: items,
   });
  }

  getRef() {
    return firebase.database().ref();
  }

  renderTag()
  {
    var interests = ['Nightlife','Entertainment','Music','Food_Tasting','Family','Theater','Dining','Dance','Art','Fundraiser','Comedy','Festival','Sports','Class','Lecture','Fitness','Meetup','Workshop',];
    if(interests.indexOf(this.state.searchText) != -1)
    {
      var index = 0;
      var tagEvents = [];
      var tag = this.state.searchText;
      var tagQuery = database.ref("tags/").orderByKey();
      tagQuery.once("value", (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            var object = childSnapshot.val();
            if (Object.keys(object)[0] == this.state.searchText)
            {
              tagEvents[index] = childSnapshot.key;
            }
            index++;
          })
          console.warn('Tag Events: ',tagEvents.length);
         this.renderEvent(tagEvents);
      });
    }
    else
    {
      var today = new Date();
      var timeUTC = today.getTime();
      var items = [];
      // console.log("TIME UTC: " + timeUTC);
      var ref = this.getRef().child('events/' + this.state.searchText);
      ref.orderByChild("Date").startAt(timeUTC).limitToFirst(50).on('value', (snap) => {
        snap.forEach((child) => {
          var tagsRef = this.getRef().child('tags/' + child.key);
          var Tags = [];
          // items = [];
          tagsRef.on("value", (snapshot) => {
            snapshot.forEach((childUnder) => {
              Tags.push(childUnder.key);
            });
            // console.warn(child.val().City);
            // console.warn(this.state.city);
            if(this.state.searchText == '' || child.val().City == this.state.searchText)
            {
              // console.warn('State == city');
              // if(this.state.interests.length == 0 || this.state.interests.indexOf(Tags[0]) != -1)
              // {
                // console.warn('tag in interests');
                items.push({
                  Key : child.key,
                  Event_Name: child.val().Event_Name,
                  Date: new Date(child.val().Date),
                  Location: child.val().Location,
                  Image: child.val().Image,
                  latitude: child.val().Latitude,
                  longitude: child.val().Longitude,
                  Tags: child.val().Tags,
                  Short_Description: child.val().Short_Description,
                  Long_Description: child.val().Long_Description,
                  Address: child.val().Address,
                  Website: child.val().Website,
                  MainTag: Tags ? Tags[0]:[],
                  Event_Contact: child.val().Email_Contact,
                  City: child.val().City,
                });
              // }
              // console.log('ITLs: ',items.length);
              // console.log('ITs: ',items);
              clearTimeout(this.loadTimeout);
              this.loadTimeout = setTimeout(() => {this.setState({dataSource: this.state.dataSource.cloneWithRows(items),items: items}), 250});
            }
          });
        });
      });
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.searchView}>
          <Image source={icon3} style={{tintColor: '#a6a6a6',resizeMode: 'cover',width: 20, height: 20, marginLeft:2, marginRight:2}}/>
          <TextInput style={[styles.searchText, {textAlignVertical: 'center'}]}
                   placeholder='Search'
                   placeholderTextColor='#a6a6a6'
                   selectionColor='#000000'
                   onChangeText={(tag) => this.setState({searchText: tag})}
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
        <View>
          <ScrollView ref='swiper' style={{height:height-HEADER_HEIGHT-TAB_HEIGHT-25,width:width,backgroundColor:'#E2E2E2'}}>
              {this.renderSlides()}
          </ScrollView>
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
    margin: 3,
    height:25,
    alignItems:'center',
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
    backgroundColor: '#F97237',
    flex: .20,
    height:25,
  },
})
