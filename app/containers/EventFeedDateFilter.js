import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Actions} from 'react-native-router-flux'
import { ActionCreators } from '../actions'
import { appStyleVariables, appColors } from '../styles';
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
  UIManager,
  LayoutAnimation,
} from 'react-native';

//npm packages
import DatePicker from 'react-native-datepicker'
import Moment from 'moment'

//components
import ActionNavBar from '../components/ActionNavBar'
import Button from '../components/Button'
//Class variables
const STATUS_BAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const HEADER_BAR_HEIGHT = 44;
var {width,height} = Dimensions.get('window');

const filterTypeStrings = ['Today', 'Tomorrow', 'This Week', 'This Weekend', 'Custom', 'All Dates']
const presetFilters = ['Today','Tomorrow','Week','Weekend','Custom'];

class EventFeedDateFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.startDate ? this.props.startDate : new Date(),
      endDate: this.props.endDate ? this.props.endDate : new Date(),
      dateFilterType: this.props.dateFilterType,
      dateFilterIndex: getFilterIndexFromTypeString(this.props.dateFilterType)
    }
  }
  componentDidMount(){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var todayNextYear = new Date(year + 1, month, day)

    this.setState({
      startDate: this.props.startDate ? this.props.startDate : today,
      endDate: this.props.endDate ? this.props.endDate : todayNextYear,
    })
  }
  componentWillReceiveProps(nextProps){
    let typeString = nextProps.dateFilterType ? nextProps.dateFilterType : this.props.dateFilterType
    this.setState({
      dateFilterIndex: getFilterIndexFromTypeString(typeString)
    })
  }
  submitPressed(){
    this.props.setLocalStartDate(this.state.startDate);
    this.props.setLocalEndDate(this.state.endDate);
    this.props.setDateFilterType(this.state.dateFilterType);
    Actions.pop();
  }
  dateFilterButtonPressed(sentIndex){
    this.setState({
      dateFilterIndex: sentIndex
    })
    if(sentIndex == 0) //Today
    {
      var today = new Date();
      var tomorrow = new Date();
      tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);

      this.setState({
        startDate: Moment(today),
        endDate: Moment(tomorrow),
        dateFilterType: 'Today'
      })
    }
    else if(sentIndex == 1) //Tomorrow
    {
      var tomorrow = new Date();
      tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
      var dayAfterTomorrow = new Date();
      dayAfterTomorrow = dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      this.setState({
        startDate: Moment(tomorrow),
        endDate: Moment(dayAfterTomorrow),
        dateFilterType: 'Tomorrow'
      })
    }
    else if(sentIndex == 2) //Week
    {
      var today = new Date();
      var endOfWeek = new Date();
      endOfWeek = endOfWeek.setDate(endOfWeek.getDate() + 7);
      // console.warn(Moment(monday));

      this.setState({
        startDate: Moment(today),
        endDate: Moment(endOfWeek),
        dateFilterType: 'This Week'
      })
    }
    else if(sentIndex == 3) //Weekend
    {
      var targetStartDay = 6; //Saturday
      var targetEndDay = 1; //Monday
      var today = new Date();
      var currentDayOfWeek = today.getDay();
      // console.warn(currentDayOfWeek);
      var saturday = new Date();
      saturday = saturday.setDate(saturday.getDate() + (targetStartDay-currentDayOfWeek));
      // console.warn(Moment(saturday));
      var monday = new Date();
      monday = monday.setDate(monday.getDate() + (8-currentDayOfWeek));
      // console.warn(Moment(monday));

      this.setState({
        startDate: Moment(saturday),
        endDate: Moment(monday),
        dateFilterType: 'This Weekend'
      })
    }
    else if(sentIndex == 4)
    {
      this.setState({
        dateFilterType: 'Custom'
      })
    }
    else if(sentIndex == 5)
    {
      let today = new Date();
      let distantDate = new Date();
      distantDate.setDate(distantDate.getFullYear() + 5);
      this.setState({
        startDate: Moment(today),
        endDate: Moment(distantDate),
        dateFilterType: 'All Dates'
      })
    }
  }
  render() {
    var startDate = new Date(this.state.startDate);
    var endDate = new Date(this.state.endDate);

    var presetFiltersViews = [];

    for(var i=0;i<presetFilters.length;i++)
    {
      var presetFilter = presetFilters[i];
      var isPressed = this.state.dateFilterIndex == i;
      presetFiltersViews.push(
          <Button
            ref={presetFilters}
            key={i}
            style={isPressed ? styles.selectedDateCell : styles.dateCell}
            textStyle={isPressed ? styles.selectedDateCellText : styles.dateCellText}
            onPress={this.dateFilterButtonPressed.bind(this, i)}>
              {presetFilter}
          </Button>
      );
    }
    return(
      <View style={styles.scene}>
        <ActionNavBar
          title={'Date Filter'}
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
          leftButtonText={'Cancel'}
          rightButtonText={'Submit'}
          submitPressed={() => this.submitPressed()}
        />
        <View style={styles.dateHolder}>
          <Button
            key={5}
            style={this.state.dateFilterIndex == 5 ? styles.selectedDateCell : styles.dateCell}
            textStyle={this.state.dateFilterIndex == 5 ? styles.selectedDateCellText : styles.dateCellText}
            onPress={this.dateFilterButtonPressed.bind(this, 5)}>
              All Dates
          </Button>
        </View>
        <View style={styles.datesHolder}>
          {presetFiltersViews}
        </View>
        {this.state.dateFilterType == 'Custom' &&
          <View style={styles.datePickerRow}>
            <DatePicker
              style={styles.datePicker}
              date={startDate}
              mode="date"
              placeholder='Start Date'
              format="MMM DD, YYYY"
              minDate={new Date()}
              showIcon={false}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                placeholderText: {
                  color: appStyleVariables.GRAY,
                  fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
                  fontSize: 15,
                },
                dateInput: {
                  borderWidth: 0,
                }
              }}
              onDateChange={(Event_Date) => {this.setState({startDate: Event_Date,dateFilterIndex:4,dateFilterType:'Custom'})}}
            />
            <Text style={styles.datePickerText}>-</Text>
            <DatePicker
              style={styles.datePicker}
              date={endDate}
              mode="date"
              placeholder='End Date'
              format="MMM DD, YYYY"
              minDate={this.state.startDate}
              showIcon={false}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                placeholderText: {
                  color: appStyleVariables.GRAY,
                  fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
                  fontSize: 15,
                },
                dateInput: {
                  borderWidth: 0,
                }
              }}
              onDateChange={(Event_Date) => {this.setState({endDate: Event_Date,dateFilterIndex:4,dateFilterType:'Custom'})}}
            />
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
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
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 14,
    color: '#848484',
  },
  selectedDateCellText: {
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 13,
    color: '#0B82CC',
  },
  datePickerRow: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#848484',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent:'center'
  },
  datePickerText: {
    marginLeft: 8,
    marginRight: 8,
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 18
  }
});

function getFilterIndexFromTypeString(typeString) {
  let index = filterTypeStrings.indexOf(typeString)
  return index == -1 ? 5 : index
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    startDate: state.app.localStartDate,
    endDate: state.app.localEndDate,
    dateFilterType: state.app.dateFilterType,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EventFeedDateFilter);
