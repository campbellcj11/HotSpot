import React, { Component } from 'react';
import { appStyleVariables, appColors, tagColors } from '../styles';
import { Actions } from 'react-native-router-flux'
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
  Alert,
  Share,
} from 'react-native';

var { width,height } = Dimensions.get('window');

import RNCalendarEvents from 'react-native-calendar-events'
import RNFetchBlob from 'react-native-fetch-blob'
import Moment from 'moment'

import ExplodingHeart from '../components/ExplodingHeart'

import shareIconIOS from '../images/share-ios.png'
import shareIconAndroid from '../images/share-android.png'
import calendarIcon from '../images/calendar.png'
import favoriteIcon from '../images/heart.png'

export default class EventCell extends Component {
  constructor(props){
    super(props);

    this.state = {
      isFavorited: this.props.isFavorited,
    }

    Moment.updateLocale('en', {
        calendar : {
            lastDay : '[Yesterday]',
            sameDay : '[Today]',
            nextDay : '[Tomorrow]',
            lastWeek : '[Last] dddd',
            nextWeek : '[Next] dddd',
            sameElse : 'dddd'
        }
    });
  }
  componentWillReceiveProps(nextProps){

  }
  openShare()
  {
    let current = this.props.rowData
    let imagePath = null
    console.warn('Image URL: ' + current.image)
    let fileType = current.image.substr(current.image.lastIndexOf('.') + 1)
    fileType = fileType.substr(0, fileType.indexOf('?'))
    console.log('Parsed file type: ' + fileType)
    RNFetchBlob
      .config({
        fileCache: true
      })
      .fetch('GET', current.Image)
      // store image locally
      .then(resp => {
          imagePath = resp.path()
          return resp.readFile('base64')
      })
      // share using base64 encoded version
      .then(base64Data => {
          // set header info for base64 image
          let imageUrl = 'data:image/' + fileType + ';base64,' + base64Data
          // share externally
          Share.open({
            title: current.Event_Name + ' on HotSpot',
            subject: current.Event_Name + ' on HotSpot',
            message: 'I found ' + current.Event_Name + ' thanks to HotSpot. Check it out: https://projectnow-964ba.firebaseapp.com/getHotspot.html?id='+ current.Key + '&l=' + this.props.location,
            url: imageUrl,
            type: 'image/' + fileType
          })
          .catch(err => {
            console.log('RNShare promise rejected:')
            console.log(err)
          })
          // remove the file from storage
          if (imagePath) {
            return RNFetchBlob.fs.unlink(imagePath)
          }
      })
  }
  addToCalendar(){
    let current = this.props.rowData
    // make sure calendar access permission has been granted
    RNCalendarEvents.authorizationStatus()
      .then(status => {
        if (status != 'authorized') {
          RNCalendarEvents.authorizeEventStore()
            .then(status => {
              if (status != 'authorized') {
                console.warn('Calendar authorization failed')
                return
              }
              this.openCalendar()
            })
            .catch(() => {
              console.warn('Calendar authorization failed.')
            })
          return
        }

        let options = {
          startDate: (new Date(+current.startDate)).toISOString(), // + is quick cast to Number
          endDate: (new Date(+current.endDate)).toISOString(),
          notes: current.Short_Description,
          description: current.Short_Description,
          location: current.Address
        }
        // add event
        RNCalendarEvents.saveEvent(current.Event_Name, options)
          .then(id => {
            console.warn('Added event, id: ' + id)
            // open calendar
            if(Platform.OS === 'ios') {
              const referenceDate = Moment.utc('2001-01-01');
              const secondsSinceRefDate = (+current.Date - referenceDate)/1000;
              Linking.openURL('calshow:' + secondsSinceRefDate);
            } else {
              const msSinceEpoch = this.props.currentSelection.Date.valueOf(); // milliseconds since epoch
              Linking.openURL('content://com.android.calendar/time/' + msSinceEpoch);
            }
          })
          .catch(error => {
            Alert.alert('Error', 'Failed to add event to calendar.')
            console.warn(error)
          })
      })
      .catch(() => {
        // alert about lack of permission
        Alert.alert('Not allowed', 'You must allow HotSpot to access your calendar.')
      })
  }
  toggleFavorite(){
    if(this.state.isFavorited){
      this.refs.heart.implode();
    }
    else{
      this.refs.heart.explode();
    }
    this.setState({isFavorited: !this.state.isFavorited})
  }
  render(){
    var startDate = Moment(this.props.rowData.startData);

    var startTime = startDate.format('LT');
    var month = startDate.format('MMMM');
    var day = startDate.format('DD');
    var dow = startDate.calendar();

    return(
      <View style={styles.container}>
        <TouchableHighlight key={this.props.rowData.id}>
          <View style={{overflow: 'hidden',borderTopLeftRadius:4,borderTopRightRadius:4,}}>
            <Image style={styles.eventImage} source={this.props.rowData.image} resizeMode={'cover'}>
              <View style={[styles.tagTextHolder,{backgroundColor:tagColors[this.props.rowData.tag ? this.props.rowData.tag.toLowerCase() : '']}]}>
                <Text style={styles.tagText}>{this.props.rowData.tag ? this.props.rowData.tag.toUpperCase() : ''}</Text>
              </View>
            </Image>
            <View style={{flexDirection:'row',marginVertical:4,marginHorizontal:8}}>
              <View style={styles.leftView}>
                <Text style={styles.title} numberOfLines={3}>{this.props.rowData.title}</Text>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.time}>{startTime}</Text>
                  <Text style={styles.location}> - {this.props.rowData.location}</Text>
                </View>
                <Text style={styles.shortDescription} numberOfLines={2}>{this.props.rowData.shortDescription}</Text>
                <View style={styles.bottomView}>
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => this.openShare()}>
                    <View style={styles.actionButtonContentHolder}>
                      <Image style={styles.actionButtonImage} source={Platform.OS == 'ios' ? shareIconIOS : shareIconAndroid} resizeMode={'contain'}/>
                      <Text style={styles.actionButtonText}>Share</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => this.addToCalendar()}>
                    <View style={styles.actionButtonContentHolder}>
                      <Image style={styles.actionButtonImage} source={calendarIcon} resizeMode={'contain'}/>
                      <Text style={styles.actionButtonText}>Add To Calendar</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.monthText}>{month}</Text>
                <Text style={styles.dayText}>{day}</Text>
                <Text style={styles.dowText}>{dow}</Text>
                <TouchableHighlight underlayColor={'transparent'} style={styles.favoriteButton} onPress={() => this.toggleFavorite()}>
                  <View style={{width:44,height:44}}>
                    <ExplodingHeart ref={'heart'} frameWidth={44} frameHeight={44} selected={this.state.isFavorited}/>
                  </View>
                </TouchableHighlight>
                {/*<TouchableHighlight style={this.state.isFavorited ? styles.selectedFavoriteButton :styles.unselectedFavoriteButton} onPress={() => this.toggleFavorite()}>
                  <Image source={favoriteIcon}/>
                </TouchableHighlight>*/}
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: appColors.WHITE,
    margin:8,
    borderRadius:4,
  },
  eventImage: {
    height:128,
    width:width-16,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
  },
  tagTextHolder:{
    position:'absolute',
    left:8,
    bottom:8,
    paddingHorizontal:6,
    paddingVertical:2,
    borderRadius:4,
  },
  tagText:{
    color:appColors.WHITE,
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 14,
  },
  leftView:{
    flex:.7,
    borderRightWidth:1,
    borderRightColor:appColors.GRAY,
  },
  rightView:{
    flex:.3,
    alignItems:'center',
  },
  bottomView:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginLeft:8,
    marginRight:16,
  },
  title:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 24,
    color: appColors.BLACK,
    marginBottom:2,
  },
  time:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 12,
    color: appColors.BLACK,
  },
  location:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 12,
    color: appColors.BLACK,
  },
  shortDescription:{
    fontFamily: appStyleVariables.SYSTEM_LIGHT_FONT,
    fontSize: 14,
    color: appColors.DARK_GRAY,
    marginVertical:8,
  },
  actionButtonContentHolder:{
    flexDirection:'row',
  },
  actionButtonImage:{
    width:18,
    height:18,
    tintColor: appColors.DARK_GRAY,
    marginRight:8,
  },
  actionButtonText:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 12,
    color: appColors.DARK_GRAY,
    height:18,
    lineHeight:18,
  },
  monthText:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 16,
    color: appColors.BLACK,
  },
  dayText:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 18,
    color: appColors.BLACK,
  },
  dowText:{
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 14,
    color: appColors.BLACK,
  },
  favoriteButton:{
    marginTop:8,
    marginBottom:16,
    width:44,
    height:44,
  },
  selectedFavoriteButton:{
    backgroundColor: appColors.LIGHT_BLUE,
    width:44,
    height:44,
    marginTop:8,
    marginBottom:16,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:22,
  },
  unselectedFavoriteButton:{
    backgroundColor: appColors.DARK_GRAY,
    width:44,
    height:44,
    marginTop:8,
    marginBottom:16,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:22,
  },
});
