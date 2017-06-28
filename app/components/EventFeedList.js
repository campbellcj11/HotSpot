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
    if(nextProps.events != this.props.events){
      // console.warn('Has new events');
      // console.warn('Next Events: ', nextProps.events);
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
    // if(! this.state.refreshing){
    //   this.setState({loadingMore:true});
    //   var nextPage = this.state.page + 1;
    //   this.props.loadMore({
    //     page:nextPage,
    //     currentEvents:this.props.events,
    //     locationID:this.props.locationID,
    //   });
    //   this.setState({page:nextPage});
    // }
  }
  renderRow(rowData){
    return (
      <EventCell rowData={rowData}/>
    )
  }
  renderFooter(){
    var viewToShow = null;

    if(this.state.loadingMore)
    {
      viewToShow = <Text>Loading More Events</Text>
    }

    if(this.state.events.length == 0)
    {
      viewToShow = <Text>No Events Found</Text>
    }

    return viewToShow
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
        renderFooter={() => this.renderFooter()}
      />
    )
  }
}

const styles = StyleSheet.create({

});
