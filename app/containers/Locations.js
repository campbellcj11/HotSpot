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
      possibleLocations: this.props.possibleLocations ? this.props.possibleLocations : [],
      possibleLocationsHash: {},
      loading:true,
    }
    data = this.createDataHashForLocations(this.state.locations);
    order = this.getDataHashOrder(this.state.locations);
  }
  componentDidMount(){
    if(this.state.possibleLocations.length == 0)
    {
      this.props.getPossibleLocations();
    }
    else
    {
      this.processPossibleLocations(this.state.possibleLocations);
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.userLocations != this.props.userLocations){
      this.setState({locations: nextProps.userLocations ? nextProps.userLocations : []})
    }

    if(nextProps.possibleLocations != this.props.possibleLocations || nextProps.possibleLocations.length == 0){
      this.processPossibleLocations(nextProps.possibleLocations);
      this.setState({possibleLocations: nextProps.possibleLocations ? nextProps.possibleLocations : [],loading:false})
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
    console.log('Locations: ', this.state.locations);
    // this.props.updateLocales(this.state.locations);
    var newArray = [];
    for(var i=0; i < this.state.locations.length; i++){
      newArray.push(this.state.locations[i]);
    }
    var newUser = this.clone(this.props.user);
    newUser.locales = newArray;
    this.props.updateUserWithNewLocales(newUser);
    Actions.pop();
  }
  processPossibleLocations(sentPossibleLocations)
  {
    var hash = {};
    for(var i=0;i<sentPossibleLocations.length;i++)
    {
      var possibleLocation = sentPossibleLocations[i];
      if(Object.keys(hash).indexOf(possibleLocation.state) == -1)
      {
        hash[possibleLocation.state] = [possibleLocation];
      }
      else
      {
        var hashArray = hash[possibleLocation.state];
        hashArray.push(possibleLocation);
        hash[possibleLocation.state] = hashArray;
      }
    }
    this.setState({possibleLocationsHash:hash});
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
  updateLocationsOrder(locations){
    this.setState({locations: locations});
  }
  toggleLocation(location){
    var locations = this.state.locations;
    var foundLocation;
    var wasFound = false;
    for(var i=0;i<locations.length;i++)
    {
      var userLocation = locations[i];
      if(location.id == userLocation.id)
      {
        foundLocation = userLocation;
        wasFound = true;
        break;
      }

    }
    if(wasFound)
    {
      var index = locations.indexOf(foundLocation);
      locations.splice(index,1);
      this.setState({locations:locations});
    }
    else
    {
      locations.push(location);
    }
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
    this.setState({locations: locations});
  }
  renderRow(rowData){
    //<LocationCell rowData={rowData}/>
    return (
      <LocationCell rowData={rowData}/>
    )
  }
  renderLocation(location){
    var boxWidth = (width*.85)/3;
    var isSelected = false;
    for(var i=0;i<this.state.locations.length;i++)
    {
      var userLocation = this.state.locations[i];
      if(location.id == userLocation.id)
      {
        isSelected = true;
        break;
      }
    }
    return (
      <TouchableHighlight key={location.id} underlayColor={'transparent'} onPress={this.toggleLocation.bind(this,location)}>
        <View style={{width:boxWidth,height:66,justifyContent:'center',alignItems:'center',marginBottom:8}}>
          <Image style={{width:44,height:44,borderRadius:22,backgroundColor: isSelected ? appColors.LIGHT_BLUE : appColors.DARK_GRAY}} source={location.image}/>
          <Text style={{fontFamily:appStyleVariables.SYSTEM_REGULAR_FONT,fontSize:14,color: isSelected ? appColors.LIGHT_BLUE : appColors.DARK_GRAY}}>{location.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  renderLocationSection(state,locations){
    locationsViews = [];
    for(var i=0;i<locations.length;i++)
    {
      var location = locations[i];
      locationsViews.push(
        this.renderLocation(location)
      )
    }
    return (
      <View key={state} style={{flexDirection:'row',alignItems:'center',paddingTop:8,marginHorizontal:8,borderBottomWidth:1,borderBottomColor: appColors.DARK_GRAY}}>
        <View style={{flex:.1}}>
          <Text style={{fontFamily:appStyleVariables.SYSTEM_BOLD_FONT,fontSize:24,color:appColors.BLACK}}>{state}</Text>
        </View>
        <View style={{flex:.9,flexDirection:'row',flexWrap:'wrap'}}>
          {locationsViews}
        </View>
      </View>
    )
  }
  renderPossibleLocations(){
    var possibleLocationsViews = [];
    for(var i=0;i<Object.keys(this.state.possibleLocationsHash).length;i++)
    {
      var state = Object.keys(this.state.possibleLocationsHash)[i];
      var locations = this.state.possibleLocationsHash[state];
      if(locations)
      {
        possibleLocationsViews.push(
          this.renderLocationSection(state,locations)
        )
      }
    }
    return possibleLocationsViews
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
        {
          this.state.loading ?
            null
          :
            //<Horizontal data={this.state.locations} updateLocationsOrder={(locations) => this.updateLocationsOrder(locations)}/>
            null
        }
        {
          this.state.loading ?
            <ActivityIndicator style={{marginTop:4}}/>
          :
            <View style={{flex:1}}>
              <ScrollView width={width}>
                {this.renderPossibleLocations()}
              </ScrollView>
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor:appColors.GRAY
  },
  container: {
    justifyContent: 'center',
    backgroundColor: appColors.DEEP_BLUE,
  },
  titleHolder:{
    marginVertical:8,
    marginLeft:8,
    flexDirection:'row',
    alignItems:'flex-end',
  },
  title: {
    fontFamily: appStyleVariables.SYSTEM_BOLD_FONT,
    fontSize: 20,
    color: appColors.WHITE,
  },
  subTitle: {
    fontFamily: appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize: 12,
    marginHorizontal:4,
    color: appColors.WHITE,
  },
  contentContainer: {
    paddingVertical:4,
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    userLocations: state.user.user.locales ? state.user.user.locales : [],
    possibleLocations: state.app.possibleLocations ? state.app.possibleLocations : [],
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Locations);

/**
 * Sample React Native App
 * httpss://github.com/facebook/react-native
 * @flow
 */

// import React, { Component } from 'react';
import {
  Animated,
  Easing,
} from 'react-native';
import SortableList from 'react-native-sortable-list';

const window = Dimensions.get('window');

class Horizontal extends Component {
  constructor(props) {
    super(props);
  }
  turnArrayToHash(sentData){
    hash = {};
    for(var i=0;i<sentData.length;i++){
      var object = sentData[i];
      hash[i] = object;
    }
    return hash;
  }
  turnHashToArray(sentHash,order){
    var array = [];
    for(var i=0;i<order.length;i++){
      var object = sentHash[order[i]];
      array.push(object);
    }
    return array;
  }
  exportData(rowKeys){
    // var rows = this.turnHashToArray(this.turnArrayToHash(this.props.data),rowKeys);
    // this.props.updateLocationsOrder(rows);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleHolder}>
          <Text style={styles.title}>Reorder</Text>
          <Text style={styles.subTitle}>Hold and Drag</Text>
        </View>
        {
          this.props.data.length == 0 ?
            <View style={[styles2.list,{justifyContent:'center',alignItems:'center'}]}>
              <Text style={{textAlign:'center',color:appColors.WHITE}}>No Locations Added</Text>
            </View>
          :
            <SortableList
              horizontal
              style={styles2.list}
              contentContainerStyle={styles.contentContainer}
              data={this.turnArrayToHash(this.props.data)}
              renderRow={this._renderRow}
              onChangeOrder={(rowKeys) => this.exportData(rowKeys)}
            />
        }
      </View>
    );
  }

  _renderRow = ({data, active}) => {
    return <Row data={data} active={active} />
  }
}

class Row extends Component {

  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
        },
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
   const {data, active} = this.props;

    return (
      <Animated.View style={[
        styles2.row,
        this._style,
      ]}>
        <Image source={{uri: data.image}} style={styles2.image} />
        <Text style={styles2.text}>{data.name}</Text>
      </Animated.View>
    );
  }
}

const styles2 = StyleSheet.create({



  list: {
    height: 74,
    width: window.width,
  },



  row: {
    alignItems: 'center',
    width: 88,
    height: 66,
    borderRadius: 22,
  },

  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor:'white',
  },

  text: {
    fontFamily:appStyleVariables.SYSTEM_REGULAR_FONT,
    fontSize:14,
    color: appColors.WHITE,
  },
});
