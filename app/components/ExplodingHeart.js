import React, { Component } from 'react';
import { appStyleVariables, appColors } from '../styles';
import {Actions} from 'react-native-router-flux'
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Dimensions,
  Animated,
  LayoutAnimation,
  UIManager,
  ART,
} from 'react-native';

// var {width,height} = Dimensions.get('window');

var {
  Surface,
  Group,
  Shape,
  Path
} = ART;

var AnimatedShape = Animated.createAnimatedComponent(Shape);

//Size 32
var HEART_SVG = "M 31.9471 8.9457C 31.48 3.76171 27.841 0.000620569 23.2869 0.000620569C 20.2528 0.000620569 17.4748 1.64691 15.9116 4.28545C 14.3626 1.61278 11.6984 0 8.71302 0C 4.1595 0 0.519887 3.76109 0.0533962 8.94508C 0.0164708 9.17406 -0.134923 10.3791 0.325413 12.3444C 0.98884 15.179 2.52124 17.7574 4.75585 19.7989L 15.9042 30L 27.244 19.7996C 29.4786 17.7574 31.011 15.1796 31.6745 12.3444C 32.1348 10.3798 31.9834 9.17468 31.9471 8.9457Z";
var HEART_WIDTH = 32;
var HEART_HEIGHT = 30;
//Size 44
// var HEART_SVG = "M 43.9273 12.2258C 43.285 5.14101 38.2814 0.000848111 32.0194 0.000848111C 27.8476 0.000848111 24.0279 2.25078 21.8785 5.85678C 19.7486 2.20414 16.0854 0 11.9804 0C 5.71932 0 0.714845 5.14016 0.0734197 12.2249C 0.0226473 12.5379 -0.18552 14.1848 0.447443 16.8707C 1.35965 20.7447 3.46671 24.2684 6.53929 27.0586L 21.8683 41L 37.4606 27.0594C 40.5331 24.2684 42.6402 20.7455 43.5524 16.8707C 44.1854 14.1857 43.9772 12.5387 43.9273 12.2258Z"
//Size Big
// var HEART_SVG = "M130.4-0.8c25.4 0 46 20.6 46 46.1 0 13.1-5.5 24.9-14.2 33.3L88 153.6 12.5 77.3c-7.9-8.3-12.8-19.6-12.8-31.9 0-25.5 20.6-46.1 46-46.2 19.1 0 35.5 11.7 42.4 28.4C94.9 11 111.3-0.8 130.4-0.8"
var HEART_COLOR = appColors.RED;
var GRAY_HEART_COLOR = appColors.DARK_GRAY;

var FILL_COLORS = [
  'rgba(0,0,0,0)',
  'rgba(221,70,136,1)',
  'rgba(212,106,191,1)',
  'rgba(204,142,245,1)',
  'rgba(204,142,245,1)',
  'rgba(204,142,245,1)',
  'rgba(0,0,0,0)'
];
var PARTICLE_COLORS = [
  'rgb(158, 202, 250)',
  'rgb(161, 235, 206)',
  'rgb(208, 148, 246)',
  'rgb(244, 141, 166)',
  'rgb(234, 171, 104)',
  'rgb(170, 163, 186)'
];

export class AnimatedCircle extends Component {
  render(){
    var radius = this.props.radius;
    var path = Path().moveTo(0, -radius)
        .arc(0, radius * 2, radius)
        .arc(0, radius * -2, radius)
        .close();
    return(
      <AnimatedShape
        d={path}
        x={this.props.x}
        y={this.props.y}
        radius={this.props.radius}
        scale={this.props.scale}
        strokeWidth={this.props.strokeWidth}
        fill={this.props.fill}
        opacity={this.props.opacity}
      />
    )
  }
}

export default class ExplodingHeart extends Component {
  constructor(props){
    super(props);

    this.state = {
      animation: new Animated.Value(this.props.selected ? 28 : 0),
    }
  }
  componentWillReceiveProps(nextProps){

  }
  getXYParticle(total, i, radius) {
    var angle = ( (2*Math.PI) / total ) * i;
    var x = Math.round((radius*2) * Math.cos(angle - (Math.PI/2)));
    var y = Math.round((radius*2) * Math.sin(angle - (Math.PI/2)));
    return {
      x: x,
      y: y
    }
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }
  getSmallExplosions(radius, offset){
    return [0,1,2,3,4,5,6].map((v, i, t) => {
      var scaleOut = this.state.animation.interpolate({
        inputRange: [0, 5.99, 6, 13.99, 14, 21],
        outputRange: [0, 0, 1, 1, 1, 0],
        extrapolate: 'clamp'
      });
      var moveUp = this.state.animation.interpolate({
        inputRange: [0, 5.99, 14],
        outputRange: [0, 0, -15],
        extrapolate: 'clamp'
      });
      var moveDown = this.state.animation.interpolate({
        inputRange: [0, 5.99, 14],
        outputRange: [0, 0, 15],
        extrapolate: 'clamp'
      });
      var color_top_particle = this.state.animation.interpolate({
        inputRange: [6, 8, 10, 12, 17, 21],
        outputRange: this.shuffleArray(PARTICLE_COLORS)
      })
      var color_bottom_particle = this.state.animation.interpolate({
        inputRange: [6, 8, 10, 12, 17, 21],
        outputRange: this.shuffleArray(PARTICLE_COLORS)
      })
      var position = this.getXYParticle(7, i, radius)
      return (
        <Group
          key={i}
          x={position.x + offset.x }
          y={position.y + offset.y}
          rotation={this.getRandomInt(0, 40) * i}
        >
          <AnimatedCircle
            x={moveUp}
            y={moveUp}
            radius={radius*.4}
            scale={scaleOut}
            fill={color_top_particle}
          />
          <AnimatedCircle
            x={moveDown}
            y={moveDown}
            radius={radius*.2}
            scale={scaleOut}
            fill={color_bottom_particle}
          />
        </Group>
      )
    }, this)
  }
  explode(){
    this.state.animation.setValue(0);
    this.forceUpdate();
    Animated.timing(this.state.animation, {
      duration: 1000,
      toValue: 28
    }).start(() => {
      // this.state.animation.setValue(0);
      // this.forceUpdate();
    });
  }
  implode(){
    this.state.animation.setValue(0);
    this.forceUpdate();
  }
  render(){
    var frameWidth = this.props.frameWidth;
    var frameHeight = this.props.frameHeight;
    var heartSize = HEART_WIDTH;
    var centerX = heartSize/2;
    var centerY = heartSize/2;
    var cirlceRadius = heartSize/4;

    var heart_scale = this.state.animation.interpolate({
      inputRange: [0, .01, 6, 10, 12, 18, 28],
      outputRange: [1, 0, .1, 1, 1.2, 1, 1],
      extrapolate: 'clamp'
    });
    var heart_fill = this.state.animation.interpolate({
      inputRange: [0, 2],
      outputRange: [GRAY_HEART_COLOR, HEART_COLOR],
      extrapolate: 'clamp'
    })
    var heart_x = heart_scale.interpolate({
      inputRange: [0, 1],
      outputRange: [centerX, 0],
    })
    var heart_y = heart_scale.interpolate({
      inputRange: [0, 1],
      outputRange: [centerY, 0],
    })
    var circle_scale = this.state.animation.interpolate({
      inputRange: [0, 1, 4],
      outputRange: [1, .3, 1],
      extrapolate: 'clamp'
    });
    var circle_stroke_width = this.state.animation.interpolate({
      inputRange: [0, 5.99, 6, 7, 10],
      outputRange: [0, 0, 15, 8, 0],
      extrapolate: 'clamp'
    });
    var circle_fill_colors = this.state.animation.interpolate({
      inputRange: [0,1, 2, 3, 4, 4.99, 5],
      outputRange: FILL_COLORS,
      extrapolate: 'clamp'
    })
    var circle_opacity = this.state.animation.interpolate({
      inputRange: [1,9.99, 10],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp'
    })
    return(
        <View style={{width:frameWidth,height:frameHeight}}>
          <Surface width={frameWidth} height={frameHeight}>
            <Group x={(frameWidth-HEART_WIDTH)/2} y={(frameHeight-HEART_HEIGHT)/2}>
              <AnimatedShape
                d={HEART_SVG}
                x={heart_x}
                y={heart_y}
                scale={heart_scale}
                fill={heart_fill}
              />
              <AnimatedCircle
                x={centerX}
                y={centerY}
                radius={cirlceRadius}
                scale={circle_scale}
                strokeWidth={circle_stroke_width}
                stroke={FILL_COLORS[5]}
                fill={circle_fill_colors}
                opacity={circle_opacity}
              />
              {this.getSmallExplosions(cirlceRadius, {x:centerX, y:centerY})}
            </Group>
          </Surface>
        </View>
    )
  }
}

const styles = StyleSheet.create({

});
