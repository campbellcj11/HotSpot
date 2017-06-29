import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Actions} from 'react-native-router-flux'
import { ActionCreators } from '../actions'
import { appStyleVariables, appColors } from '../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import Api from '../lib/api'
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

//components
import ActionNavBar from '../components/ActionNavBar'
//Class variables
const STATUS_BAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const HEADER_BAR_HEIGHT = 44;
var {width,height} = Dimensions.get('window');

class Profile extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        currentUser: this.props.currentUser,
        firstName: this.props.currentUser.first_name,
        lastName: this.props.currentUser.last_name,
        dob: this.props.currentUser.dob ? this.props.currentUser.dob : '',
        // dobDatetime: this.props.currentUser.dob ? new Date(this.props.currentUser.dob * 1000 + 86400000) : null,
        gender: this.props.currentUser.gender ? this.props.currentUser.gender : null,
        phone: this.props.currentUser.phone ? this.props.currentUser.phone : null
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.currentUser != this.props.currentUser)
    {
        this.setState({currentUser: nextProps.currentUser});
    }
  }

  submitPressed(){
    var newUser = this.state.currentUser;
    newUser.first_name = this.state.firstName;
    newUser.last_name = this.state.lastName;
    newUser.dob = this.state.dob;
    newUser.phone = this.state.phone;
    newUser.gender = this.state.gender != null ? this.state.gender : '';
    this.props.updateUser(newUser);
    Actions.pop();
  }

formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return  monthNames[monthIndex] + ' ' + day + ', ' + year;
}

  render() {
    return (
      <View style={styles.scene}>
      <ActionNavBar
        title={'Profile'}
        paddingTop={STATUS_BAR_HEIGHT}
        height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
        leftButtonText={'Cancel'}
        rightButtonText={'Update'}
        submitPressed={() => this.submitPressed()}
      />
        <View key={0} style={{flex:1}}>
          <KeyboardAwareScrollView>
            <View style={styles.textInputHolder}>
              <TextInput style={styles.textInput}
                ref='First Name'
                onChangeText={(firstName) => this.setState({firstName})}
                placeholder= {this.state.firstName ? this.state.firstName : 'First Name'}
                placeholderTextColor= {this.state.firstName ? appColors.BLACK : '#DCE3E3'}
                underlineColorAndroid='transparent'
                keyboardType={'email-address'}
                returnKeyType={'next'}
                onSubmitEditing={() => {this.refs.lastName.focus();}}>
              </TextInput>
            </View>
            <View style={styles.textInputHolder}>
              <TextInput style={styles.textInput}
                ref='lastName'
                onChangeText={(lastName) => this.setState({lastName})}
                placeholder= {this.state.lastName ? this.state.lastName : 'Last Name'}
                placeholderTextColor= {this.state.lastName ? appColors.BLACK : '#DCE3E3'}
                underlineColorAndroid='transparent'
                returnKeyType={'next'}
                onSubmitEditing={() => {this.refs.dob.focus();}}>
              </TextInput>
            </View>
            <View style={styles.textInputHolder}>
              <DatePicker
                ref='dob'
                style={styles.datePicker}
                date={new Date(this.state.dob * 1000)}
                mode="date"
                placeholder= 'Date of Birth'
                format="MMMM DD, YYYY"
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  placeholderText: {
                    color: '#DCE3E3',
                    fontFamily: appStyleVariables.SYSTEM_FONT,
                    fontSize: 16,
                  },
                  dateText:{
                    color: appColors.BLACK,
                    fontFamily: appStyleVariables.SYSTEM_FONT,
                    fontSize: 16,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignItems: 'flex-start',
                  }
                }}
                onDateChange={(dob) => {this.setState({dob: Date.parse(dob)/1000})}}
                onSubmitEditing={() => this.refs.gender.focus()}
              />
            </View>
            <View style={styles.textInputHolder}>
              <TextInput style={styles.textInput}
                ref='gender'
                onChangeText={(gender) => this.setState({gender})}
                placeholder= {this.state.gender ? this.state.gender : 'Gender'}
                placeholderTextColor= {this.state.gender ? appColors.BLACK : '#DCE3E3'}
                underlineColorAndroid='transparent'
                returnKeyType={'next'}
                onSubmitEditing={() => this.refs.phone.focus()}>
              </TextInput>
            </View>
            <View style={styles.textInputHolder}>
              <TextInput style={styles.textInput}
                ref='phone'
                onChangeText={(phone) => this.setState({phone})}
                placeholder= {this.state.phone ? this.state.phone : 'Phone'}
                placeholderTextColor= {this.state.phone ? appColors.BLACK : '#DCE3E3'}
                underlineColorAndroid='transparent'
                returnKeyType={'done'}>
              </TextInput>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  basicInfo : {
      flexDirection: 'row',
      justifyContent:'center',
      alignItems:'center',
  },
  title: {
      fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
      fontSize: 16,
      color: appColors.ORANGE,
      fontSize: 24,
  },
  textInputHolder: {
      backgroundColor: appColors.WHITE,
      height: 44,
      marginLeft:32,
      marginRight: 32,
      flexDirection: 'row',
      marginBottom: 16,
  },
  textInput: {
      flex: 1,
      height: 44,
      backgroundColor: 'transparent',
      color:'black',
      fontFamily: appStyleVariables.SYSTEM_FONT,
      fontSize: 16,
      padding: 2,
      paddingLeft: 16,
      borderWidth: 2,
      borderColor: 'transparent',
  },
  datePicker:{
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    padding: 2,
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
      currentUser: state.user.user,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
