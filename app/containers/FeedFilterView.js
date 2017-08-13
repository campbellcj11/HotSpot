import React, { Component } from 'react';
import { appStyleVariables, appColors } from '../styles';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import Moment from 'moment'
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
  InteractionManager,
} from 'react-native';

class FeedFilterView extends Component {
  constructor(props){
    super(props);
    this.state = {
      interests: this.props.interests,
      showingOnlyFavorites: false,
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.interests != this.props.interests){
      this.setState({interests:nextProps.interests});
    }
  }
  showOnlyFavoritesPressed(){
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
    this.setState({showingOnlyFavorites: !this.state.showingOnlyFavorites},function(){
        this.props.toggleShouldShowOnlyFavorites();
    });
  }
  render(){
    var dateFilterText = '';
    if(this.props.dateFilterType == 'Custom')
    {
      var startDateText = Moment(this.props.startDate).format('M/D/YY');
      var endDateText = Moment(this.props.endDate).format('M/DD/YY');
      dateFilterText = startDateText +  '-' + endDateText;
    }
    else {
      dateFilterText = this.props.dateFilterType;
    }
    return(
      <View style={[styles.container,{height:this.props.height}]}>
        {/*<Text style={styles.title}>Show me...</Text>*/}
        <View style={styles.bottomHolder}>
          <TouchableHighlight underlayColor={'transparent'} style={styles.filterButton} onPress={() => Actions.feedInterestFilter()}>
            <Text style={styles.filterButtonText}>{ (this.state.interests && this.state.interests.length > 0) ? this.state.interests.length + ' interests' : 'All Interests'}</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} style={styles.filterButton} onPress={() => Actions.feedDateFilter()}>
            <Text style={styles.filterButtonText}>{dateFilterText}</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} style={ this.state.showingOnlyFavorites ? styles.selectedFilterButton : styles.filterButton} onPress={() => this.showOnlyFavoritesPressed()}>
            <Text style={ this.state.showingOnlyFavorites ? styles.selectedfilterButtonText : styles.filterButtonText}>Favorites</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: appStyleVariables.NAVIGATION_HEADER_BACKGROUND_COLOR,
    alignItems:'center',
  },
  title:{
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 18,
    color: appColors.WHITE,
    marginVertical:16,
  },
  bottomHolder:{
    flexDirection:'row',
    marginHorizontal: 8,
    marginVertical:8,
    justifyContent:'space-between',
  },
  filterButton:{
    marginHorizontal:4,
    backgroundColor: '#FFFFFF10',
    borderColor: appColors.WHITE,
    borderWidth: 1,
    borderRadius: 4,
  },
  filterButtonText:{
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 14,
    color: appColors.WHITE,
    marginVertical:8,
    marginHorizontal:8,
  },
  selectedFilterButton:{
    marginHorizontal:4,
    backgroundColor: '#FFFFFF10',
    borderColor: appColors.RED,
    borderWidth: 1,
    borderRadius: 4,
  },
  selectedfilterButtonText:{
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 14,
    color: appColors.RED,
    marginVertical:8,
    marginHorizontal:8,
  },
});

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


export default connect(mapStateToProps, mapDispatchToProps)(FeedFilterView);
