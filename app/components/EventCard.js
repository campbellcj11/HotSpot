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
        <View style={styles.container}>
          <Image style={styles.image} source={{uri:this.props.currentSelection.Image}}>
            <View style={{flex:1,backgroundColor:'#00000099'}}>
              <View style={{flex:.6}}>
                <View style={{flex:.7}}>
                  <View style={styles.dateView}>
                    <Text style={styles.dateNumberText}> {dateNumber} </Text>
                    <Text style={styles.dateMonthText}> {dateMonth} </Text>
                  </View>
                </View>
                <View style={{flex:.3,flexDirection:'row'}}>
                  <View style={{flex:.6}}/>
                  <Button style={{flex:.4,borderWidth:1,borderRadius:25,borderColor:'white',margin:5}} textStyle={{color:'white',textAlign:'center'}}>Notifications</Button>
                </View>
              </View>
              <View style={{flex:.1}}>
              </View>
              <Text style={{flex:.3,padding:5,color:'white',fontFamily:'Futura-Medium',fontSize:14}}>{this.props.currentSelection.Long_Description}</Text>
            </View>
          </Image>
          <View key={'Middle View'} style={styles.middleView}>
            <View style={{flex:.5,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#7358D1'}}>
              <View style={{flex:.5,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#7358D1'}}>
                <Text style={{color:'#7358D1'}}>{this.props.currentSelection.Location}</Text>
              </View>
              <View style={{flex:.5,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'#7358D1'}}>{this.props.currentSelection.Website}</Text>
              </View>
            </View>
            <View style={{flex:.5,justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'#7358D1'}}>{this.props.currentSelection.Address}</Text>
            </View>
          </View>
          <View key={'Bottom View'} style={styles.bottomView}>
            <View style={{flex:.5}}>
              <View style={{flex:.5,flexDirection:'row'}}>
                <View style={{flex:.5,backgroundColor:'#45C3AB'}}>
                  <View style={{flex:1,backgroundColor:'#00000030'}}>
                  </View>
                </View>
                <View style={{flex:.5,backgroundColor:'#45C3AB'}}>
                  <View style={{flex:1,backgroundColor:'#00000010'}}>
                  </View>
                </View>
              </View>
              <View style={{flex:.5,flexDirection:'row'}}>
                <View style={{flex:.5,backgroundColor:'#45C3AB'}}>
                  <View style={{flex:1,backgroundColor:'#00000050'}}>
                  </View>
                </View>
                <View style={{flex:.5,backgroundColor:'#45C3AB',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{textAlign:'center',color:'white',fontFamily:'Futura-Medium',fontSize:15}}>+12{'\n'}People</Text>
                </View>
              </View>
            </View>
            <MapView
               initialRegion={{
                 latitude: this.props.currentSelection.latitude,
                 longitude: this.props.currentSelection.longitude,
                 latitudeDelta: 0.0922,
                 longitudeDelta: 0.0421,
               }}
               style={{flex:.5}}
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
               <View style={{flex:.5,flexDirection:'row'}}>
                 <View style={{flex:.5,backgroundColor:'transparent'}}>
                 </View>
                 <View style={{flex:.5,backgroundColor:'transparent'}}>
                 </View>
               </View>
               <View style={{flex:.5,flexDirection:'row'}}>
                 <View style={{flex:.5,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                   <Text style={{textAlign:'center',color:'#45C3AB',fontFamily:'Futura-Medium',fontSize:15}}>+4{'\n'}Checkins</Text>
                 </View>
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
    flex:.35,
  },
  middleView: {
    flex:.2,
    backgroundColor:'#3023AE',
  },
  bottomView: {
    flex:.25,
    flexDirection:'row',
  },
  dateView: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    margin: 10,
    width: 70,
    height: 60,
    marginRight: 105,
  },
  dateNumberText: {
    color: 'white',
    fontFamily: 'Nexa Bold',
    fontSize: 30,
    margin: 5,
    textAlign: 'center',
  },
  dateMonthText: {
    color: 'white',
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

// <View style={[styles.modalContainer, modalBackgroundStyle]}>
//   <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
//     <View style={{flexDirection:'row'}}>
      // <View style={styles.dateView}>
      //   <Text style={styles.dateNumberText}> {dateNumber} </Text>
      //   <Text style={styles.dateMonthText}> {dateMonth} </Text>
      // </View>
      // <MapView
      //    initialRegion={{
      //      latitude: this.props.currentSelection.latitude,
      //      longitude: this.props.currentSelection.longitude,
      //      latitudeDelta: 0.0922,
      //      longitudeDelta: 0.0421,
      //    }}
//          style={{backgroundColor:'red',width:180,height:200,right:0,top:0}}
//          scrollEnabled={false}
//          zoomEnabled={false}
//          pitchEnabled={false}
//          rotateEnabled={false}
//        >
//          <MapView.Marker
//            title="This is a title"
//            description="This is a description"
//            coordinate={{latitude: this.props.currentSelection.latitude,longitude: this.props.currentSelection.longitude,latitudeDelta: 0.0922,longitudeDelta: 0.0421}}
//          />
//      </MapView>
//      </View>
//     <Text style={{flex:1,textAlign:'left',margin:2,marginTop:5,height:25,fontSize:24,fontFamily: 'Nexa Bold',color:'#261851'}}>{this.props.currentSelection.Event_Name}</Text>
//     <Text style={{flex:1,textAlign:'left',margin:2,marginBottom:5,height:25,fontSize:15,fontFamily: 'Nexa Bold',color:'#B765D3'}}>Local Event</Text>
//     <Button
//       onPress={() => this.props.closeSelection()}
//       style={styles.modalButton}
//       textStyle={styles.buttonText}
//     >
//       Close
//     </Button>
//   </View>
// </View>
