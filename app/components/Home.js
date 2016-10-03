import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
} from 'react-native'
import Button from './Button'
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }

  _login(){
    var user = {'first_name': 'Larry'};
    this.props.loginUser(user);
  }

  _logout(){
    this.props.logoutUser();
  }

  render() {
    console.log('PROPS!')
    console.log(this.props)
    let user, readonlyMessage
    if(this.props.loggedIn && this.props.user != {})
    {
      user = this.props.user
      readonlyMessage = <Text style={styles.offline}>Logged In {user.first_name}</Text>
    }
    else
    {
      readonlyMessage = <Text style={styles.offline}>Not Logged In</Text>
    }

    return (
      <View>
        <Modal
            animationType={'none'}
            transparent={false}
            visible={!this.props.loggedIn}
        >
          <View style={styles.container}>
            <Button
              onPress={() => this._login()}
              style={styles.modalButton}>
              Login
            </Button>
          </View>
        </Modal>

        <View style={styles.container}>
          {readonlyMessage}
          <Button
            onPress={() => this._logout()}
            style={styles.modalButton}>
            Logout
          </Button>
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
  newItem: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20
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
    marginTop: 10,
    backgroundColor: '#F6F6F6',
  },
})
