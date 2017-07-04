import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Actions} from 'react-native-router-flux'
import { ActionCreators } from '../actions'
import { appStyleVariables, appColors } from '../styles';
import Api from '../lib/api'
import { Alert } from 'react-native';
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

class OptionButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: false,
    }
  }
  setSelected(){
    this.setState({isSelected:!this.state.isSelected});
    this.props.onPress();
  }
  render(){
    return(
      <TouchableHighlight underlayColor={'transparent'} style={optionStyles.container} onPress={() => this.setSelected()}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={[optionStyles.indicator,{borderColor: this.state.isSelected ? appColors.LIGHT_BLUE : appColors.GRAY}]}>
            <View style={[optionStyles.innerIndicator,{backgroundColor: this.state.isSelected ? appColors.LIGHT_BLUE : 'transparent'}]}/>
          </View>
          <Text style={optionStyles.title}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const optionStyles = StyleSheet.create({
  container:{
    marginHorizontal:8,
    marginVertical:8,
  },
  indicator:{
    width:24,
    height:24,
    marginHorizontal:4,
    borderWidth:1.5,
    borderRadius:4,
    justifyContent:'center',
    alignItems:'center',
  },
  innerIndicator:{
    width:16,
    height:16,
    borderRadius:4,
    backgroundColor:'red',
  },
  title:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 16,
    color: appColors.BLACK,
  }
});

class Feedback extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        currentUser: this.props.currentUser,
        message: '',
        option: 0,
    }
  }
  componentWillReceiveProps(nextProps){
      if (nextProps.currentUser != this.props.currentUser)
      {
          this.setState({currentUser: nextProps.currentUser});
      }
  }

  submitFeedback()
  {
      var type = '';
      if (this.state.option == 1)
      {
          type = 'Inaccurate Event Information';
      }
      else if (this.state.option == 2)
      {
          type = 'Bug'
      }
      else if (this.state.option == 3)
      {
          type = 'Feature'
      }
      else if (this.state.option == 4)
      {
          type = 'Missing Event'
      }
      else if (this.state.option == 5)
      {
        type = 'Other'
      }
      else
      {
          type = '';
          Alert.alert('Type must be selected.');
      }
      if (this.state.message == '' || type == '')
      {
          Alert.alert('Message and type must be selected and filled out.');
      }
      else
      {
          this.postFeedback(this.state.currentUser.id, type, this.state.message);
          Actions.pop()
      }
  }

  postFeedback(user_id, type, message)
  {
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
      }
      var putData = {
          user_id: user_id,
          type: type,
          message: message
      }
      Api.post('/feedback',headers, putData).then(resp => {
        console.warn('Feedback Success');
        // console.log('Create Response: ', resp);
        // dispatch(stateLogIn(user));
      }).catch( (ex) => {
        // console.warn(ex);
        // console.warn('Create Fail');
        Alert.alert('Feedback post failed please try again.');
      });
  }

  render() {
    return (
      <View style={styles.scene}>
        <ActionNavBar
          title={'Feedback'}
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
          leftButtonText={'Cancel'}
          rightButtonText={'Submit'}
          submitPressed={() => this.submitFeedback()}
        />
        <Text style={styles.titleText}>I have interesting feedback...</Text>
        <OptionButton onPress={() => this.setState({option:1})} ref={'option1'} title={'Inaccurate Event Information'}/>
        <OptionButton onPress={() => this.setState({option:2})} ref={'option2'} title={'I found a bug or problem'}/>
        <OptionButton onPress={() => this.setState({option:3})} ref={'option3'} title={'I\'d like to suggest a new feature'}/>
        <OptionButton onPress={() => this.setState({option:4})} ref={'option4'} title={'Missing Event'}/>
        <OptionButton onPress={() => this.setState({option:5})} ref={'option5'} title={'Miscellaneous'}/>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder={'Description'}
          placeholderTextColor={appColors.DARK_GRAY}
          onChangeText={(message) => this.setState({message})}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  titleText:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 24,
    color: appColors.BLACK,
    marginHorizontal:8,
    marginVertical:8,
  },
  textInput:{
    height:95,
    marginHorizontal:12,
    padding:8,
    borderWidth:1.5,
    borderColor: appColors.GRAY,
    borderRadius:4,
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    color: appColors.BLACK,
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


export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
