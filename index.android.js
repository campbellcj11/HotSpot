import { AppRegistry } from 'react-native';
import * as firebase from 'firebase';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

import App from './App';

AppRegistry.registerComponent('App', () => App);
