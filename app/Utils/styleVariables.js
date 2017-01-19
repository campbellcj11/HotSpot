import {
  Platform,
} from 'react-native'


var styleVariables = {
  systemBoldFont: Platform.OS == 'ios' ? 'Helvetica-Bold' : '',
  systemRegularFont: Platform.OS == 'ios' ? 'Helvetica Neue' : 'sans-serif',
  systemLightFont: Platform.OS == 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
}

export default styleVariables