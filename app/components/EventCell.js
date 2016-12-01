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
var {height, width} = Dimensions.get('window');
import heartImage from '../images/favorite-heart-button.png'


export default class EventCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      favoriteColor: 'white',
    }
  }

  componentWillMount() {

  }
  favoriteButtonPressed(){
    if(this.state.favoriteColor == 'white')
    {
      this.setState({favoriteColor: 'red'});
    }
    else
    {
      this.setState({favoriteColor: 'white'});
    }
  }
  render() {
    console.log('Event Info: ', this.props.eventInfo);
    console.log('Event Name: ', this.props.eventInfo.Event_Name);
    console.log('Event Image: ', this.props.eventInfo.Image);
    this.date = this.props.eventInfo.Date ? this.props.eventInfo.Date.toLocaleDateString(): '';
    console.log('Event Date: ', this.date);
    return(
      <TouchableHighlight style={this.props.style} onPress={(cellInfo) => this.props.cellPressed(this.props.eventInfo)}>
        <View style={styles.container}>
            <Image source={{uri: this.props.eventInfo.Image || ''}} style={styles.image}>
              <View style={{flex:1,backgroundColor:'#00000080'}}>
                <View style={{flex: this.props.large ? .85:.7,padding:5}}>
                  <Text style={{flex: this.props.large ? .05:.20,fontFamily:'Nexa Bold',fontSize: this.props.large ? 10:8,color:'white'}}>{this.props.eventInfo.Location}</Text>
                  <Text style={{flex: .80,fontFamily:'Nexa Bold',fontSize: this.props.large ? 18:14,color:'white'}}>{this.props.eventInfo.Event_Name}</Text>
                </View>
                <View style={{flex: this.props.large ? .15:.3,flexDirection:'row'}}>
                  <View style={{flex: .5,paddingLeft:3,alignItems:'flex-start',justifyContent:'center'}}>
                    <Text style={{backgroundColor:'#C123E2',fontFamily:'Nexa Bold',padding:2,fontSize:12,color:'white'}}>{this.props.eventInfo.MainTag}</Text>
                  </View>
                  <View style={{flex: .4}}>
                  </View>
                  <View style={{flex: .1}}>
                    <ImageButton style={{padding:10,width:this.props.large ? 30:15,height:this.props.large ? 30:15}} image={heartImage} imageStyle={{tintColor:this.state.favoriteColor,width:this.props.large ? 30:15,height:this.props.large ? 30:15,resizeMode:'cover'}} onPress={() => this.favoriteButtonPressed()}/>
                  </View>
                </View>
              </View>
            </Image>
            <View style={{flex:.35}}>
              <View style={{flex:.3}}>
                <Text style={{paddingLeft:5,flex: this.props.large ? .15:.40,fontFamily:'Nexa Bold',fontSize:16}}>{this.date}</Text>
                <Text style={{flex: this.props.large ? .85:.60,fontFamily:'Nexa Light',fontSize:14,paddingLeft:5,color:'black'}}>{this.props.eventInfo.Short_Description}</Text>
              </View>
            </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    backgroundColor:'transparent',
    flex:.65,
    resizeMode: 'cover',
    marginBottom: 10,
  },

})
