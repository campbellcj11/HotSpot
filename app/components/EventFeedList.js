import React, { Component } from 'react';
import { appStyleVariables, appColors } from '../styles';
import {
  ListView,
  View,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
  RefreshControl,
  Dimensions,
} from 'react-native';

//components
import EventCell from './EventCell'

export default class EventFeedList extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      events: this.props.events,
      dataSource: ds.cloneWithRows(this.props.events),
      refreshing: false,
      page:0,
      loadingMore: false,
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.events){
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        events: nextProps.events,
        dataSource: ds.cloneWithRows(nextProps.events),
      }, function(){
        if(this.state.loadingMore){
          this.setState({loadingMore:false});
        }
      })
    }
  }
  onRefresh(){
    this.setState({refreshing: true});
    this.props.onRefresh(this.props.locationID);
    this.setState({refreshing: false,page:0});
  }
  loadMore(){
    if(! this.state.refreshing){
      this.setState({loadingMore:true});
      var nextPage = this.state.page + 1;
      this.props.loadMore({
        page:nextPage,
        currentEvents:this.props.events,
        locationID:this.props.locationID,
      });
      this.setState({page:nextPage});
    }
  }
  renderRow(rowData){
    return (
      <EventCell rowData={rowData}/>
    )
  }
  render(){
    return(
      <ListView
        key={this.props.locationID}
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
        onEndReachedThreshold={250}
        onEndReached={!this.state.loadingMore ? () => this.loadMore() : null}
        renderFooter={
          this.state.loadingMore ? (() => <Text>Loading More Events</Text>) : null
        }
      />
    )
  }
}

const styles = StyleSheet.create({

});
