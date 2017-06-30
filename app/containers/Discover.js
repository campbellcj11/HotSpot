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
import BasicNavBar from '../components/BasicNavBar'
import searchIcon from '../images/search.png'
import EventCell from '../components/EventCell'
//Class variables
const STATUS_BAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const HEADER_BAR_HEIGHT = 44;
var {width,height} = Dimensions.get('window');

class Discover extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      searchText: '',
      searchEvents: [],
      dataSource: ds.cloneWithRows([]),
      searching: false,
      haveSearched: false,
      refreshing: false,
    }
  }
  componentWillReceiveProps(nextProps){

  }
  updateText(text){
    this.setState({searchText: text}, function(){
      clearTimeout(this.getEventsTimeout);
      this.getEventsTimeout = setTimeout(() => this.getEvents(), 850);
    });
  }
  getEvents(){
    this.setState({searching: true,haveSearched:true,refreshing:false})
    this.props.searchEvents({
      page:1,
      startDate:new Date(),
      showCount:true,
      searchText: this.state.searchText
    }).then((searchEvents) => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        searchEvents: searchEvents,
        dataSource: ds.cloneWithRows(searchEvents),
        searching: false,
        refreshing: false,
      });
    });
  }
  onRefresh(){
    this.setState({searching: true,haveSearched:true,refreshing:true})
    this.props.searchEvents({
      page:1,
      startDate:new Date(),
      showCount:true,
      searchText: this.state.searchText
    }).then((searchEvents) => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        searchEvents: searchEvents,
        dataSource: ds.cloneWithRows(searchEvents),
        searching: false,
        refreshing: false,
      });
    });
  }
  renderRow(rowData){
    return (
      <EventCell rowData={rowData}/>
    )
  }
  renderFooter(){
    if(this.state.searchEvents.length == 0 && this.state.haveSearched){
      return <Text style={{marginTop:4,textAlign:'center'}}>{'Sorry we didnt find anything'}</Text>
    }
    if(this.state.searching)
    {
      return <ActivityIndicator style={{marginTop:4,}}/>
    }
    return null;
  }
  render() {
    return (
      <View style={styles.scene}>
        <BasicNavBar
          title={'Discover'}
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
        />
        <View style={styles.searchHolder}>
          <Image style={{width:16,height:16,tintColor:appColors.DARK_GRAY}} source={searchIcon}/>
          <TextInput
            style={styles.textInput}
            multiline={false}
            placeholder={'Search for events'}
            placeholderTextColor={appColors.DARK_GRAY}
            onChangeText={(searchText) => this.updateText(searchText)}
          />
        </View>
        <ListView
          style={{backgroundColor:appColors.GRAY}}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          renderFooter={() => this.renderFooter()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: appColors.GRAY,
  },
  searchHolder:{
    backgroundColor: appColors.WHITE,
    flexDirection: 'row',
    paddingHorizontal:8,
    alignItems:'center',
  },
  textInput:{
    flex:1,
    height:45,
    marginHorizontal:12,
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 14,
    color: appColors.BLACK,
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Discover);
