///////////////////////
/*

Author: ProjectNow Team
Class: TagSelection
Description: Custom Modal that lists possible events tags according to
database.
Note:

*/
///////////////////////
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Modal,
} from 'react-native'
import Button from './Button'
import ImageButton from './ImageButton'
import closeImage from '../images/delete.png'
import styleVariables from '../Utils/styleVariables'

export default class TagSelection extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  closeModal(){
    this.props.close();
  }

  render() {
    return (
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.props.showing}
          onRequestClose={() => {alert("Modal can not be closed.")}}
        >
         <View>
         </View>
        </Modal>
    )
  }
}

var styles = StyleSheet.create({
  topNav: {
    height: 64,
    backgroundColor: '#0E476A',
  },
  navTitle: {
    fontFamily: styleVariables.systemBoldFont,
    color:'#F97237',
    fontSize:20,
    textAlign:'center',
  },
  closeButton: {
    flex:1,
  },
  filterTypeTitle: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 14,
    color: styleVariables.greyColor,
    marginLeft: 16,
    marginBottom: 8,
    marginTop:8,
  },
  locationInput: {
    flex:.6,
    height:44,
    borderWidth:1,
    borderColor: styleVariables.greyColor,
    padding: 4,
  },
  interestsHolder: {
    flex:1,
    marginLeft: 16,
    marginRight: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  interestsCell: {
    margin: 8,
  },
  interestsCellText: {
    fontFamily: styleVariables.systemBoldFont,
    fontSize: 14,
    color: 'white',
  },
});
