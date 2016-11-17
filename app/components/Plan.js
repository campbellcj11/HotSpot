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

import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';

var {height, width} = Dimensions.get('window');


export default class Plan extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentWillMount() {

  }

  render() {

    const PURPLE = '#261851';
    const GREY = '#BDBDBD';
    const WHITE = '#FFFFFF';
    const BLACK = '#424242';
    const LIGHT_GREY = '#F5F5F5';

    return(
      <View style={styles.container}>
        <View style={{flex:1,justifyContent: 'center',}}>
          <Calendar
            onChange={(date) => this.setState({date})}
            selected={this.state.date}
            // We use Moment.js to give the minimum and maximum dates.
            minDate={Moment().startOf('day')}
            maxDate={Moment().add(5, 'years').startOf('day')}

            style={{
              borderWidth: 1,
              borderColor: GREY,
              borderRadius: 5,
              alignSelf: 'center',
              marginTop: 20,
            }}
            barView={{
              backgroundColor: PURPLE,
              padding: 10,
            }}
            barText={{
              fontFamily: 'Futura-Medium',
              color: WHITE,
            }}
            stageView={{
              padding:0,
            }}
            dayHeaderView={{
              backgroundColor: LIGHT_GREY,
              borderBottomColor: GREY,
            }}
            dayHeaderText={{
              fontFamily: 'Futura-Medium',
              color: BLACK,
            }}
            dayRowView={{
              borderColor: LIGHT_GREY,
              height:40,
            }}
            dayText={{
              color: BLACK,
              fontFamily: 'Futura-Medium',
            }}
            dayDisabledText={{
              color:GREY,
            }}
            dayTodayText={{
              fontWeight: 'bold',
              fontFamily: 'Futura-Medium',
              color: PURPLE,
            }}
            daySelectedText={{
              fontWeight: 'bold',
              backgroundColor: PURPLE,
              color: WHITE,
              borderRadius: 15,
              overflow: 'hidden',
            }}

            monthDisabledText={{
              color: GREY,
              borderColor: GREY,
            }}
          />
        </View>
        <View style = {{flex:1,justifyContent:'center', alignItems:'center',}}>
          <Text style = {styles.dateText}>
            {this.state.date ? this.state.date.format('MM-DD-YYYY h:mm a')
                           : "No date selected"}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop:64,
    marginBottom: 50,
    backgroundColor: '#F5FCFF',
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Futura-Medium',
    fontWeight: 'bold',
  },
})
