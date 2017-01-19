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
  WebView,
  Linking,
  ScrollView,
  Platform,
  Animated,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import BlankButton from './BlankButton'
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import styleVariables from '../Utils/styleVariables'
import phoneImage from '../images/phone-receiver.png'
import webImage from '../images/web.png'
import emailImage from '../images/close-envelope.png'
import clockImage from '../images/time.png'
import pinImage from '../images/placeholder.png'
import dollarImage from '../images/coin-icon.png'
import infoImage from '../images/interface.png'

var {height, width} = Dimensions.get('window');


export default class EventCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      transparent: true,
      // latitude: this.props.currentSelection.latitude,
      // longitude: this.props.currentSelection.longitude,
      scrollY: 0,
    }
    // this.determineLatAndLong();
  }

  determineLatAndLong()
  {
    console.log('LAT AND LONG: ',this.props.currentSelection.latitude,this.props.currentSelection.longitude);
    if(this.props.currentSelection.latitude == '' && this.props.currentSelection.longitude == '')
    {
      this.determineLatAndLongFromAddress();
    }
  }
  determineLatAndLongFromAddress()
  {
    console.log('LAT AND LONG from Address');
    var obj = {}
    var string = 'https://maps.googleapis.com/maps/api/geocode/json?&address="'+this.props.currentSelection.Address+'"';//baseURL + 'api/v1/workflows/'+workflow_ID+'/tasks/'+task_ID;
    console.log("Fetch url: ",string);
    fetch(string,obj)
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      console.log('RAH: ',responseJson);
      console.log('Lat: ',responseJson.results[0].geometry.location.lat);
      console.log('Long: ',responseJson.results[0].geometry.location.lng);

      var lat = responseJson.results[0].geometry.location.lat;
      var lng = responseJson.results[0].geometry.location.lng;
      this.setState({latitude:lat,longitude:lng});
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  componentWillMount() {

  }
  openURL()
  {
    var uriString = this.props.currentSelection.Website;
    Linking.openURL(uriString).catch(err => console.error('An error occurred', err))
  }
  openMap()
  {
    var uriString = 'http://maps.apple.com/?address=' + this.props.currentSelection.Address;
    Linking.openURL(uriString).catch(err => console.error('An error occurred', err))
  }
  render() {
    var dateNumber;
    var dateMonth;
    var dateYear;
    var dayOfWeek;
    var dateHour;
    var dateMinute;
    var dateTimeString;
    var timeString;
    var minuteString;
    var addressString;
    var remainingTimeString;

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

    var days = new Array();
    days[0] = "Sunday";
    days[1] = "Monday";
    days[2] = "Tuesday";
    days[3] = "Wednesday";
    days[4] = "Thursday";
    days[5] = "Friday";
    days[6] = "Saturday";

    dateMonth = months[this.props.currentSelection.Date.getMonth()];
    dateNumber = this.props.currentSelection.Date.getDate();
    dateYear = this.props.currentSelection.Date.getUTCFullYear();
    dateHour = this.props.currentSelection.Date.getHours();
    dateMinute = this.props.currentSelection.Date.getMinutes();

    minuteString = dateMinute;
    if(dateMinute < 10)
    {
      minuteString = '0' + dateMinute;
    }

    timeString = ' at ' + dateHour + ':' + minuteString + 'a';
    if(dateHour > 12)
    {
      dateHour = dateHour % 12;
      timeString = ' at ' + dateHour + ':' + minuteString + 'p';
    }

    var dateString = dateMonth + ' ' + dateNumber + ', ' + dateYear;

    dayOfWeek = days[this.props.currentSelection.Date.getDay()];

    dateTimeString = dayOfWeek + timeString;

    addressString = this.props.currentSelection.Address;

    var currentDate = new Date();
    var diff = this.props.currentSelection.Date - currentDate;
    var seconds = diff/1000;
    var minutes = seconds/60;
    var hours = minutes/60;
    var days = hours/24;
    var weeks = days/7;
    // console.warn(this.props.currentSelection.Date);
    // console.warn(currentDate);
    // console.warn(diff);
    // console.warn(seconds);
    // console.warn(minutes);
    // console.warn(hours);
    // console.warn(days);
    if(weeks >= 1)
    {
      remainingTimeString = ' - In ' + Math.round(weeks) + ' weeks'
      if(Math.round(weeks) == 1)
      {
        remainingTimeString = ' - In ' + Math.round(weeks) + ' week'
      }
    }
    else if(days >= 1)
    {
      remainingTimeString = ' - In ' + Math.round(days) + ' days'
      if(Math.round(days) == 1)
      {
        remainingTimeString = ' - In ' + Math.round(days) + ' day'
      }
    }
    else if(hours >= 1)
    {
      remainingTimeString = ' - In ' + Math.round(hours) + ' hours'
      if(Math.round(hours) == 1)
      {
        remainingTimeString = ' - In ' + Math.round(hours) + ' hour'
      }
    }
    else if(minutes >= 1)
    {
      remainingTimeString = ' - In ' + Math.round(minutes) + ' minutes'
      if(Math.round(minutes) == 1)
      {
        remainingTimeString = ' - In ' + Math.round(minutes) + ' minute'
      }
    }
    else
    {
      remainingTimeString = '';
    }
  return(
    <View style={styles.container}>
      <ParallaxScrollView
        renderBackground={() => (
          <Image resizeMode={'cover'} style={{width:width,height:height*.15}} source={{uri:this.props.currentSelection.Image}}>
            <View style={{flex:1,backgroundColor:'#00000030'}}>
              <Text style={{backgroundColor:'transparent',color:'white',fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:20,marginLeft:16,marginTop:4}}>{this.props.currentSelection.Event_Name}</Text>
              <Text style={{backgroundColor:'#095BA9',position:'absolute',bottom:6,left:16,color:'white',fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',padding:5}}>{this.props.currentSelection.MainTag.toUpperCase()}</Text>
              <Text style={{backgroundColor:'#095BA9',position:'absolute',bottom:6,left:16,color:'white',fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',padding:5}}>{this.props.currentSelection.MainTag.toUpperCase()}</Text>
            </View>
          </Image>
        )}
        parallaxHeaderHeight={height*.15}
      >
        <View>
          <View style={{height:55,flexDirection:'row',marginLeft:30,marginRight:30}}>
            <ImageButton style={{flex:.33}} image={phoneImage} imageStyle={{width:24,height:24,resizeMode:'cover',tintColor:'#095BA9'}} />
            <ImageButton style={{flex:.33}} image={webImage} imageStyle={{width:24,height:24,resizeMode:'cover',tintColor:'#095BA9'}} onPress={() => this.openURL()}/>
            <ImageButton style={{flex:.33}} image={emailImage} imageStyle={{width:24,height:24,resizeMode:'cover',tintColor:'#095BA9'}} />
          </View>
          <View style={{marginTop:5}}>

            <View style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
              <Image style={{marginLeft:32,marginRight:48,width:24,height:24,tintColor:'#C6C6C6'}} source={clockImage}/>
              <View style={{marginRight:42}}>
                <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:15,color:'black'}}>{dateTimeString}</Text>
                  <Text style={{fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:10.5,color:'#C6C6C6'}}>{remainingTimeString}</Text>
                </View>
                <Text style={{fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:10.5,color:'#C6C6C6'}}>{dateString}</Text>
              </View>
            </View>

            <BlankButton style={{marginBottom:20}} onPress={() => this.openMap()}>
              <View style={{flexDirection:'row',alignItems:'center',}}>
                <Image style={{marginLeft:32,marginRight:48,width:24,height:24,tintColor:'#C6C6C6'}} source={pinImage}/>
                <View style={{marginRight:42}}>
                  <Text style={{fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:15,color:'black'}}>{this.props.currentSelection.Location}</Text>
                  <Text style={{fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:10.5,color:'#C6C6C6'}}>{addressString}</Text>
                </View>
              </View>
            </BlankButton>

            <View style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
              <Image style={{marginLeft:32,marginRight:48,width:24,height:24,tintColor:'#C6C6C6'}} source={dollarImage}/>
              <View style={{marginRight:42}}>
                <Text style={{fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:15,color:'black'}}>$-$$</Text>
              </View>
            </View>

            <View style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
              <View stlye={{flex:1}}>
                <Image style={{marginLeft:32,marginRight:48,width:24,height:24,tintColor:'#C6C6C6'}} source={infoImage}/>
                <View style={{flex:2}}/>
              </View>
              <View style={{marginRight:42,flex:1}}>
                <Text numberOfLines={0} style={{fontFamily:styleVariables.systemRegularFont,fontWeight:'bold',fontSize:12,lineHeight:16,color:'#C6C6C6'}}>{this.props.currentSelection.Long_Description}</Text>
              </View>
            </View>

          </View>
        </View>
      </ParallaxScrollView>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    top: Platform.OS == 'ios' ? 64:44,
    height: height - (Platform.OS == 'ios' ? 64:44) - 45,
    bottom: 45,
  },
  image: {
    flex:.25,
  },
  middleView: {
    flex:.5,
    backgroundColor:'white',
  },
  bottomView: {
    flex:.25,
    flexDirection:'row',
  },
  dateView: {
    flex:1,
    margin: 10,
  },
  dateNumberText: {
    color: '#095BA9',
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 16,
    margin: 5,
    textAlign: 'center',
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
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    height: 50,
    lineHeight: 50,
    backgroundColor: 'transparent',
  },
  eventDateView: {
    backgroundColor:'transparent',
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    height: 120,
    resizeMode: 'contain',
  },
  eventMapView: {
    backgroundColor:'blue',
    right: 0,
    top: 0,
    width: 200,
    height: 100,
  },
})

//This code goes here
// <View key={'Middle View'} style={styles.middleView}>
//   <View style={{flex:.15,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#095BA9'}}>
//     <View style={{flex:.5,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#095BA9'}}>
//       <Text style={styles.dateNumberText}> {dateString} </Text>
//     </View>
//     <View style={{flex:.5,justifyContent:'center',alignItems:'center'}}>
//       <Text style={{color: '#095BA9',fontFamily: 'HelveticaNeue-Light',fontSize: 16,}}>{this.props.currentSelection.Location}</Text>
//     </View>
//   </View>
//   <View style={{flex:.15,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#095BA9'}}>
//     <Button style={{flex:1}} textStyle={{color: '#095BA9',fontFamily: 'HelveticaNeue-Light',fontSize: 16,textAlign:'center'}} onPress={() => this.openURL(this.props.currentSelection.Website)}>{this.props.currentSelection.Website}</Button>
//   </View>
//   <ScrollView style={{flex:.7,borderBottomWidth:1,borderBottomColor:'#095BA9'}}>
//     <Text style={{flex:.7,padding:5,color:'black',fontFamily:'HelveticaNeue-Light',fontSize:14,lineHeight:18}}>{this.props.currentSelection.Long_Description}</Text>
//   </ScrollView>
// </View>
// <View key={'Bottom View'} style={styles.bottomView}>
//   <MapView
//      initialRegion={{
//        latitude: this.state.latitude,
//        longitude: this.state.longitude,
//        latitudeDelta: 0.0922,
//        longitudeDelta: 0.0421,
//      }}
//      style={{flex:1}}
//      scrollEnabled={false}
//      zoomEnabled={false}
//      pitchEnabled={false}
//      rotateEnabled={false}
//    >
//      <MapView.Marker
//        title="This is a title"
//        description="This is a description"
//        coordinate={{latitude: this.state.latitude,longitude: this.state.longitude,latitudeDelta: 0.0922,longitudeDelta: 0.0421}}
//      />
//      <View style={{flex:.3,flexDirection:'row',backgroundColor:'#00000099'}}>
//         <Button style={{flex:1}} textStyle={{color:'white',textAlign:'center'}} onPress={() => this.openMap()}>{this.props.currentSelection.Address}</Button>
//      </View>
//      <View style={{flex:.7,flexDirection:'row'}}>
//        {/*
//          <View style={{flex:.5,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
//           <Text style={{textAlign:'center',color:'#45C3AB',fontFamily:'Futura-Medium',fontSize:15}}>+4{'\n'}Checkins</Text>
//          </View>
//        */}
//        <View style={{flex:.5}}>
//        </View>
//      </View>
//  </MapView>
// </View>
