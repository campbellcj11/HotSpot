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
import * as firebase from 'firebase';
var {height, width} = Dimensions.get('window');
import styleVariables from '../Utils/styleVariables'
import settingsImage from '../imgs/settings.png'
import closeImage from '../imgs/close.png'
import checkImage from '../imgs/check.png'
import addImage from '../imgs/plus.png'
import LinearGradient from 'react-native-linear-gradient'
import Moment from 'moment'
import Swiper from 'react-native-swiper';
import SortableGrid from 'react-native-sortable-grid';
import PostCardImagePicker from 'react-native-image-crop-picker';



export default class PostcardView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postcardInfo: this.props.postcardInfo,
      postcardSettingsOpen:false,
      currentIndex: 0,
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.postcardInfo != this.props.postcardInfo)
    {
      this.setState({postcardInfo:nextProps.postcardInfo});
    }
  }
  componentWillMount() {

  }
  _onMomentumScrollEnd(e, state, context) {
    // console.warn(context.state.index)
    this.setState({currentIndex: context.state.index});
  }
  openPostCardSettings(){
    this.setState({postcardSettingsOpen:true});
  }
  closePostCardSettings(){
    this.setState({postcardSettingsOpen:false});
  }
  closePostCard(){
    this.setState({currentIndex:0},
      function(){
        this.props.closePostCard();
    })
  }
  openImagePicker(){
    PostCardImagePicker.openPicker({
      multiple: true
    }).then(images => {
      console.log(images);
      var imagePaths = [];
      var postCardInfo = this.state.postcardInfo;
      var userImages = postCardInfo.userImages;
      for(var i=0; i < images.length; i++)
      {
        var imagePath = images[i].path;
        var imagePathObject = {uri : imagePath};
        console.log(imagePath);
        imagePaths.push(imagePath);
        userImages.push(imagePathObject);
      }

      postCardInfo.userImages = userImages;
      console.log(userImages);
      console.log(imagePaths);
      this.setState({postcardInfo:postCardInfo});
    });
  }
  startDelete(){
    // console.warn(
    //   this.refs.SortableGrid.toggleDeleteMode()
    // )
  }
  reorderImages(sentItemOrder){
    // console.log("Drag was released, the blocks are in the following order: ", sentItemOrder.itemOrder)
    var newImages = [];
    for(var i=0;i<sentItemOrder.itemOrder.length;i++)
    {
      var imageOrderData = sentItemOrder.itemOrder[i];
      var key = imageOrderData.key;
      var order = imageOrderData.order;
      var image = this.state.postcardInfo.userImages[key];
      newImages.push(image);
    }
    // console.log('New Images: ', newImages);
    var postCardInfo = this.state.postcardInfo;
    postCardInfo.userImages = newImages;
    this.setState({postcardInfo:postCardInfo});
  }
  renderPostCardSettings(){
    // this.numbers = [0,1,2,3,4,5,6,7,8,9,10,11]
    var userImages = this.state.postcardInfo.userImages;
    return(
      <View style={{height:height,paddingTop:20+16}}>
        <View style={{position:'absolute',left:0,right:0,top:0,bottom:0}}>
          <Image style={{flex:1}} source={this.state.postcardInfo.cardImage} resizeMode={'cover'}/>
        </View>
        <LinearGradient
          start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
          locations={[0,1]}
          colors={[this.state.postcardInfo.color, '#FFFFFF00']}
          style={{position:'absolute',left:0,right:0,top:0,bottom:0}}
        />
        <View style={{flex:.1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:8}}>
          <View style={{flex:.15,justifyContent:'center',alignItems:'center'}}>
            <ImageButton image={addImage} style={{width:24,height:24,borderWidth:1,borderColor:'white',borderRadius:16,backgroundColor:this.state.postcardInfo.color}} imageStyle={{width:24,height:24,tintColor:'white'}} onPress={() => this.openImagePicker()}>
            </ImageButton>
          </View>
          <Text style={{flex:.7,backgroundColor:'transparent',fontFamily:styleVariables.systemBoldFont,fontSize:24,color:'white',textAlign:'center'}}>{this.state.postcardInfo.name}</Text>
          <View style={{flex:.15,justifyContent:'center',alignItems:'center'}}>
            <ImageButton image={closeImage} style={{width:24,height:24,borderWidth:1,borderColor:'white',borderRadius:16,backgroundColor:this.state.postcardInfo.color}} imageStyle={{width:24,height:24,tintColor:'white'}} onPress={() => this.closePostCardSettings()}>
            </ImageButton>
          </View>
        </View>
        <SortableGrid
          style={{flex:.9}}
          blockTransitionDuration      = { 400 }
          activeBlockCenteringDuration = { 200 }
          itemsPerRow                  = { 3 }
          dragActivationTreshold       = { 200 }
          onDragRelease                = { (itemOrder) => this.reorderImages(itemOrder) }
          onDragStart                  = { ()          => console.log("Some block is being dragged now!") }
          onDeleteItem                 = { (item)      => console.log("Item was deleted:", item) }
          ref={'SortableGrid'}
        >
          {
            userImages.map( (image, index) =>
              <View
                ref={ 'itemref_' + index }
                onTap={ this.startDelete.bind(this) }
                key={ index }
                style={{flex:1, margin: 8, borderRadius: 4,justifyContent: 'center', alignItems: 'center', backgroundColor:'#FFFFFF60'}}
              >
                <Image style={{width:88,height:88}} source={image} resizeMode={'contain'}/>
              </View>
            )
          }
        </SortableGrid>
      </View>
    )
  }
  renderPostCardPage1(){
    // console.warn('render page 1');
    // console.warn(this.state.postcardInfo.name);
    return(
      <View key={-1} style={{flex:1}}>
        <View style={{position:'absolute',left:0,right:0,top:0,bottom:0}}>
          <Image style={{flex:1}} source={this.state.postcardInfo.cardImage} resizeMode={'cover'}/>
        </View>
        <LinearGradient
          start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
          locations={[0,1]}
          colors={[this.state.postcardInfo.color, '#FFFFFF00']}
          style={{position:'absolute',left:0,right:0,top:0,bottom:0}}
        />
        <View style={{flexDirection:'row',marginTop:20+32,alignItems:'center'}}>
          <View style={{flex:.15,justifyContent:'center',alignItems:'center'}}>
            <ImageButton image={settingsImage} style={{width:24,height:24,borderWidth:1,borderColor:'white',borderRadius:16,backgroundColor:this.state.postcardInfo.color}} imageStyle={{width:12,height:12,tintColor:'white'}} onPress={() => this.openPostCardSettings()}/>
          </View>
          <Text style={{flex:.7,backgroundColor:'transparent',fontFamily:styleVariables.systemBoldFont,fontSize:24,color:'white',textAlign:'center'}}>{this.state.postcardInfo.name}</Text>
          <View style={{flex:.15,justifyContent:'center',alignItems:'center'}}>
            <ImageButton image={closeImage} style={{width:24,height:24,borderWidth:1,borderColor:'white',borderRadius:16,backgroundColor:this.state.postcardInfo.color}} imageStyle={{width:24,height:24,tintColor:'white'}} onPress={() => this.closePostCard()}>
            </ImageButton>
          </View>
        </View>
        <View style={{position:'absolute',left:-4,bottom:48,paddingLeft:12,paddingRight:8,borderRadius:4,backgroundColor:'#FFFFFF60'}}>
          <Text style={{fontFamily:styleVariables.systemBoldFont,fontSize:18,color:this.state.postcardInfo.color}}>{Moment(this.state.postcardInfo.date).format('MMM DD, YYYY')}</Text>
        </View>
      </View>
    )
  }
  renderPostCardViewWithImage(index,sentImage){
    return(
      <View key={index} style={{flex:1}}>
        <View style={{position:'absolute',left:0,right:0,top:0,bottom:0}}>
          <Image style={{flex:1}} source={sentImage} resizeMode={'cover'}/>
        </View>
        <View style={{flexDirection:'row',marginTop:20+32,alignItems:'center'}}>
          <View style={{flex:.15}}/>
          <Text style={{flex:.7,backgroundColor:'transparent',fontFamily:styleVariables.systemBoldFont,fontSize:24,color:'transparent',textAlign:'center'}}>{this.state.postcardInfo.name}</Text>
          <View style={{flex:.15,justifyContent:'center',alignItems:'center'}}>
            <ImageButton image={closeImage} style={{width:24,height:24,borderWidth:1,borderColor:'white',borderRadius:16,backgroundColor:this.state.postcardInfo.color}} imageStyle={{width:24,height:24,tintColor:'white'}} onPress={() => this.closePostCard()}>
            </ImageButton>
          </View>
        </View>
      </View>
    )
  }
  renderPostCard(){
    // console.warn('render postcard');
    var postCardPages = [this.renderPostCardPage1()];
    if(this.state.postcardInfo.userImages.length > 0)
    {
      for(var i=0; i < this.state.postcardInfo.userImages.length; i++)
      {
          var postCardImage = this.state.postcardInfo.userImages[i];
          postCardPages.push(this.renderPostCardViewWithImage(i,postCardImage));
      }
    }
    var numberOfPages = postCardPages.length - 1;
    var barChangePerPage = 0;
    if(numberOfPages > 0)
    {
      barChangePerPage = width / numberOfPages;
    }
    // console.warn(barChangePerPage);
    // console.warn('CI: ',this.state.currentIndex);
    // console.warn(postCardPages.length);
    return(
      <View>
        <Swiper
          width={width}
          height={height}
          loop={false}
          onMomentumScrollEnd ={this._onMomentumScrollEnd.bind(this)}
          showsPagination={false}
          showsButtons={true}
        >
          {postCardPages}
        </Swiper>
        <View style={{position:'absolute',bottom:20,height:4,left:0,right:0,backgroundColor:'#FFFFFF60'}}></View>
        <View style={{position:'absolute',bottom:20,height:4,left:0,width:barChangePerPage*this.state.currentIndex,backgroundColor:'#FFFFFF'}}></View>
      </View>
    )
  }
  render() {
    // console.warn('render');
    var viewToShow = <View/>
    if(this.state.postcardSettingsOpen)
    {
      viewToShow = this.renderPostCardSettings();
    }
    else {
      viewToShow = this.renderPostCard();
    }
    return (
      <View>
        {viewToShow}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#0E476A',
  }
})
