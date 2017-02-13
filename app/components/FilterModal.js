import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Modal,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import closeImage from '../images/delete.png'
import styleVariables from '../Utils/styleVariables'

export default class FilterModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      interests: this.props.interests ? this.props.interests : [],
      city: this.props.city ? this.props.city : '',
    };
  }
  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log('position: ',position);
        console.log('initialPosition: ',initialPosition);
        this.determineAddress(position);
        // this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  componentWillReceiveProps(nextProps){
    // console.log('NEXTPROPS: ',nextProps);
    if(nextProps.city != this.props.city)
    {
      this.setState({
        city: nextProps.city,
      })
    }
    if(nextProps.interests != this.props.interests)
    {
      this.setState({
        interests: nextProps.interests,
      })
    }
  }
  determineAddress(initialPosition)
  {
    console.log('Address from location');
    var obj = {}
    var string = 'https://maps.googleapis.com/maps/api/geocode/json?&latlng='+initialPosition.coords.latitude+','+initialPosition.coords.longitude;//baseURL + 'api/v1/workflows/'+workflow_ID+'/tasks/'+task_ID;
    console.log("Fetch url: ",string);
    fetch(string,obj)
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      var cityName = '';
      for(var i=0;i<responseJson.results[0].address_components.length;i++)
      {
        var address_components = responseJson.results[0].address_components[i];
        var types = address_components.types;
        if(types.indexOf('locality') != -1)
        {
          cityName = address_components.long_name
        }
      }
      console.log('RAH: ',responseJson.results[0].address_components);
      console.log('RAH: ',responseJson.results[0].address_components[3].long_name);
      console.log('CityName: ',cityName);
      // console.log('Lat: ',responseJson.results[0].geometry.location.lat);
      // console.log('Long: ',responseJson.results[0].geometry.location.lng);
      // var cityName = responseJson.results[0].address_components[3].long_name;
      // var lat = responseJson.results[0].geometry.location.lat;
      // var lng = responseJson.results[0].geometry.location.lng;
      this.setState({city:cityName});
      this.props.setLocation(cityName);
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  closeModal(){
    this.props.setLocation(this.state.city);
    this.props.interestPressed(this.state.interests);
    this.props.close();
  }
  buttonPressed(sentInterest) {
    // console.log(sentInterest);
    // console.log(this.state.interests);
    // console.log(this.state.interests.indexOf(sentInterest));
    if(this.state.interests.indexOf(sentInterest) == -1)
    {
      var interests = this.state.interests;
      interests.push(sentInterest);
      this.setState({interests:interests});
    }
    else
    {
      var interests = this.state.interests;
      var index = interests.indexOf(sentInterest);
      interests.splice(index,1);
      this.setState({interests:interests});
    }

  }
  setCity(sentText){
    this.setState({city:sentText});
  }
  renderInterests(){
    var interests = ['Nightlife','Entertainment','Music','Food_Tasting','Family','Theater','Dining','Dance','Art','Fundraiser','Comedy','Festival','Sports','Class','Lecture','Fitness','Meetup','Workshop',];
    var interestsViews = [];

    for(var i=0;i<interests.length;i++)
    {
      var interest = interests[i];
      var backgroundColor = this.state.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
      interestsViews.push(
          <Button ref={interest} key={i} style={[styles.interestsCell,{backgroundColor:backgroundColor}]} textStyle={styles.interestsCellText} onPress={this.buttonPressed.bind(this,interest)}>{interest}</Button>
      );
    }

    return interestsViews;
  }
  render() {

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.props.showing}
        onRequestClose={() => {alert("Modal can not be closed.")}}
      >
          <View style={styles.topNav}>
            <View style={{height:20}}></View>
            <View style={{height:44,flexDirection:'row'}}>
              <View style={{flex:.2,height:44}}></View>
              <View style={{flex:.6,justifyContent:'center'}}>
                <Text style={styles.navTitle}>Select Filters</Text>
              </View>
              <View style={{flex:.2,height:44,alignItems:'flex-end',justifyContent:'center'}}>
                <ImageButton image={closeImage} style={{width:32,height:32,marginRight:4,}} imageStyle={{width:12,height:12,tintColor:'white'}} onPress={this.closeModal.bind(this)}>
                </ImageButton>
              </View>
            </View>
          </View>

          <View>
            <View>
              <Text style={styles.filterTypeTitle}>Location</Text>
              <View style={{flex:1,flexDirection:'row',marginLeft:16,marginRight:16}}>
                <TextInput
                  style={styles.locationInput}
                  placeholder={'City'}
                  value={this.state.city}
                  onChangeText={(text) => this.setCity(text)}
                  underlineColorAndroid='transparent'
                />
                <Button onPress={() => this.getLocation()}>Locate Me</Button>
              </View>
            </View>
            <View>
              <Text style={styles.filterTypeTitle}>Interests</Text>
              <View style={styles.interestsHolder}>
                {this.renderInterests()}
              </View>
            </View>
          </View>
      </Modal>
    );
  }
}

var styles = StyleSheet.create({
  topNav: {
    height: 64,
    backgroundColor: '#0E476A',
  },
  navTitle: {
    fontFamily: styleVariables.systemBoldFont,
    color:'#F97237',
    fontSize:20,
    textAlign:'center',
  },
  closeButton: {
    flex:1,
  },
  filterTypeTitle: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 14,
    color: styleVariables.greyColor,
    marginLeft: 16,
    marginBottom: 8,
    marginTop:8,
  },
  locationInput: {
    flex:.6,
    height:44,
    borderWidth:1,
    borderColor: styleVariables.greyColor,
    padding: 4,
  },
  interestsHolder: {
    flex:1,
    marginLeft: 16,
    marginRight: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  interestsCell: {
    margin: 8,
  },
  interestsCellText: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 14,
    color: 'white',
  },
});
