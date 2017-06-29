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

class EventFeedDateFilter extends Component {
  constructor(props) {
    super(props);



    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      startDate: this.props.startDate ? this.props.startDate : new Date(),
      endDate: this.props.endDate ? this.props.endDate : new Date(),
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

  }
  submitPressed(){
    this.props.setLocalStartDate(this.state.startDate);
    this.props.setLocalEndDate(this.state.endDate);
    Actions.pop();
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
    // else if(sentIndex == 4) //Next Week
    // {
    //   this.setState({startDate: Moment(saturday),endDate: Moment(monday)})
    // }
    // else if(sentIndex == 5) //This Month
    // {
    //
    // }
  }
  render() {
    // var presetFilters = ['Today','Tomorrow','Week','Weekend','Next Week','This Month','Custom'];
    var startDate = new Date(this.state.startDate);
    var endDate = new Date(this.state.endDate);

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
      <View style={styles.scene}>
        <ActionNavBar
          title={'Date Filter'}
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
          leftButtonText={'Cancel'}
          rightButtonText={'Submit'}
          submitPressed={() => this.submitPressed()}
        />
        <View style={styles.datesHolder}>
          {presetFiltersViews}
        </View>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <DatePicker
            style={{borderWidth:1,borderColor:'#848484',borderRadius:4,alignItems:'center',justifyContent:'center'}}
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
                fontFamily: appStyleVariables.SYSTEM_FONT,
                fontSize: 15,
              },
              dateInput: {
                borderWidth: 0,
              }
            }}
            onDateChange={(Event_Date) => {this.setState({startDate: Event_Date,dateFilterIndex:4})}}
          />
          <Text style={{marginLeft:8,marginRight:8,fontFamily:appStyleVariables.SYSTEM_BOLD_FONT,fontSize:18}}>-</Text>
          <DatePicker
            style={{borderWidth:1,borderColor:'#848484',borderRadius:4,alignItems:'center',justifyContent:'center'}}
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
                fontFamily: appStyleVariables.SYSTEM_FONT,
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
    fontFamily: appStyleVariables.SYSTEM_FONT,
    fontSize: 14,
    color: '#848484',
  },
  selectedDateCellText: {
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 13,
    color: '#0B82CC',
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    startDate: state.app.localStartDate,
    endDate: state.app.localEndDate,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EventFeedDateFilter);
