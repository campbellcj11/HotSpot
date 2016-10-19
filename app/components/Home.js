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
  TouchableHighlight
} from 'react-native'
import Button from './Button'
import { Actions } from 'react-native-router-flux';
import backgroundImage from '../images/city.jpeg'
import userImage from '../images/avatar.png'
import passwordImage from '../images/key.png'
import LinearGradient from 'react-native-linear-gradient';
var {height, width} = Dimensions.get('window');

export default class Home extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      email:'',
      password:'',
      ds:[{Date: "07/13/2016", Event_Name: "Crabs & Crafts", Location: "AJ's Crabhouse", image: require('./Resources/crab.png')},
          {Date: "05/05/2016", Event_Name: "Music Festival", Location: "Five Points", image: require('./Resources/woodstock.png')},
          {Date: "10/31/2016", Event_Name: "29th Annual Chili Cook Off", Location: "Five Points", image: require('./Resources/Chili.png')},
          {Date: "01/15/2017", Event_Name: "River Rat Brew-fest", Location: "River Rat Brewery", image: require('./Resources/craft.png')},
          {Date: "11/20/2016", Event_Name: "Oyster Roast", Location: "The Oyster Bar", image: require('./Resources/oyster.jpg')},
          {Date: "10/22/2016", Event_Name: "Wine & Food Festival", Location: "The Vista", image: require('./Resources/Wine.jpg')},
          {Date: "11/14/2016", Event_Name: "Food Truck Friday", Location: "Main Street", image: require('./Resources/food.jpg')},
          {Date: "01/15/2017", Event_Name: "Gamecocks on the Green", Location: "Greene Street", image: require('./Resources/gamecock.png')},
          {Date: "07/13/2016", Event_Name: "Crabs & Crafts", Location: "AJ's Crabhouse", image: require('./Resources/crab.png')}
        ],
      dataSource:ds,
    }
  }

  componentWillMount() {
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows(this.state.ds),
    })
  }

  _login(){
    //hardcoded for prototype
    var user = {'email': this.state.email,
                'password' : this.state.password};
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

  renderRow(rowData){
  return (
    <TouchableHighlight
      onPress={()=> this.pressRow(rowData)}
      underlayColor = '#dddddd'>
      <View style={{flex:1}}>
        <View style = {styles.rowContainer}>
          <View style={{flex:1}}>
            <Image style={styles.thumb} source={rowData.image}/>
            <Text>{rowData.Date}</Text>
          </View>
          <View style={{flex:2}}>
            <Text style={styles.eventName}>{rowData.Event_Name} </Text>
            <Text> @ {rowData.Location}</Text>
          </View>
        </View>
        <View style = {styles.seperator}/>
    </View>
    </TouchableHighlight>
  )
}
pressRow(rowData) {

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

    return (
      <View style={{flex:1}}>
        <Modal
            animationType={'none'}
            transparent={false}
            visible={!this.props.loggedIn}
        >
          <View style={{flexDirection:'row'}}>
            <Image source={backgroundImage} style={styles.backgroundImage} textStyle={styles.buttonText}>
              <LinearGradient colors={['#30404F', '#22B1C5']} style={styles.opacityLinearGradient}>
              </LinearGradient>
              <Text style={styles.title}>
                Project Now
              </Text>
              <View style={styles.userNameView}>
                <View style={styles.userNameOpacityView}>
                </View>
                <View style={styles.userNameImageView}>
                  <Image source={userImage} style={styles.userNameImage}>
                  </Image>
                </View>
                <TextInput style={styles.userNameTextInput}
                  ref='email'
                  onChangeText={(email) => this.setState({email})}
                  placeholder='email'>
                </TextInput>
              </View>

              <View style={styles.userNameView}>
                <View style={styles.userNameOpacityView}>
                </View>
                <View style={styles.userNameImageView}>
                  <Image source={passwordImage} style={styles.userNameImage}>
                  </Image>
                </View>
                <TextInput style={styles.userNameTextInput}
                  secureTextEntry={true}
                  ref='password'
                  onChangeText={(password) => this.setState({password})}
                  placeholder='password'>
                </TextInput>
              </View>
              <Button
                onPress={() => this._login()}
                style={styles.loginButton}
                textStyle={styles.buttonText}>
                Login
              </Button>
            </Image>
          </View>
        </Modal>

        <View style={styles.container}>
          <LinearGradient colors={['#30404F', '#22B1C5']} style={styles.linearGradient}>
          </LinearGradient>
          {readonlyMessage}
          <Button
            onPress={() => this._logout()}
            style={styles.logoutButton}
            textStyle={styles.buttonText}>
            Logout
          </Button>
          <ListView style={styles.scroll}
            dataSource={this.state.dataSource}
            renderRow= {this.renderRow.bind(this)}>
          </ListView>
          <View style={styles.bottomBar}>

          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
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
    top: 200,
  },
  backgroundImage: {
    width: width,
    height: height,
    resizeMode: 'cover', // or 'stretch'
  },
  opacityLinearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: .57,
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
    backgroundColor: 'rgb(56,198,95)',
    height: 50,
    marginLeft: 50,
    marginRight: 50,
  },
  logoutButton: {
    //top: 100,
    backgroundColor: '#D73C54',
    height: 50,
    marginLeft: 50,
    marginRight: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Nexa Bold',
    height: 50,
    lineHeight: 50,
  },
  title: {
    color: 'white',
    backgroundColor: 'transparent',
    top: 40,
    height: 55,
    textAlign: 'center',
    fontFamily: 'Nexa Bold',
    fontSize: 42,
  },
  userNameView: {
    backgroundColor:'rgba(0,0,0,.5)',
    height: 50,
    top: 100,
    marginLeft:20,
    marginRight: 20,
    flexDirection: 'row',
    marginBottom: 15,
  },
  userNameOpacityView: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'blue',
  },
  userNameImageView: {
    height: 50,
    backgroundColor: 'rgba(48,232,194,.69)',
  },
  userNameImage: {
    top:10,
    height:30,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  userNameTextInput: {
    flex: .85,
    height: 50,
    backgroundColor: 'transparent',
    color:'white',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor:'yellow',
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
})
