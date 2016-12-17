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
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
var {height, width} = Dimensions.get('window');


export default class EventCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      transparent: true,
      latitude: this.props.currentSelection.latitude,
      longitude: this.props.currentSelection.longitude,
    }
    this.determineLatAndLong();
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
  openURL(sentURL)
  {
    var uriString = 'http://' + sentURL;
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

    dateMonth = months[this.props.currentSelection.Date.getMonth()];
    dateNumber = this.props.currentSelection.Date.getDate();
    dateYear = this.props.currentSelection.Date.getUTCFullYear();

    var dateString = dateMonth + ' ' + dateNumber + ', ' + dateYear;

  return(
        <View style={styles.container}>
          <Image resizeMode={'cover'} style={styles.image} source={{uri:this.props.currentSelection.Image}}>
            {/*<View style={{flex:1,backgroundColor:'#00000099'}}>
              <View style={{flex:.9}}>
                <View style={{flex:.3}}>
                  <View style={styles.dateView}>
                    <Text style={styles.dateNumberText}> {dateString} </Text>
                  </View>
                </View>
                <Text style={{flex:.7,padding:5,color:'white',fontFamily:'Futura-Medium',fontSize:14}}>{this.props.currentSelection.Long_Description}</Text>
              </View>
              <View style={{flex:.1}}>
              </View>
            </View>*/}
          </Image>
          <View key={'Middle View'} style={styles.middleView}>
            <View style={{flex:.15,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#095BA9'}}>
              <View style={{flex:.5,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#095BA9'}}>
                <Text style={styles.dateNumberText}> {dateString} </Text>
              </View>
              <View style={{flex:.5,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color: '#095BA9',fontFamily: 'HelveticaNeue-Light',fontSize: 16,}}>{this.props.currentSelection.Location}</Text>
              </View>
            </View>
            <View style={{flex:.15,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#095BA9'}}>
              <Button style={{flex:1}} textStyle={{color: '#095BA9',fontFamily: 'HelveticaNeue-Light',fontSize: 16,textAlign:'center'}} onPress={() => this.openURL(this.props.currentSelection.Website)}>{this.props.currentSelection.Website}</Button>
            </View>
            <ScrollView style={{flex:.7,borderBottomWidth:1,borderBottomColor:'#095BA9'}}>
              <Text style={{flex:.7,padding:5,color:'black',fontFamily:'HelveticaNeue-Light',fontSize:14,lineHeight:18}}>{this.props.currentSelection.Long_Description}</Text>
            </ScrollView>
          </View>
          <View key={'Bottom View'} style={styles.bottomView}>
            <MapView
               initialRegion={{
                 latitude: this.state.latitude,
                 longitude: this.state.longitude,
                 latitudeDelta: 0.0922,
                 longitudeDelta: 0.0421,
               }}
               style={{flex:1}}
               scrollEnabled={false}
               zoomEnabled={false}
               pitchEnabled={false}
               rotateEnabled={false}
             >
               <MapView.Marker
                 title="This is a title"
                 description="This is a description"
                 coordinate={{latitude: this.state.latitude,longitude: this.state.longitude,latitudeDelta: 0.0922,longitudeDelta: 0.0421}}
               />
               <View style={{flex:.3,flexDirection:'row',backgroundColor:'#00000099'}}>
                  <Button style={{flex:1}} textStyle={{color:'white',textAlign:'center'}} onPress={() => this.openMap()}>{this.props.currentSelection.Address}</Button>
               </View>
               <View style={{flex:.7,flexDirection:'row'}}>
                 {/*
                   <View style={{flex:.5,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{textAlign:'center',color:'#45C3AB',fontFamily:'Futura-Medium',fontSize:15}}>+4{'\n'}Checkins</Text>
                   </View>
                 */}
                 <View style={{flex:.5}}>
                 </View>
               </View>
           </MapView>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    top: 64,
    height: height - 64 - 45,
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

//This code goes in the bottomView where the map is with the purpose of being split
// <View style={{flex:.5}}>
//   <View style={{flex:.5,flexDirection:'row'}}>
//     <View style={{flex:.5,backgroundColor:'#45C3AB'}}>
//       <View style={{flex:1,backgroundColor:'#00000030'}}>
//       </View>
//     </View>
//     <View style={{flex:.5,backgroundColor:'#45C3AB'}}>
//       <View style={{flex:1,backgroundColor:'#00000010'}}>
//       </View>
//     </View>
//   </View>
//   <View style={{flex:.5,flexDirection:'row'}}>
//     <View style={{flex:.5,backgroundColor:'#45C3AB'}}>
//       <View style={{flex:1,backgroundColor:'#00000050'}}>
//       </View>
//     </View>
//     <View style={{flex:.5,backgroundColor:'#45C3AB',justifyContent:'center',alignItems:'center'}}>
//       <Text style={{textAlign:'center',color:'white',fontFamily:'Futura-Medium',fontSize:15}}>+12{'\n'}People</Text>
//     </View>
//   </View>
// </View>
