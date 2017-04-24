///////////////////////
/*

Author: ProjectNow Team
Class: ImageButton
Description: Custom Button.
Note:

*/
///////////////////////
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native'

export default class ImageButton extends Component {
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
        underlayColor="#FFFFFF00">
          <Image style={[styles.buttonImage,this.props.imageStyle]} source={this.props.image} resizeMode={'contain'}/>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
  },
});
