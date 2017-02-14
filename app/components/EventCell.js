import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as firebase from 'firebase';
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
  Platform,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
var {height, width} = Dimensions.get('window');
import heartImage from '../images/favorite-heart-button.png'
import styleVariables from '../Utils/styleVariables'

var eventActions = require("../actions/eventActions.js");


export default class EventCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      favoriteColor: 'white',
    }
    this.favoritesRef = firebase.database().ref("favorites/" + firebase.auth().currentUser.uid);
  }

  componentWillMount() {
    this.listenForItems(this.favoritesRef);
  }

  listenForItems(favoritesRef) {
    favoritesRef.on('value', (snap) => {
      console.log("Current favorites of user: " + snap.val());
      var items = snap.val();
      var color = 'white';
      //console.log("Event Name: " + this.props.eventInfo.Event_Name);
      if (items === null)
      {
        color = 'white';
      }
      else
      {
        for (var object in items)
        {
            console.log(items[object]);
        }
        if (items.includes(this.props.eventInfo.City + '/' + this.props.eventInfo.Key) === true)
        {
        //   console.log("FLAG! Favorite exists: " + this.props.eventInfo.Key);
          color = 'red'
        }
        else
        {
        //   console.log("FLAG! Favorites DOES NOT: " + this.props.eventInfo.Key);
          color = 'white'
        }
      }
      this.setState({
        favoriteColor: color,
      });
    });
  }

  favoriteButtonPressed(){
    if(this.state.favoriteColor == 'white')
    {
      this.setState({favoriteColor: 'red'},function() {
        var userUID = firebase.auth().currentUser.uid;
        var eventUID = this.props.eventInfo.Key;
        var city = this.props.eventInfo.City;
        eventActions.favorite(userUID, eventUID, city);
      });
    }
    else
    {
      this.setState({favoriteColor: 'white'},function() {
        var userUID = firebase.auth().currentUser.uid;
        var eventUID = this.props.eventInfo.Key;
        var city = this.props.eventInfo.City;
        eventActions.unFavorite(userUID, eventUID, city);
      });
    }
  }
  viewToRender()
  {
    return (
      <TouchableHighlight style={this.props.style} onPress={(cellInfo) => this.props.cellPressed(this.props.eventInfo)} underlayColor="transparent">
        <View style={styles.container}>
          <View style={{marginBottom:8,marginLeft:8,marginTop:8}}>
            <Text style={{fontFamily:styleVariables.systemBoldFont,fontSize: 18,marginBottom:4,}}>{this.props.eventInfo.Event_Name}</Text>
            <Text style={{fontFamily:styleVariables.systemBoldFont,fontSize: 7.5}}>{this.props.eventInfo.Location}</Text>
          </View>
          <Image source={{uri: this.props.eventInfo.Image ?  this.props.eventInfo.Image : ''}} style={styles.image}>
            <View style={{position:'absolute',left:8,right:8,bottom:8,flexDirection:'row'}}>
              <View style={{flex: .6,alignItems:'flex-start',justifyContent:'center'}}>
                <Text style={{backgroundColor:'#0B82CC',fontWeight:'bold',fontFamily:styleVariables.systemRegularFont,padding:2,fontSize:12,color:'white'}}>{this.props.eventInfo.MainTag ? this.props.eventInfo.MainTag.toUpperCase() : ''}</Text>
              </View>
              <View style={{flex: .3}}>
              </View>
              {
                !this.props.partOfFavorites ?
                  <View style={{flex: .1,alignItems:'center',justifyContent:'center'}}>
                    {(firebase.auth().currentUser.email != 'test@test.com') ? <ImageButton style={{width:30,height:30}} image={heartImage} imageStyle={{tintColor:this.state.favoriteColor,width:15,height:15,resizeMode:'cover'}} onPress={() => this.favoriteButtonPressed()}/>: <View/>}
                  </View>
                : null
              }
            </View>
          </Image>
          <View style={{marginLeft:8,marginRight:8,marginBottom:8}}>
            <Text style={{fontFamily:styleVariables.systemBoldFont,fontSize:16,color:'black',marginBottom:4}}>{this.date}</Text>
            <Text ellipsizeMode={'tail'} numberOfLines={0} style={{fontFamily:styleVariables.systemLightFont,fontSize:14,lineHeight:18,color:'black'}}>{this.props.eventInfo.Short_Description}</Text>
          </View>
            {/*<Image source={{uri: this.props.eventInfo.Image || ''}} style={[styles.image,{marginBottom:this.props.large ? 10:5}]}>
              <View style={{flex:1,backgroundColor:'#00000050'}}>
                <View style={{flex: this.props.large ? .85:.7,padding:5}}>
                  <Text style={{flex: this.props.large ? .13:.20,fontWeight:'bold',fontFamily:styleVariables.systemRegularFont,fontSize: this.props.large ? 12:10,color:'white'}}>{this.props.eventInfo.Location}</Text>
                  <Text style={{flex: .80,fontWeight:'bold',fontFamily:styleVariables.systemRegularFont,fontSize: this.props.large ? 24:14,color:'white'}}>{this.props.eventInfo.Event_Name}</Text>
                </View>
                <View style={{flex: this.props.large ? .15:.3,flexDirection:'row'}}>
                  <View style={{flex: .6,paddingLeft:3,alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{backgroundColor:'#0B82CC',fontWeight:'bold',fontFamily:styleVariables.systemRegularFont,padding:2,fontSize:12,color:'white'}}>{this.props.eventInfo.MainTag.toUpperCase()}</Text>
                  </View>
                  <View style={{flex: .3}}>
                  </View>
                  {
                    !this.props.partOfFavorites ?
                      <View style={{flex: .1,alignItems:'center',justifyContent:'center'}}>
                        {(firebase.auth().currentUser.email != 'test@test.com') ? <ImageButton style={{width:this.props.large ? 30:15,height:this.props.large ? 30:15}} image={heartImage} imageStyle={{tintColor:this.state.favoriteColor,width:this.props.large ? 15:15,height:this.props.large ? 15:15,resizeMode:'cover'}} onPress={() => this.favoriteButtonPressed()}/>: <View/>}
                      </View>
                    : null
                  }
                </View>
              </View>
            </Image>
            <View style={{flex:.5}}>
              <View style={{flex:.3}}>
                <Text style={{paddingLeft:5,flex: this.props.large ? .15:.25,fontWeight:'bold',fontFamily:styleVariables.systemRegularFont,fontSize:16,color:'black'}}>{this.date}</Text>
                <Text ellipsizeMode={'tail'} numberOfLines={0} style={{flex: this.props.large ? .85:.75,fontFamily:styleVariables.systemLightFont,fontSize:14,lineHeight:18,paddingLeft:5,paddingRight:5,color:'black'}}>{this.props.eventInfo.Short_Description}</Text>
              </View>
            </View>*/}
        </View>
      </TouchableHighlight>
    )
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

    dateMonth = this.props.eventInfo.Date ? months[this.props.eventInfo.Date.getMonth()]: '';
    dateNumber = this.props.eventInfo.Date ? this.props.eventInfo.Date.getDate(): '';
    dateYear = this.props.eventInfo.Date ? this.props.eventInfo.Date.getUTCFullYear(): '';

    var dateString = dateMonth + ' ' + dateNumber + ', ' + dateYear;

    this.date = this.props.eventInfo.Date ? dateString : '';
    return(
      Object.keys(this.props.eventInfo).length > 0 ? this.viewToRender() : <View/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    backgroundColor:'transparent',
    resizeMode: 'cover',
    marginLeft: 8,
    marginRight: 8,
    marginBottom:8,
    height: 150,
  },

})
