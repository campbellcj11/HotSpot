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
} from 'react-native';

//components
import EventCell from './EventCell'

export default class EventFeedList extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      events: this.props.events ? this.props.events : [],
      dataSource: ds.cloneWithRows(this.props.events),
      refreshing: false,
      page:1,
      loadingMore: true,
      outOfEvents: false,
      shouldReload: this.props.shouldReloadLists,
      favorites: this.props.favorites ? this.props.favorites : [],
      shouldShowOnlyFavorites: this.props.shouldShowOnlyFavorites,
      haveLoadedMore: false,
      shouldLoadMore: true,
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.events != this.props.events && nextProps.events.length > 0){
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          events: nextProps.events,
          dataSource: ds.cloneWithRows(nextProps.events),
          outOfEvents: false,
        }, function(){
          if(this.state.loadingMore){
            clearTimeout(this.updateEventsTimeout);
            this.updateEventsTimeout = setTimeout(() => {this.setState({loadingMore:false})}, 500)
          }
        })
    }
    else {
      clearTimeout(this.updateLoadingState);
      this.updateLoadingState = setTimeout(() => {
        if(this.state.loadingMore){
          this.setState({
            loadingMore: false,
          })
        }
        else {
          if(nextProps.events.length != 0)
          {
            this.setState({
              outOfEvents: true,
              loadingMore: false,
              shouldLoadMore: false,
            })
          }
        }
      }, 500)
    }

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
  reloadList(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      events: [],
      dataSource: ds.cloneWithRows([]),
      page:1,
      loadingMore: true,
      outOfEvents: false,
      shouldLoadMore: true,
    })
  }
  onRefresh(){
    this.setState({refreshing: true, loadingMore: true});
    this.props.onRefresh(this.props.locationID);
    this.setState({refreshing: false,page:0,outOfEvents:false,shouldLoadMore:true});
  }
  loadMore(){
    if(! this.state.refreshing && ! this.state.loadingMore){
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

    if(this.state.outOfEvents && !this.state.loadingMore)
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
      <ListView
        key={this.state.shouldShowOnlyFavorites}
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
        onEndReached={!this.state.loadingMore && this.state.shouldLoadMore ? () => this.loadMore() : null}
        renderFooter={() => this.renderFooter()}
      />
    )
  }
}

const styles = StyleSheet.create({

});
