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
import styleVariables from '../Utils/styleVariables'


const database = firebase.database();

import icon3 from '../images/search-icon.png'
const HEADER_HEIGHT = styleVariables.titleBarHeight
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
    this.loadEvents(this.props.location)
  }

  componentWillMount() {
    if (!this.eventsInLocale && this.props.location) {
      this.loadEvents(this.props.location)
    }
  }

  loadEvents(locale) {
    database.ref('events/' + locale)
      .orderByChild('Date')
      .on('value', (snapshot) => {
          let eventArray = []
          snapshot.forEach((child) => {
            let event = child.val()
            event.key = child.key
            eventArray.push(event)
          })
          this.eventsInLocale = eventArray
          //console.warn('Loaded ' + this.eventsInLocale.length + ' events')
      })
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
     items: items
   });
  }

  getRef() {
    return firebase.database().ref();
  }

  // execute simple case insensitive search on all event fields for all events in current locale
  search()
  {
    if (!this.state.searchText || !this.eventsInLocale) {
      return
    }
    // perform search
    let matches = []
    let query = new RegExp(this.state.searchText, 'i')
    this.eventsInLocale.forEach(function(event, index) {
      for (key in event) {
        if (query.test(event[key])) {
          matches.push(event)
          return
        }
      }
    })
    //console.warn('Found ' + matches.length + ' matches')
    // populate item array with match data + tags
    let items = []
    let matchIndex = matches.length
    this.addMatchesWithTags(items, matches, 0, (items) => {
      // set data for scroll view
      clearTimeout(this.loadTimeout)
      this.loadTimeout = setTimeout(() => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items),
          items: items
        })
      }, 250)
    })
  }

  // asynchronously add tags to matches before setting datasource
  addMatchesWithTags(items, matches, index, callback) {
    if (index == matches.length) {
      callback(items)
      return
    }
    let match = matches[index]
    getTags.call(this, match.key, (tags) => {
      items.push({
        Key : match.key,
        Event_Name: match.Event_Name,
        Date: new Date(match.Date),
        Location: match.Location,
        Image: match.Image,
        latitude: match.Latitude,
        longitude: match.Longitude,
        Tags: tags,
        Short_Description: match.Short_Description,
        Long_Description: match.Long_Description,
        Address: match.Address,
        Website: match.Website,
        MainTag: tags.length ? tags[0] : '',
        Event_Contact: match.Email_Contact,
        City: match.City,
      })
      this.addMatchesWithTags(items, matches, ++index, callback)
    })
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.searchView}>
          <Image source={icon3} style={styles.searchBarImage}/>
          <TextInput style={[styles.searchText, {textAlignVertical: 'center'}]}
                   placeholder='Search'
                   placeholderTextColor='#a6a6a6'
                   selectionColor='#000000'
                   onChangeText={(query) => this.setState({searchText: query})}
          >
          </TextInput>
          <Button
            style = {styles.searchButton}
            textStyle={styles.buttonText}
            onPress = {() => this.search()}
          >
            Go
          </Button>
        </View>
        <View>
          <ScrollView ref='swiper' style={styles.swiper}>
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
    backgroundColor: '#fff',
    margin: 1,
    height: 35,
    alignItems:'center'
  },
  searchText: {
    color: 'black',
    fontSize: 16,
    flex: 1,
    fontFamily: styleVariables.systemRegularFont,
    padding: 0
  },
  buttonText: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      fontFamily: styleVariables.systemRegularFont,
      backgroundColor: 'transparent',
      padding: 0
  },
  searchButton: {
    backgroundColor: '#0E476A',
    flex: .20,
    height: 35,
    borderRadius: 3
  },
  searchBarImage: {
    tintColor: '#a6a6a6',
    resizeMode: 'cover',
    width: 20,
    height: 20,
    marginLeft: 2,
    marginRight: 2
  },
  swiper: {
    height: height - HEADER_HEIGHT - TAB_HEIGHT - 25,
    width: width,
    backgroundColor: '#E2E2E2'
  }
})

// TODO move to eventActions
function getTags(eventId, callback) {
  let ref = database.ref('tags/' + eventId)
  ref.on('value', (snapshot) => {
    let tags = []
    snapshot.forEach(child => {
      tags.push(child.key)
    })
    callback(tags, eventId, ref)
  })
}