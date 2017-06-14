import {
  Platform,
} from 'react-native';

export const appColors = {
  DEEP_BLUE: '#0E476A',
  LIGHT_BLUE: '#0B82CC',
  WHITE: '#FFFFFF',
  ORANGE: '#F97237',
  GRAY: '#E2E2E2',
  DARK_GRAY: '#848484',
  BLACK: '#302F2F',
  GREEN: '#3CD758',
}

export const appStyleVariables = {
  NAVIGATION_HEADER_BACKGROUND_COLOR: appColors.DEEP_BLUE,
  NAVIGATION_HEADER_TITLE_COLOR: appColors.WHITE,
  NAVIGATION_HEADER_BUTTON_COLOR: appColors.WHITE,
  SYSTEM_BOLD_FONT: Platform.OS == 'ios' ? 'HelveticaNeue-Bold' : '',
  SYSTEM_REGULAR_FONT: Platform.OS == 'ios' ? 'Helvetica Neue' : 'sans-serif',
  SYSTEM_LIGHT_FONT: Platform.OS == 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
}
