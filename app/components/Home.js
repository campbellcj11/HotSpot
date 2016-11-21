import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Image,
  Dimensions,
  TouchableHighlight,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import backgroundImage from '../images/City-Dark.png'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import logoutImage from '../images/arrows.png'
import searchImage from '../images/magnifying-glass.png'
import LinearGradient from 'react-native-linear-gradient';
var {width,height} = Dimensions.get('window');
import * as firebase from 'firebase';
import EventCard from './EventCard'
import EventPage from './EventPage'

const HEADER_HEIGHT = 64;
const TAB_HEIGHT = 50;
const CARD_WIDTH = width;
const CARD_HEIGHT = height - HEADER_HEIGHT - TAB_HEIGHT;


export default class Home extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      email:'',
      password:'',
      currentSelection:{},
      hasCurrentSelection: false,
      transparent: true,
      dataSource:ds,
      items: [],
    }
    this.itemsRef = this.getRef().child('events');
    this.currentIndex = 0;
  }

  componentWillMount() {
    this.listenForItems(this.itemsRef);
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          Event_Name: child.val().Event_Name,
          Date: new Date(child.val().Date),
          Location: child.val().Location,
          Image: child.val().Image,
          latitude: child.val().Latitude,
          longitude: child.val().Longitude,
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items),
        items: items,
      });

    });
  }

  _login(){
    var user = {'email': this.state.email,
                'password' : this.state.password};
    this.props.loginUser(user);
  }

  _loginWithoutAccount() {
    user = {'email': 'test@test.com',
            'password' : 'password'};
    this.props.loginUser(user);
  }

  _logout(){
    this.props.logoutUser();
  }

  _resetPassword() {
    //hardcoded for prototype - need to get email from user
    var user = {'email': this.state.email,
                'password' : this.state.password};
    this.props.resetPassword(user.email);
  }
  _browse(){
    Alert.alert(
      'Coming soon',
      'This is the browse feature and it is currently being built',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    )
  }
  _openProfile(){
    Alert.alert(
      'Coming soon',
      'The profile feature and it is currently being built',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    )
  }
  renderRow(rowData){
    return (
      <TouchableHighlight
        onPress={()=> this.pressRow(rowData)}
        underlayColor = '#dddddd'
        style={styles.item}>
          <Image style={styles.item} source={{uri: rowData.Image}}>
            <View style={styles.fader}>
              <Text style={styles.itemText}>{rowData.Event_Name}</Text>
            </View>
          </Image>
      </TouchableHighlight>
    )
  }
  pressRow(rowData) {
    console.log('RowData: ',rowData);
    this.setState({currentSelection:rowData});
    this.setState({hasCurrentSelection:true});
  }
  _closeSelection(){
    this.setState({currentSelection:{}});
    this.setState({hasCurrentSelection:false});
  }
  renderSlides() {
    this.currentIndex = 0;
    var colors = ['white'];
    var eventsPerPage = 3;
    var numberOfPages = Math.ceil(this.state.items.length / eventsPerPage);
    let Arr = new Array(numberOfPages).fill(0).map((a, i) => {
      // console.log('A:',a);
      // var data = this.props.template.entities.slides[a];
      var eventsForPage = []

      for(var j = this.currentIndex ; j < this.currentIndex + eventsPerPage; j++)
      {
        if(j < this.state.items.length)
        {
          eventsForPage.push(this.state.items[j]);
        }
      }

      this.currentIndex = this.currentIndex + eventsPerPage;

      return <EventPage key={i} cellPressed={(cellData) => this.pressRow(cellData)} pageNumber={i} eventsForPage={eventsForPage} eventsPerPage={eventsPerPage} style={[styles.card,{backgroundColor: colors[i % colors.length]}]} width={CARD_WIDTH} height={CARD_HEIGHT}/>
    })
    return (Arr)
  }
  render() {
    console.log('PROPS!')
    console.log(this.props)
    let user, readonlyMessage
    if(this.props.loggedIn && this.props.user != {})
    {
      user = this.props.user
      readonlyMessage = <Text style={styles.offline}>Logged In {user.email}</Text>
    }
    else
    {
      readonlyMessage = <Text style={styles.offline}>Not Logged In</Text>
    }

    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff'}
      : null;

    return (
      <View style={{flex:1}}>
        <StatusBar
          barStyle="light-content"
        />

        <Modal
            animationType={'none'}
            transparent={false}
            visible={!this.props.loggedIn}
        >
          <View style={{flexDirection:'row'}}>
              <LinearGradient colors={['#3023AE', '#C86DD7']} style={styles.linearGradient}>
                <Image source={backgroundImage} style={styles.backgroundImage} textStyle={styles.buttonText}/>
                <Text style={styles.title}>
                  Project
                  <Text style={[styles.title,{color:'#FFF907'}]}>
                    Now
                  </Text>
                </Text>
                <View style={styles.userNameView}>
                  <TextInput style={styles.userNameTextInput}
                    ref='email'
                    onChangeText={(email) => this.setState({email})}
                    placeholder='Email'
                    placeholderTextColor='#D3C6E2'>
                  </TextInput>
                </View>

                <View style={styles.userNameView}>
                  <TextInput style={styles.userNameTextInput}
                    secureTextEntry={true}
                    ref='password'
                    onChangeText={(password) => this.setState({password})}
                    placeholder='Password'
                    placeholderTextColor='#D3C6E2'>
                  </TextInput>
                </View>
                <Button
                  onPress={() => this._login()}
                  style={styles.loginButton}
                  textStyle={styles.buttonText}>
                  Login
                </Button>
                <Button
                  onPress={() => this._loginWithoutAccount()}
                  style={styles.loginBlankButton}
                  textStyle={styles.buttonBlankText}>
                  Login without an Account
                </Button>
              </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType='fade'
          transparent={false}
          visible={this.state.hasCurrentSelection}
        >
            <EventCard currentSelection={this.state.currentSelection} closeSelection={() => this._closeSelection()}/>
        </Modal>


        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            automaticallyAdjustInsets={true}
            scrollsToTop={true}
            horizontal={false}
            decelerationRate={0}
            snapToInterval={CARD_HEIGHT}
            snapToAlignment="start"
            contentContainerStyle={styles.content}
          >
            {this.renderSlides()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: HEADER_HEIGHT,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  innerContainer: {

  },
  list: {
    marginTop: 20,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    backgroundColor: '#CCC',
    width: width/3,
    height: 100,
  },
  fader: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  itemText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#48BBEC',
    fontSize: 15,
    fontFamily: 'Futura-Medium',
    padding: 2,
  },
  offline: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  modalButton: {
    margin: 10,
    backgroundColor: 'rgb(56,198,95)',
    height: 50,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    top: height*.6,
    height: height*.45,
    resizeMode: 'stretch', // or 'stretch'
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  loginButton: {
    top: 100,
    backgroundColor: '#C123E2',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#D200FF',
  },
  loginBlankButton: {
    top: 100,
    backgroundColor: 'transparent',
    height: 50,
    marginLeft: width*.2,
    marginRight: width*.2,
  },
  buttonBlankText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    height: 50,
    lineHeight: 50,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height*.1,
    backgroundColor:'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bottomBarButton: {
    backgroundColor: 'transparent',
    height: height*.1,
    width: height*.1,
    flex:1,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    height: 50,
    lineHeight: 50,
    backgroundColor: 'transparent',
  },
  title: {
    color: 'white',
    backgroundColor: 'transparent',
    top: 55,
    height: 55,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 36,
  },
  userNameView: {
    backgroundColor:'#7148BC22',
    height: 50,
    top: 100,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 15,
  },
  userNameTextInput: {
    flex: .85,
    height: 50,
    backgroundColor: 'transparent',
    color:'white',
    fontFamily: 'Futura-Medium',
    padding: 2,
    paddingLeft: 10,
    borderWidth: 2,
    borderColor: '#B166CE22',
  },
  scroll: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding:10,
  },
  seperator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  eventName: {
    fontSize: 24,
    color: '#48BBEC'
  },
  thumb: {
    width: 100,
    height: 100,
  },
  eventDateView: {
    backgroundColor:'transparent',
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    height: 150,
    resizeMode: 'contain',
  },
  eventMapView: {
    backgroundColor:'blue',
    right: 0,
    top: 0,
    width: 200,
    height: 100,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'red',
  },
  card: {
    backgroundColor: '#ccc',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'white',
    height: CARD_HEIGHT,
  },
})
