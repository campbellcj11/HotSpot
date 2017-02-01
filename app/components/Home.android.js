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
  Platform,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import { Actions } from 'react-native-router-flux';
import titleImage from '../images/hs-title.png'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import logoutImage from '../images/arrows.png'
import searchImage from '../images/magnifying-glass.png'
import LinearGradient from 'react-native-linear-gradient';
var {width,height} = Dimensions.get('window');
import * as firebase from 'firebase';
import EventCard from './EventCard'
import EventPage from './EventPage'
import Swiper from 'react-native-swiper';

const HEADER_HEIGHT = Platform.OS == 'ios' ? 64 : 44;
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
      isSignUp: false,
    }
    this.itemsRef = this.getRef().child('events');
    this.currentIndex = 0;
  }

  componentWillMount() {
    this.props.loadUserData();
    this.listenForItems(this.itemsRef);
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(itemsRef) {
    var today = new Date();
    var timeUTC = today.getTime();
    console.log("TIME UTC: " + timeUTC);
    itemsRef.orderByChild("Date").startAt(timeUTC).on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        var tagsRef = this.getRef().child('tags/' + child.key);
        var Tags = [];
        tagsRef.on("value", (snapshot) => {
          snapshot.forEach((childUnder) => {
            Tags.push(childUnder.key);
          });
          items.push({
            Key : child.key,
            Event_Name: child.val().Event_Name,
            Date: new Date(child.val().Date),
            Location: child.val().Location,
            Image: child.val().Image,
            latitude: child.val().Latitude,
            longitude: child.val().Longitude,
            Tags: child.val().Tags,
            Short_Description: child.val().Short_Description,
            Long_Description: child.val().Long_Description,
            Address: child.val().Address,
            Website: child.val().Website,
            MainTag: Tags ? Tags[0]:[],
            Event_Contact: child.val().Email_Contact,
          });
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
    if(this.state.isSignUp)
    {
      this.props.signUpUser(user);
    }
    else
    {
      this.props.loginUser(user);
    }
  }

  _loginWithoutAccount() {
    user = {'email': 'test@test.com',
            'password' : 'password'};
    if(this.state.isSignUp)
    {

    }
    else
    {
      this.props.loginUser(user);
    }
  }

  _logout(){
    this.props.logoutUser();
  }

  _resetPassword() {
    this.props.resetPassword(this.state.email);
  }
  _openSignupPage(){
    this.setState({isSignUp:!this.state.isSignUp});
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
    // this.setState({currentSelection:rowData});
    // this.setState({hasCurrentSelection:true});

    Actions.Event({title:'',currentSelection:rowData});
  }
  _closeSelection(){
    this.setState({currentSelection:{}});
    this.setState({hasCurrentSelection:false});
  }
  renderSlides() {
    this.currentIndex = 0;
    var pageLengths = [];
    var sumOfEvents = 0;
    // while()
    // {
    //
    // }
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

      return <EventPage key={i} partOfFavorites={false} cellPressed={(cellData) => this.pressRow(cellData)} pageNumber={i} eventsForPage={eventsForPage} eventsPerPage={eventsPerPage} style={[styles.card,{backgroundColor: colors[i % colors.length]}]} width={CARD_WIDTH} height={CARD_HEIGHT}/>
    })
    return (Arr)
  }
  renderView(){
    return (
      <View>
        <Modal
          animationType='fade'
          transparent={false}
          visible={this.state.hasCurrentSelection}
        >
            <EventCard currentSelection={this.state.currentSelection} closeSelection={() => this._closeSelection()}/>
        </Modal>



        <View style={styles.container}>
          <ScrollView ref='swiper' height={height*.9}>
              {this.renderSlides()}
          </ScrollView>
        </View>
      </View>
    )
  }
  renderModal(){
    var loginButtonText = this.state.isSignUp ? 'Sign Up' : 'Login';
    var signUpButtonText = this.state.isSignUp ? 'Login' : 'Sign Up';
    var loginWithoutAccountButtonText = this.state.isSignUp ? '' : 'Login without an Account';
    var forgotPasswordButtonText = this.state.isSignUp ? '' : 'Forgot Password?';
    return (
      <Modal
          animationType={'none'}
          transparent={false}
          visible={!this.props.loggedIn}
      >
        <View style={{flexDirection:'row'}}>
        <View style={styles.modalBackground}>
          <Image source={titleImage} style={styles.titleImage}/>
          <Text style={styles.title}>
          </Text>
          <View style={styles.userNameView}>
            <TextInput style={styles.userNameTextInput}
              ref='email'
              onChangeText={(email) => this.setState({email})}
              placeholder='Email'
              placeholderTextColor='#C6E1E2'
              underlineColorAndroid='transparent'>
            </TextInput>
          </View>

          <View style={styles.passwordView}>
            <TextInput style={styles.userNameTextInput}
              secureTextEntry={!this.state.isSignUp}
              ref='password'
              onChangeText={(password) => this.setState({password})}
              placeholder='Password'
              placeholderTextColor='#C6E1E2'
              underlineColorAndroid='transparent'>
            </TextInput>
          </View>
          <Button
            onPress={() => this._resetPassword()}
            style={styles.forgotPasswordBlankButton}
            textStyle={styles.forgotPasswordText}>
            {forgotPasswordButtonText}
          </Button>
          <Button
            onPress={() => this._login()}
            style={styles.loginButton}
            textStyle={styles.buttonText}>
            {loginButtonText}
          </Button>
          <Button
            onPress={() => this._loginWithoutAccount()}
            style={styles.loginBlankButton}
            textStyle={styles.buttonBlankText}>
            {loginWithoutAccountButtonText}
          </Button>
          <Button
            onPress={() => this._openSignupPage()}
            style={styles.signupBlankButton}
            textStyle={styles.buttonBlankText}>
            {signUpButtonText}
          </Button>
        </View>
        </View>
      </Modal>
    )
  }
  static renderNavigationBar(props)
  {
    console.log('AHH PROPS!')
    console.log(props)
    return(
      <View style={{flex:1,backgroundColor:'#0E476A',position:'absolute',top:0,left:0,right:0,height:Platform.OS == 'ios' ? 64 : 44}}>
        <View style={{top:Platform.OS == 'ios' ? 20 : 0,flexDirection:'row'}}>
          <View style={{flex:.2}}/>
          <View style={{flex:.6,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#F97237',fontSize:20,fontFamily:'Futura-Medium',textAlign:'center'}}>{props.title}</Text>
          </View>
            <Button
            style={{flex:.2}}
            //onPress={() => props.logoutUser()}
            textStyle={{color:'#F97237',fontSize:12,fontFamily:'Futura-Medium',textAlign:'center'}}>
            {/*Logout*/}
          </Button>
        </View>
      </View>
    )
  }
  render() {
    console.log('PROPS!')
    console.log(this.props)
    let user, readonlyMessage, viewToShow
    //if(firebase.auth().currentUser)
    if(this.props.loggedIn && this.props.user != {})
    {
      user = this.props.user
      readonlyMessage = <Text style={styles.offline}>Logged In {user.email}</Text>
      viewToShow = this.renderView();
    }
    else
    {
      readonlyMessage = <Text style={styles.offline}>Not Logged In</Text>
      viewToShow = this.renderModal();
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
        {viewToShow}
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
  titleImage: {
    position: 'absolute',
    left: width*.2,
    right: width*.2,
    width: width*.6,
    top: 0,
    height: 150,
    resizeMode: 'contain', // or 'stretch'
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: Platform.OS == 'ios' ? height : height-20,
    backgroundColor: '#0E476A',
  },
  loginButton: {
    marginTop: 5,
    backgroundColor: '#F97237',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#EE6436',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBlankButton: {
    marginTop: 5,
    backgroundColor: 'transparent',
    height: 50,
    marginLeft: width*.2,
    marginRight: width*.2,
  },
  signupBlankButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    height: 44,
    left: width*.2,
    right: width*.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordBlankButton: {
    backgroundColor: 'transparent',
    height: 30,
    marginLeft: width*.2,
    marginRight: width*.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
  },
  buttonBlankText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
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
    backgroundColor: 'transparent',
  },
  title: {
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: Platform.OS == 'ios' ? 55 : 45,
    height: 55,
    textAlign: 'center',
    fontFamily: 'Futura-Medium',
    fontSize: 36,
    marginBottom: Platform.OS == 'ios' ? 40 : 30,
  },
  userNameView: {
    backgroundColor:'#7148BC22',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 15,
  },
  passwordView: {
    backgroundColor:'#7148BC22',
    height: 50,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 5,
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
