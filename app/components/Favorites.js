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
  Platform,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import backgroundImage from '../images/City-Dark.png'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import logoutImage from '../images/arrows.png'
import searchImage from '../images/magnifying-glass.png'
import LinearGradient from 'react-native-linear-gradient';
var {width,height} = Dimensions.get('window');
import * as firebase from 'firebase';
import EventCard from './EventCard'
import EventPage from './EventPage'
import EventCell from './EventCell'
import Swiper from 'react-native-swiper';

const HEADER_HEIGHT = Platform.OS == 'ios' ? 64 : 44;
const TAB_HEIGHT = 50;
const CARD_WIDTH = width;
const CARD_HEIGHT = height - HEADER_HEIGHT - TAB_HEIGHT;


export default class Favorites extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      email:'',
      password:'',
      currentSelection:{},
      hasCurrentSelection: false,
      transparent: true,
      dataSource:ds,
      viewAll: false,
      viewPast: false,
      items: [],
    }
    this.itemsRef = this.getRef().child('favorites/' + firebase.auth().currentUser.uid);
    this.currentIndex = 0;
  }

  componentWillMount() {
    this.listenForItems(this.itemsRef);
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      var eventUIDs = [];
      snap.forEach((child) => {
        var wholeString = child.val()
        var thisCity = wholeString.substring(0,(wholeString.indexOf('/')));
        var thisKey = wholeString.substring((wholeString.indexOf('/') + 1));
        console.log("Current City: " + thisCity + "::thisKey:: " + thisKey);
        eventUIDs.push({
          Key : thisKey,
          City : thisCity,
        });
      });

      for (events in eventUIDs)
      {
        console.log("event UID: " + eventUIDs[events].Key);
        var ref = this.getRef().child('events/' + eventUIDs[events].City + '/' + eventUIDs[events].Key + '/');
        var tagsRef = this.getRef().child('tags/' + eventUIDs[events].Key);
        var Tags = [];
        tagsRef.on("value", (snapshot) => {
          snapshot.forEach((childUnder) => {
            Tags.push(childUnder.key);
          });
          ref.on('value', (snap) => {
            var today = new Date();
            var timeUTC = today.getTime();
            // console.log("Error date: " + snap.val().Date);
            // console.log("Key error: " + snap.key);
          if (snap.val().Date >= timeUTC && !this.state.viewAll && !this.state.viewPast) {
              items.push({
                Key : snap.key,
                Event_Name: snap.val().Event_Name,
                Date: new Date(snap.val().Date),
                Location: snap.val().Location,
                City: snap.val().City,
                Image: snap.val().Image,
                latitude: snap.val().Latitude,
                longitude: snap.val().Longitude,
                Tags: snap.val().Tags,
                Short_Description: snap.val().Short_Description,
                Long_Description: snap.val().Long_Description,
                Address: snap.val().Address,
                Website: snap.val().Website,
                MainTag: Tags ? Tags[0]:[],
              });
            }//If we want to look at only past events
            else if (snap.val().Date <= timeUTC && this.state.viewPast) {
                items.push({
                  Key : snap.key,
                  Event_Name: snap.val().Event_Name,
                  Date: new Date(snap.val().Date),
                  Location: snap.val().Location,
                  City: snap.val().City,
                  Image: snap.val().Image,
                  latitude: snap.val().Latitude,
                  longitude: snap.val().Longitude,
                  Tags: snap.val().Tags,
                  Short_Description: snap.val().Short_Description,
                  Long_Description: snap.val().Long_Description,
                  Address: snap.val().Address,
                  Website: snap.val().Website,
                  MainTag: Tags ? Tags[0]:[],
                });
              }//if we want to look at all events
              else if (this.state.viewAll) {
                  items.push({
                    Key : snap.key,
                    Event_Name: snap.val().Event_Name,
                    Date: new Date(snap.val().Date),
                    Location: snap.val().Location,
                    City: snap.val().City,
                    Image: snap.val().Image,
                    latitude: snap.val().Latitude,
                    longitude: snap.val().Longitude,
                    Tags: snap.val().Tags,
                    Short_Description: snap.val().Short_Description,
                    Long_Description: snap.val().Long_Description,
                    Address: snap.val().Address,
                    Website: snap.val().Website,
                    MainTag: Tags ? Tags[0]:[],
                  });
              }
          });
        });
      }

      //sort by date
      var today = new Date();
      var timeUTC = today.getTime();
      items.sort(function(a, b){
        return a.Date-b.Date
      })

      /**
      //sort by alphabetical order
      var today = new Date();
      var timeUTC = today.getTime();
      items.sort(function(a, b) {
      var textA = a.Event_Name.toUpperCase();
      var textB = b.Event_Name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
**/

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items),
        items: items,
      });

    });
  }

  _closeSelection(){
    this.setState({currentSelection:{}});
    this.setState({hasCurrentSelection:false});
  }
  pressRow(rowData) {
    console.log('RowData2: ',rowData);
    //this.setState({currentSelection:rowData});
    //this.setState({hasCurrentSelection:true});
    Actions.tab2_2({title:rowData.Event_Name,currentSelection:rowData});
  }

  renderRow(rowData){
    var dateNumber;
    var dateMonth;
    var dateYear;

    var months = new Array();
    months[0] = "January";
    months[1] = "February";
    months[2] = "March";
    months[3] = "April";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "August";
    months[8] = "September";
    months[9] = "October";
    months[10] = "November";
    months[11] = "December";

    dateMonth = rowData.Date ? months[rowData.Date.getMonth()]: '';
    dateNumber = rowData.Date ? rowData.Date.getDate(): '';
    dateYear = rowData.Date ? rowData.Date.getUTCFullYear(): '';

    var dateString = dateMonth + ' ' + dateNumber + ', ' + dateYear;
    return (
      <EventCell partOfFavorites={true} cellPressed={(rowData) => this.pressRow(rowData)} large={true} eventInfo={rowData} style={{marginBottom:8,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>
      // <TouchableHighlight
      //   underlayColor = '#dddddd'
      //   style = {styles.item}
      //   onPress = {() => this.pressRow(rowData)}
      // >
      // <View style={styles.item}>
      // <View style={{flex:.85}}>
      //     <View style={{flex:.75}}>
      //       <Text style={styles.itemTitle}>{rowData.Event_Name}</Text>
      //       <Text numberOfLines={2} style={styles.itemText}>{rowData.Short_Description}</Text>
      //     </View>
      //     <View style={{marginLeft:5,flex:.25,justifyContent:'center'}}>
      //       <Text numberOfLines={1} style={{color:'#261851',fontSize: 14,fontFamily: 'Futura-Medium'}}>{dateString}</Text>
      //     </View>
      // </View>
      // <View style={{flex:.15}}>
      //   <Image style={{flex:1,resizeMode:'cover'}} source={{uri: rowData.Image}}>
      //   </Image>
      // </View>
      // </View>
      // </TouchableHighlight>
    )
  }
  renderSlides() {

    var eventCells = [];

    for(var i=0;i < this.state.items.length; i++)
    {
      var cellInfo = this.state.items[i];
      // console.log('Cell Info ',i,': ',cellInfo);
      eventCells.push(
        <EventCell key={i} partOfFavorites={this.props.partOfFavorites} cellPressed={(cellInfo) => this.pressRow(cellInfo)} large={true} eventInfo={cellInfo} style={{marginBottom:8,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#EEEEEE'}}/>
      );
    }
    return eventCells;
  }
  viewWithFavorites()
  {
    return(
      <View style={styles.container}>
        <ScrollView ref='swiper' style={{height:height,width:width,backgroundColor:'#E2E2E2'}}>
            {this.renderSlides()}
        </ScrollView>
      </View>
      // <View style={styles.container}>
      //   <View>
      //     <ListView style={styles.scroll}
      //       contentContainerStyle={styles.list}
      //       dataSource={this.state.dataSource}
      //       renderRow= {this.renderRow.bind(this)}>
      //     </ListView>
      //   </View>
      // </View>
    )
  }
  viewWithoutFavorites()
  {
    return (
      <View style={styles.container}>
        <Text style={{textAlign:'center',fontFamily:'Futura-Medium',fontSize:15,flex:1}}> Login or Signup to save/view favorites </Text>
      </View>
    );
  }
  render() {
    console.log('PROPS!')
    console.log(this.props)
    let user, readonlyMessage
    if(this.props.loggedIn && this.props.user != {})
    {
      user = this.props.user
      readonlyMessage = <Text style={styles.offline}>Logged In {user.email}</Text>
    }
    else
    {
      readonlyMessage = <Text style={styles.offline}>Not Logged In</Text>
    }

    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff'}
      : null;
    return (
      (firebase.auth().currentUser.email != 'test@test.com') ? this.viewWithFavorites() : this.viewWithoutFavorites()
    )
  }
}

const styles = StyleSheet.create({
  container: {
    top: Platform.OS == 'ios' ? 64:44,
    height: height - (Platform.OS == 'ios' ? 64:44) - 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  innerContainer: {

  },
  list: {
    marginTop: 20,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    backgroundColor: '#CCC',
    width: width/3,
    height: 100,
  },
  fader: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  itemText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#48BBEC',
    fontSize: 15,
    fontFamily: 'Futura-Medium',
    padding: 2,
  },
  offline: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  modalButton: {
    margin: 10,
    backgroundColor: 'rgb(56,198,95)',
    height: 50,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    top: height*.6,
    height: height*.45,
    resizeMode: 'stretch', // or 'stretch'
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  loginButton: {
    top: 100,
    backgroundColor: '#C123E2',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#D200FF',
  },
  loginBlankButton: {
    top: 100,
    backgroundColor: 'transparent',
    height: 50,
    marginLeft: width*.2,
    marginRight: width*.2,
  },
  buttonBlankText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    height: 50,
    lineHeight: 50,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height*.1,
    backgroundColor:'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bottomBarButton: {
    backgroundColor: 'transparent',
    height: height*.1,
    width: height*.1,
    flex:1,
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
  title: {
    color: 'white',
    backgroundColor: 'transparent',
    top: 55,
    height: 55,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 36,
  },
  userNameView: {
    backgroundColor:'#7148BC22',
    height: 50,
    top: 100,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 15,
  },
  userNameTextInput: {
    flex: .85,
    height: 50,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: 'Futura-Medium',
    padding: 2,
    paddingLeft: 10,
    borderWidth: 2,
    borderColor: '#B166CE22',
  },
  scroll: {
    flex: 1,
    backgroundColor:'#E2E2E2',
  },
  rowContainer: {
    flexDirection: 'row',
    padding:10,
  },
  seperator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  eventName: {
    fontSize: 24,
    color: '#48BBEC'
  },
  thumb: {
    width: 100,
    height: 100,
  },
  eventDateView: {
    backgroundColor:'transparent',
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    height: 150,
    resizeMode: 'contain',
  },
  eventMapView: {
    backgroundColor:'blue',
    right: 0,
    top: 0,
    width: 200,
    height: 100,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'red',
  },
  card: {
    backgroundColor: '#ccc',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'white',
    height: CARD_HEIGHT,
  },
  searchView: {
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    margin: 3,
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
    paddingBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap:'wrap',
  },
  item: {
    backgroundColor: '#FFFFFF',
    width: width,
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#261851',
    flexDirection: 'row',
  },
  itemTitle: {
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 20,
    fontFamily: 'Nexa Bold',
    padding: 2,
  },
  itemText: {
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 16,
    fontFamily: 'Nexa Light',
    padding: 2,
  },
  scroll: {
    top:0,
    height:height*.79,
  },
})
