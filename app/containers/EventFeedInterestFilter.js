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
import { INTERESTS } from '../lib/constants.js';
import Button from '../components/Button'

//npm packages

//components
import ActionNavBar from '../components/ActionNavBar'
//Class variables
const STATUS_BAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const HEADER_BAR_HEIGHT = 44;
var {width,height} = Dimensions.get('window');

class EventFeedInterestFilter extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      selectedInterests: this.props.selectedInterests ? this.props.selectedInterests : [],
    }
  }
  componentWillReceiveProps(nextProps){

  }
  interestSelected(sentInterest){
    if(this.state.selectedInterests.indexOf(sentInterest) == -1)
    {
      var interests = this.state.selectedInterests;
      interests.push(sentInterest);
      this.setState({selectedInterests:interests});
    }
    else {
      var interests = this.state.selectedInterests;
      var index = interests.indexOf(sentInterest);
      interests.splice(index,1);
      this.setState({selectedInterests:interests});
    }
  }
  submitPressed(){
    // this.props.submitPressed();
    this.props.setLocalInterests(this.state.selectedInterests);
    Actions.pop()
  }
  render() {
    interests = INTERESTS;

    var interestsViews = [];
    for (i in interests){
        var interest = interests[i];
        var isSelected = this.state.selectedInterests.indexOf(interest) == -1 ? false : true;
        interestsViews.push(
            <Button ref={interest} underlayColor={'transparent'} key={i} style={isSelected ? styles.selectedCell : styles.interestCell} textStyle={isSelected ? styles.selectedCellText : styles.interestCellText} onPress={this.interestSelected.bind(this,interest)}>{interest.toUpperCase()}</Button>
        );
    }
    return (
      <View style={styles.scene}>
        <ActionNavBar
          title={'Interest Filter'}
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
          leftButtonText={'Cancel'}
          rightButtonText={'Submit'}
          submitPressed={() => this.submitPressed()}
        />
          <View style={{flex:1}}>
            <ScrollView>
              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                {interestsViews}
              </View>
            </ScrollView>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
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
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 16,
    color: '#848484',
  },
  selectedCellText:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 15,
    color: '#0B82CC',
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    selectedInterests: state.app.localInterests,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EventFeedInterestFilter);
