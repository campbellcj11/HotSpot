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
  ActivityIndicator,
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
      happeningNowEvents: [],
      popularEvents: [],
      dataSource: ds.cloneWithRows([]),
      searching: false,
      haveSearched: false,
      refreshing: false,
      reloadingHappeningNow: false,
      reloadingPopular: false,
    }
  }
  componentDidMount(){
    this.getHappeningNow();
    this.getPopular();
  }
  componentWillReceiveProps(nextProps){

  }
  updateText(text){
    this.setState({searchText: text}, function(){
      clearTimeout(this.getEventsTimeout);
      this.getEventsTimeout = setTimeout(() => this.getEvents(), 850);
    });
  }
  getHappeningNow(){
    this.setState({reloadingHappeningNow:true});
    this.props.getNowEvents({
      page:1,
      startDate:new Date(),
      pageSize: 4,
      showCount:true,
    }).then((nowEvents) => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        happeningNowEvents: nowEvents,
        reloadingHappeningNow: false,
      });
    }).catch( (ex) => {
      this.setState({
        happeningNowEvents: [],
        reloadingHappeningNow: false,
      })
    });
  }
  getPopular(){
    this.setState({reloadingPopular:true});
    this.props.getPopular({
      page:1,
      startDate:new Date(),
      pageSize: 4,
      showCount:true,
    }).then((nowEvents) => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        popularEvents: nowEvents,
        reloadingPopular: false,
      });
    }).catch( (ex) => {
      this.setState({
        popularEvents: [],
        reloadingPopular: false,
      })
    });
  }
  getEvents(){
    this.setState({searching: true,haveSearched:true,refreshing:false})
    this.props.searchEvents({
      page:1,
      startDate:new Date(),
      showCount:true,
      searchText: ('%' + this.state.searchText + '%')
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
      searchText: ('%' + this.state.searchText + '%')
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
      return <ActivityIndicator style={{marginTop:4}}/>
    }
    return null;
  }
  renderHappeningNow(){
    var arr = [];
    for(var i=0;i<this.state.happeningNowEvents.length;i++)
    {
      var event = this.state.happeningNowEvents[i];
      arr.push(
        <TouchableHighlight key={i} underlayColor={'transparent'} style={{height:144,width:85,marginLeft:4,borderRadius:4}} onPress={this.openEvent.bind(this,event)}>
          <Image style={{width:85,height:144,justifyContent:'flex-end',borderRadius:4,padding:2}} source={{uri:event.image}}>
            <Text style={{backgroundColor:'#00000030',color:appColors.WHITE,fontFamily:appStyleVariables.SYSTEM_BOLD_FONT,fontSize:12}}>{event.name}</Text>
          </Image>
        </TouchableHighlight>
      )
    }
    var reloadView = ( this.state.reloadingHappeningNow ?
      <View style={{flexDirection:'row'}}>
        <Text>Loading...</Text>
      </View>
      :
      <TouchableHighlight underlayColor={'transparent'} style={{marginVertical:8,justifyContent:'center'}} onPress={() => this.getHappeningNow()}>
        <View style={{flexDirection:'row'}}>
          <Text>Nothing found.</Text>
        <Text style={{color:appColors.LIGHT_BLUE}}>  Try again</Text>
        </View>
      </TouchableHighlight>
    )
    return(
      <View style={{flexDirection:'row',justifyContent:this.state.happeningNowEvents.length > 0 ? 'flex-start' : 'center',paddingLeft:4,paddingRight:4,marginVertical:4}}>
        {this.state.happeningNowEvents.length > 0 ? arr : reloadView}
      </View>
    )
  }
  openEvent(event){
    Actions.eventPage({currentSelection: event})
  }
  renderPopular(){
    var arr = [];
    for(var i=0;i<this.state.popularEvents.length;i++)
    {
      var event = this.state.popularEvents[i];
      arr.push(
        <TouchableHighlight key={i} underlayColor={'transparent'} style={{height:144,width:85,marginLeft:4,borderRadius:4}} onPress={this.openEvent.bind(this,event)}>
          <Image style={{width:85,height:144,justifyContent:'flex-end',borderRadius:4,padding:2}} source={{uri:event.image}}>
            <Text style={{backgroundColor:'#00000030',color:appColors.WHITE,fontFamily:appStyleVariables.SYSTEM_BOLD_FONT,fontSize:12}}>{event.name}</Text>
          </Image>
        </TouchableHighlight>
      )
    }
    var reloadView = ( this.state.reloadingPopular ?
      <View style={{flexDirection:'row'}}>
        <Text>Loading...</Text>
      </View>
      :
      <TouchableHighlight underlayColor={'transparent'} style={{marginVertical:8,justifyContent:'center'}} onPress={() => this.getPopular()}>
        <View style={{flexDirection:'row'}}>
          <Text>Nothing found.</Text>
        <Text style={{color:appColors.LIGHT_BLUE}}>  Try again</Text>
        </View>
      </TouchableHighlight>
    )
    return(
      <View style={{flexDirection:'row',justifyContent:this.state.popularEvents.length > 0 ? 'flex-start' : 'center',paddingLeft:4,paddingRight:4,marginVertical:4}}>
        {this.state.popularEvents.length > 0 ? arr : reloadView}
      </View>
    )
  }
  render() {
    return (
      <View style={styles.scene}>
        <BasicNavBar
          title={'Discover'}
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
        />
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search</Text>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Happening Now</Text>
            {this.renderHappeningNow()}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Near Me</Text>
            {this.renderPopular()}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: appColors.GRAY,
  },
  section: {
    backgroundColor: appColors.WHITE,
    marginBottom:16,
  },
  sectionTitle:{
    textAlign: 'center',
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    color: appColors.ORANGE,
    fontSize: 18,
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
