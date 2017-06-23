import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
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
        underlayColor={this.props.underlayColor ? this.props.underlayColor : "transparent"}>
          <Text style={[styles.buttonText,this.props.textStyle]}>{this.props.children}</Text>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  buttonText: {
    margin: 5,
  },
});
