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
import SortableListView from 'react-native-sortable-listview'
//components
import ActionNavBar from '../components/ActionNavBar'
import LocationCell from '../components/LocationCell'
//Class variables
const STATUS_BAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const HEADER_BAR_HEIGHT = 44;
var {width,height} = Dimensions.get('window');

class Locations extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      locations: this.props.userLocations ? this.props.userLocations : [],
    }
    data = this.createDataHashForLocations(this.state.locations);
    order = this.getDataHashOrder(this.state.locations);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.userLocations != this.props.userLocations){
      this.setState({locations: nextProps.userLocations ? nextProps.userLocations : []})
    }
  }
  clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
      }
      return copy;
  }
  submitPressed(){
    var newArray = [];
    for(var i=0; i < order.length; i++){
      newArray.push(data[order[i]]);
    }
    var newUser = this.clone(this.props.user);
    newUser.locales = newArray;
    // console.log('LCS: ',newUser.locales);
    // console.log(newUser);
    this.props.updateUserWithNewLocales(newUser);
    Actions.pop();
  }
  createDataHashForLocations(locations){
    dataHash = {};
    for(var i=0;i<locations.length;i++){
      var location = locations[i];
      dataHash[location.id] = location;
    }
    return dataHash
  }
  getDataHashOrder(array){
    var order = [];
    for(var i=0;i<array.length;i++){
      var location = array[i];
      order.push(location.id);
    }
    return order;
  }
  renderRow(rowData){
    //<LocationCell rowData={rowData}/>
    return (
      <LocationCell rowData={rowData}/>
    )
  }
  render() {
    return (
      <View style={styles.scene}>
        <ActionNavBar
          title={'Locations'}
          paddingTop={STATUS_BAR_HEIGHT}
          height={HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT}
          leftButtonText={'Cancel'}
          rightButtonText={'Update'}
          submitPressed={() => this.submitPressed()}
        />
        <SortableListView
          style={{flex: 1}}
          data={data}
          order={order}
          onRowMoved={e => {
            order.splice(e.to, 0, order.splice(e.from, 1)[0]);
            this.forceUpdate();
          }}
          renderRow={(rowData) => this.renderRow(rowData)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    userLocations: state.user.user.locales ? state.user.user.locales : [],
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Locations);
