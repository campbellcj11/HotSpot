import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Modal,
  ScrollView,
  ListView,
  Dimensions,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
var {height, width} = Dimensions.get('window');
// import closeImage from '../images/delete.png'
import closeImage from '../imgs/check.png'

import styleVariables from '../Utils/styleVariables'
import DatePicker from 'react-native-datepicker'
import Moment from 'moment'

var eventActions = require("../actions/eventActions.js");

export default class FilterModal extends Component {

  constructor(props) {
    super(props);
    var startDateToBe = new Date();
    if(this.props.startDate)
    {
      if(this.props.startDate > new Date())
      {

        startDateToBe = this.props.startDate
      }
      else
      {
        // console.warn('Date is older than right now setting date to ',new Date());
      }
    }
    this.state = {
      interests: this.props.interests ? this.props.interests : [],
      city: this.props.city ? this.props.city : '',
      startDate: this.props.startDate ? startDateToBe : new Date(),
      endDate: this.props.startDate ? this.props.endDate : new Date(),
      dateFilterIndex: 4,
      locationSearch: '',
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
    if(nextProps.startDate != this.props.startDate)
    {
      var startDateToBe = new Date();
      if(nextProps.startDate)
      {
        if(nextProps.startDate > new Date())
        {

          startDateToBe = nextProps.startDate
        }
        else
        {
          // console.warn('Date is older than right now setting date to ',new Date());
        }
      }
      this.setState({
        startDate: nextProps.startDate ? startDateToBe : new Date(),
      })
    }
    if(nextProps.endDate != this.props.endDate)
    {
      this.setState({
        endDate: nextProps.endDate,
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
  saveData(){
    this.props.setLocation(this.state.city);
    this.props.interestPressed(this.state.interests);
    this.props.saveStartDate(this.state.startDate);
    this.props.saveEndDate(this.state.endDate);
  }
  closeModal(){
    this.saveData();
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
  dateFilterButtonPressed(sentIndex){
    this.setState({dateFilterIndex:sentIndex});
    if(sentIndex == 0) //Today
    {
      var today = new Date();
      var tomorrow = new Date();
      tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);

      this.setState({startDate: Moment(today),endDate: Moment(tomorrow)})
    }
    else if(sentIndex == 1) //Tomorrow
    {
      var tomorrow = new Date();
      tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
      var dayAfterTomorrow = new Date();
      dayAfterTomorrow = dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      this.setState({startDate: Moment(tomorrow),endDate: Moment(dayAfterTomorrow)})
    }
    else if(sentIndex == 2) //Week
    {
      var today = new Date();
      var endOfWeek = new Date();
      endOfWeek = endOfWeek.setDate(endOfWeek.getDate() + 7);
      // console.warn(Moment(monday));

      this.setState({startDate: Moment(today),endDate: Moment(endOfWeek)})
    }
    else if(sentIndex == 3) //Weekend
    {
      var tagetStartDay = 6; //Saturday
      var targetEndDay = 1; //Monday
      var today = new Date();
      var currentDayOfWeek = today.getDay();
      // console.warn(currentDayOfWeek);
      var saturday = new Date();
      saturday = saturday.setDate(saturday.getDate() + (tagetStartDay-currentDayOfWeek));
      // console.warn(Moment(saturday));
      var monday = new Date();
      monday = monday.setDate(monday.getDate() + (8-currentDayOfWeek));
      // console.warn(Moment(monday));

      this.setState({startDate: Moment(saturday),endDate: Moment(monday)})
    }
  }
  setCity(sentText){
    this.setState({city:sentText});
  }
  renderInterests(){
    // Call to database to populate the possible tags
    interests = eventActions.renderPossibleInterests();

    var interestsViews = [];
    for (i in interests){
      var interest = i;
      var isSelected = this.state.interests.indexOf(interest) == -1 ? false : true;
      // var backgroundColor = this.state.interests.indexOf(interest) == -1 ? styleVariables.greyColor : '#0B82CC';
      interestsViews.push(
          <Button ref={interest} underlayColor={'#FFFFFF'} key={i} style={isSelected ? styles.selectedCell : styles.interestCell} textStyle={isSelected ? styles.selectedCellText : styles.interestCellText} onPress={this.buttonPressed.bind(this,interest)}>{interest.toUpperCase()}</Button>
      );
    }

    return interestsViews;
  }
  renderDateFilter(){
    var presetFilters = ['Today','Tomorrow','Week','Weekend','Custom'];

    var presetFiltersViews = [];

    for(var i=0;i<presetFilters.length;i++)
    {
      var presetFilter = presetFilters[i];
      var isPressed = this.state.dateFilterIndex == i ? true : false;
      presetFiltersViews.push(
          <Button ref={presetFilters} key={i} style={isPressed ? styles.selectedDateCell : styles.dateCell} textStyle={isPressed ? styles.selectedDateCellText : styles.dateCellText} onPress={this.dateFilterButtonPressed.bind(this,i)}>{presetFilter}</Button>
      );
    }
    return(
      <View>
        <View style={styles.datesHolder}>
          {presetFiltersViews}
        </View>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <DatePicker
            style={{borderWidth:1,borderColor:'#848484',borderRadius:4,alignItems:'center',justifyContent:'center'}}
            date={this.state.startDate}
            mode="date"
            placeholder='Start Date'
            format="MMM DD, YYYY"
            minDate={new Date()}
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              placeholderText: {
                color: styleVariables.greyColor,
                fontFamily: styleVariables.systemFont,
                fontSize: 15,
              },
              dateInput: {
                borderWidth: 0,
              }
            }}
            onDateChange={(Event_Date) => {this.setState({startDate: Event_Date,dateFilterIndex:4})}}
          />
          <Text style={{marginLeft:8,marginRight:8,fontFamily:styleVariables.systemBoldFont,fontSize:18}}>-</Text>
          <DatePicker
            style={{borderWidth:1,borderColor:'#848484',borderRadius:4,alignItems:'center',justifyContent:'center'}}
            date={this.state.endDate}
            mode="date"
            placeholder='End Date'
            format="MMM DD, YYYY"
            minDate={this.state.startDate}
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              placeholderText: {
                color: styleVariables.greyColor,
                fontFamily: styleVariables.systemFont,
                fontSize: 15,
              },
              dateInput: {
                borderWidth: 0,
              }
            }}
            onDateChange={(Event_Date) => {this.setState({endDate: Event_Date,dateFilterIndex:4})}}
          />
        </View>

      </View>
    )
  }
  getPossibleLocations() {
    var unfilteredList = eventActions.renderPossibleLocations();
    var filteredList = [];
    if(this.state.locationSearch == '')
    {
      filteredList = unfilteredList;
    }
    else
    {
      for(var i=0;i<unfilteredList.length;i++)
      {
        var item = unfilteredList[i];
        if(item.indexOf(this.state.locationSearch) != -1)
        {
          filteredList.push(item);
        }
      }
    }
    return filteredList;
  }
  renderRow(rowData){
    var isSelected = this.state.city == rowData ? true : false;
    return(
      <TouchableHighlight underlayColor={'#FFFFFF'} style={isSelected ? styles.selectedLocationCell : styles.locationCell} onPress = {() => this.pressRow(rowData)}>
        <Text style={isSelected ? styles.selectedLocationCellText : styles.locationCellText}>{rowData}</Text>
      </TouchableHighlight>
    )
  }
  pressRow(rowData){
    this.setState({city:rowData});
  }
  renderLocation(){
    var possibleLocations = this.getPossibleLocations();

    var ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    return(
      <View style={{flex:1}}>
        <View style={styles.textInputHolder}>
          <TextInput style={styles.textInput}
            ref='locationSearch'
            onChangeText={(locationSearch) => this.setState({locationSearch})}
            placeholder='Search Location'
            placeholderTextColor='#DCE3E3'
            underlineColorAndroid='transparent'>
          </TextInput>
        </View>
        <View style={{height:height*.4}}>
          <ListView
            style={styles.locationList}
            dataSource={ds.cloneWithRows(possibleLocations)}
            renderRow= {this.renderRow.bind(this)}
            enableEmptySections={true}>
          </ListView>
        </View>
      </View>
    )
  }
  render() {

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.props.showing}
        onRequestClose={() => {this.closeModal()}}
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

          <ScrollView>
            <View>
              <Text style={styles.filterTypeTitle}>Date</Text>
              {this.renderDateFilter()}
            </View>
            <View>
              <Text style={styles.filterTypeTitle}>Location</Text>
              {this.renderLocation()}
              {/*<View style={{flexDirection:'row',marginLeft:16,marginRight:16}}>
                <TextInput
                  style={styles.locationInput}
                  placeholder={'City'}
                  value={this.state.city}
                  onChangeText={(text) => this.setCity(text)}
                  underlineColorAndroid='transparent'
                />
                <Button onPress={() => this.getLocation()}>Locate Me</Button>
              </View>*/}
            </View>
            <View>
              <Text style={styles.filterTypeTitle}>Interests</Text>
              <View style={styles.interestsHolder}>
                {this.renderInterests()}
              </View>
            </View>
          </ScrollView>
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
    fontFamily: styleVariables.systemFont,
    color:'#FFFFFF',
    fontSize:18,
    textAlign:'center',
  },
  filterTypeTitle: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 24,
    color: '#F97237',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    marginTop:8,
    textAlign:'center',
  },
  locationInput: {
    flex:.6,
    height:44,
    borderWidth:1,
    borderColor: styleVariables.greyColor,
    padding: 4,
  },
  interestsHolder: {
    marginLeft: 16,
    marginRight: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  interestCell:{
    margin:8,
    borderWidth:1,
    borderColor:'#848484',
    backgroundColor:'#FFFFFF',
    borderRadius:4,
  },
  selectedCell:{
    marginHorizontal: 7,
    marginVertical:8,
    borderWidth:2,
    borderColor:'#0B82CC',
    backgroundColor:'#FFFFFF',
    borderRadius:4,
  },
  interestCellText:{
    fontFamily: styleVariables.systemFont,
    fontSize: 16,
    color: '#848484',
  },
  selectedCellText:{
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 15,
    color: '#0B82CC',
  },
  datesHolder: {
    marginLeft: 16,
    marginRight: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateCell: {
    borderWidth:1,
    borderColor: '#848484',
    marginTop:8,
    marginBottom:8,
    borderRadius:4,
  },
  selectedDateCell:{
    borderWidth:2,
    borderColor: '#0B82CC',
    marginTop:8,
    marginBottom:8,
    borderRadius:4,
  },
  dateCellText: {
    fontFamily: styleVariables.systemFont,
    fontSize: 14,
    color: '#848484',
  },
  selectedDateCellText: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 13,
    color: '#0B82CC',
  },
  textInputHolder:{
    backgroundColor:'#FFFFFF',
    height: 44,
    marginLeft:32,
    marginRight: 32,
    flexDirection: 'row',
    marginBottom: 16,
  },
  textInput:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    color:'black',
    fontFamily: styleVariables.systemFont,
    fontSize: 16,
    padding: 2,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: '#848484',
    borderRadius:4,
  },
  locationList:{
    marginLeft:32,
    marginRight: 32,
    marginBottom: 16,
  },
  locationCell:{
    marginHorizontal:8,
    marginVertical:4,
    paddingLeft:8,
    height:32,
    borderWidth:1,
    backgroundColor:'#FFFFFF',
    borderColor:'#848484',
    justifyContent:'center',
    borderRadius:4,
  },
  selectedLocationCell:{
    marginHorizontal:8,
    marginVertical:4,
    paddingLeft:8,
    height:32,
    borderWidth:2,
    backgroundColor:'#FFFFFF',
    borderColor:'#0B82CC',
    justifyContent:'center',
    borderRadius:4,
  },
  locationCellText:{
    fontFamily: styleVariables.systemFont,
    fontSize: 16,
    color: '#848484',
  },
  selectedLocationCellText:{
    fontFamily:styleVariables.systemBoldFont,
    fontSize:15,
    color:'#0B82CC',
  },
});
