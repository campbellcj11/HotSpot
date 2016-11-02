import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native'

export default class Button extends Component {
  state = {
    active: false,
  };

  _onHighlight = () => {
    this.setState({active: true});
  };

  _onUnhighlight = () => {
    this.setState({active: false});
  };

  render() {
    return (
      <TouchableHighlight
        onHideUnderlay={this._onUnhighlight}
        onPress={this.props.onPress}
        onShowUnderlay={this._onHighlight}
        style={[styles.button, this.props.style]}
        underlayColor="transparent">
          <View style={styles.imageHolder}>
            <Image style={[styles.buttonImage,this.props.imageStyle]} source={this.props.image}/>
          </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHolder: {
    width:45,
    height:45,
    borderWidth: 2,
    borderRadius: 22.5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'white',
  },
});
