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
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
//components
import EventCell from './EventCell'

class EventFeedList extends Component {
  constructor(props){
    super(props);
    this.state = {
      events: this.props.fetchedEventsHash[this.props.locationID] ? this.props.fetchedEventsHash[this.props.locationID] : [],
      refreshing: false,
      page:1,
      loadingMore: false,
      outOfEvents: false,
      shouldReload: this.props.shouldReloadLists,
      favorites: this.props.favorites ? this.props.favorites : [],
      shouldShowOnlyFavorites: this.props.shouldShowOnlyFavorites,
    }
  }
  componentWillReceiveProps(nextProps){
    var events = nextProps.fetchedEventsHash[this.props.locationID];
    if( ! this.listsHaveSameObjects(events,this.state.events))
    {
      clearTimeout(this.updateEventsTimeout);
      this.updateEventsTimeout = setTimeout(() => {
        this.setState({
          loadingMore:false,
          events: events,
          outOfEvents:false,
        });
      }, 500);
    }
    else
    {
      if(events.length == 0)
      {
        clearTimeout(this.updateEventsTimeout);
        this.updateEventsTimeout = setTimeout(() => {
          this.setState({
            loadingMore:false,
            outOfEvents: true,
          });
        }, 500);
      }
      else
      {
        this.updateEventsTimeout = setTimeout(() => {
          this.setState({
            loadingMore:false,
            outOfEvents: true,
          });
        }, 500);
      }
    }
    // if(events != this.props.fetchedEventsHash[this.props.locationID] && events.length > 0){
    //     this.setState({
    //       events: events,
    //       outOfEvents: false,
    //       loadingMore: true,
    //     }, function(){
    //       // if(this.state.loadingMore){
    //       //   clearTimeout(this.updateEventsTimeout);
    //       //   this.updateEventsTimeout = setTimeout(() => {this.setState({loadingMore:false})}, 500)
    //       // }
    //     })
    // }
    // else if(events.length == 0){
    //   clearTimeout(this.updateEventsTimeout);
    //     this.setState({
    //       events: nextProps.events,
    //       outOfEvents: true,
    //       loadingMore: false,
    //     });
    // }

    if(nextProps.shouldReloadLists != this.props.shouldReloadLists){
      if(nextProps.shouldReloadLists)
      {
        clearTimeout(this.reloadTimeout);
        this.reloadTimeout = setTimeout(() => this.reloadList(), 500)
      }
    }

    if(nextProps.favorites != this.props.favorites){
      this.setState({favorites: nextProps.favorites});
    }
    if(nextProps.shouldShowOnlyFavorites != this.props.shouldShowOnlyFavorites){
      this.setState({shouldShowOnlyFavorites: nextProps.shouldShowOnlyFavorites});
    }
  }
  listsHaveSameObjects(newList,oldList){
    var areListsTheSame = true;
    if(newList.length != oldList.length)
    {
      areListsTheSame = false;
    }
    else
    {
      for(var i=0;i<newList.length;i++)
      {
        var newObject = newList[i];
        var oldObject = oldList[i];

        if(newObject.id != oldObject.id)
        {
          areListsTheSame = false;
          break;
        }
      }
    }
    return areListsTheSame;
  }
  reloadList(){
    this.setState({
      events: [],
      page:1,
      loadingMore: true,
      outOfEvents: false,
    })
  }
  onRefresh(){
    this.setState({refreshing: true, loadingMore: true});
    this.props.onRefresh(this.props.locationID);
    this.setState({refreshing: false,page:0,outOfEvents:false});
  }
  loadMore(){
    // if(! this.state.refreshing && ! this.state.loadingMore && !this.state.outOfEvents){
    if(! this.state.loadingMore && !this.state.outOfEvents){
      var nextPage = this.state.page + 1;
      this.setState({page:nextPage,loadingMore:true}, function(){
        this.props.loadMore({
          page:nextPage,
          currentEvents:this.state.events,
          locationID:this.props.locationID,
        });
      });
    }
  }
  setFavorites(idOfEventPressed){
    var favorites = this.state.favorites ? this.state.favorites : [];

    if(favorites.indexOf(idOfEventPressed) == -1){
      favorites.push(idOfEventPressed);
    }
    else
    {
      var index = favorites.indexOf(idOfEventPressed);
      favorites.splice(index,1);
    }
    this.props.setFavorites(favorites);
  }
  renderRow(rowData){
    var isFavorited = this.state.favorites.indexOf(rowData.id) != -1;
    return (
      <EventCell rowData={rowData} onlyShowIfFavorited={this.state.shouldShowOnlyFavorites} isFavorited={isFavorited} pressFavorite={(idOfEventPressed) => this.setFavorites(idOfEventPressed)}/>
    )
  }
  renderFooter(){
    var viewToShow = null;

    if(this.state.loadingMore)
    {
      viewToShow = <ActivityIndicator style={{marginTop:4,}}/>;
    }
    else if(this.state.events.length == 0)
    {
      viewToShow = (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.onRefresh()}>
          <View style={{justifyContent:'center'}}>
            <Text style={{textAlign:'center'}}>No Events Found</Text>
            <Text style={{textAlign:'center'}}>Try changing your filters</Text>
          </View>
        </TouchableHighlight>)
    }

    if(this.state.outOfEvents && !this.state.loadingMore && this.state.events.length != 0)
    {
      viewToShow = <Text>That's all for now</Text>
    }
    return (
      <View style={{alignItems:'center',justifyContent:'center'}}>
        {viewToShow}
      </View>
    )
  }
  render(){
    return(
      <FlatList
        key={this.state.shouldShowOnlyFavorites}
        style={{backgroundColor:appColors.GRAY}}
        data={this.state.events}
        renderItem={({item}) => this.renderRow(item)}
        keyExtractor={(item, index) => item.id}
        initialNumToRender={3}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        onEndReachedThreshold={250}
        onEndReached={() => this.loadMore()}
        ListFooterComponent={() => this.renderFooter()}
      />
    )
  }
}

const styles = StyleSheet.create({

});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    fetchedEvents: state.events.fetchedEvents,
    fetchedEventsHash: state.events.fetchedEventsHash,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EventFeedList);
