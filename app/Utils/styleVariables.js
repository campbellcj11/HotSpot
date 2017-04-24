///////////////////////
/*

Author: ProjectNow Team
Class: styleVariables
Description: Util class that defines the preset styles that are used throughout
the app

*/
///////////////////////
import {
  Platform,
} from 'react-native'


var styleVariables = {
  systemBoldFont: Platform.OS == 'ios' ? 'HelveticaNeue-Bold' : '',
  systemRegularFont: Platform.OS == 'ios' ? 'Helvetica Neue' : 'sans-serif',
  systemLightFont: Platform.OS == 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
  greyColor: '#A6A6A6',
  titleBarHeight: Platform.OS == 'ios' ? 64 : 54
}

export default styleVariables
