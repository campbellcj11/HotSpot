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
    }
  }
  componentWillReceiveProps(nextProps){

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
          submitPressed={() => Actions.pop()}
        />
        <Text style={styles.titleText}>Let me tell you about...</Text>
        <OptionButton ref={'option1'} title={'Inaccurate Event Information'}/>
        <OptionButton ref={'option2'} title={'A bug I found'}/>
        <OptionButton ref={'option3'} title={'A feature I want'}/>
        <OptionButton ref={'option4'} title={'Something else'}/>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder={'Description'}
          placeholderTextColor={appColors.DARK_GRAY}
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
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
