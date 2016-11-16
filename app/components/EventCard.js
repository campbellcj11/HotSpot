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
import MapView from 'react-native-maps';
var {height, width} = Dimensions.get('window');


export default class EventCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      transparent: true,
    }
  }

  componentWillMount() {

  }

  render() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent ? {backgroundColor: '#fff'} : null;
    var dateNumber;
    var dateMonth;
    var months = new Array();
    months[0] = "Jan";
    months[1] = "Feb";
    months[2] = "Mar";
    months[3] = "Apr";
    months[4] = "May";
    months[5] = "Jun";
    months[6] = "Jul";
    months[7] = "Aug";
    months[8] = "Sep";
    months[9] = "Oct";
    months[10] = "Nov";
    months[11] = "Dec";

    dateMonth = months[this.props.currentSelection.Date.getMonth()];
    dateNumber = this.props.currentSelection.Date.getDate();
    return(
      <View style={[styles.modalContainer, modalBackgroundStyle]}>
        <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
          <View style={{flexDirection:'row'}}>
            <View style={styles.dateView}>
              <Text style={styles.dateNumberText}> {dateNumber} </Text>
              <Text style={styles.dateMonthText}> {dateMonth} </Text>
            </View>
            <MapView
               initialRegion={{
                 latitude: this.props.currentSelection.latitude,
                 longitude: this.props.currentSelection.longitude,
                 latitudeDelta: 0.0922,
                 longitudeDelta: 0.0421,
               }}
               style={{backgroundColor:'red',width:180,height:200,right:0,top:0}}
               scrollEnabled={false}
               zoomEnabled={false}
               pitchEnabled={false}
               rotateEnabled={false}
             >
               <MapView.Marker
                 title="This is a title"
                 description="This is a description"
                 coordinate={{latitude: this.props.currentSelection.latitude,longitude: this.props.currentSelection.longitude,latitudeDelta: 0.0922,longitudeDelta: 0.0421}}
               />
           </MapView>
           </View>
          <Text style={{flex:1,textAlign:'left',margin:2,marginTop:5,height:25,fontSize:24,fontFamily: 'Nexa Bold',color:'#261851'}}>{this.props.currentSelection.Event_Name}</Text>
          <Text style={{flex:1,textAlign:'left',margin:2,marginBottom:5,height:25,fontSize:15,fontFamily: 'Nexa Bold',color:'#B765D3'}}>Local Event</Text>
          <Button
            onPress={() => this.props.closeSelection()}
            style={styles.modalButton}
            textStyle={styles.buttonText}
          >
            Close
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
  },
  innerContainer: {

  },
  dateView: {
    borderWidth: 1,
    borderColor: '#B765D3',
    borderRadius: 4,
    margin: 10,
    width: 70,
    height: 60,
    marginRight: 105,
  },
  dateNumberText: {
    color: '#B765D3',
    fontFamily: 'Nexa Bold',
    fontSize: 30,
    margin: 5,
    textAlign: 'center',
  },
  dateMonthText: {
    color: '#B765D3',
    fontFamily: 'Nexa Light',
    fontSize: 15,
    marginTop: 0,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 2,
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
