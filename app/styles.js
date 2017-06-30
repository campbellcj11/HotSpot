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
  BLACK: '#2F2F2F',
  GREEN: '#3CD758',
  RED: '#E22647',
}

export const appStyleVariables = {
  NAVIGATION_HEADER_BACKGROUND_COLOR: appColors.DEEP_BLUE,
  NAVIGATION_HEADER_TITLE_COLOR: appColors.WHITE,
  NAVIGATION_HEADER_BUTTON_COLOR: appColors.WHITE,
  SYSTEM_BOLD_FONT: Platform.OS == 'ios' ? 'HelveticaNeue-Bold' : '',
  SYSTEM_REGULAR_FONT: Platform.OS == 'ios' ? 'Helvetica Neue' : 'sans-serif',
  SYSTEM_LIGHT_FONT: Platform.OS == 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
}

export const tagColors = {
  art:'#898CFF',
  books: '#FF89B5',
  causes: '#898CFF',
  class: '#90D4F7',
  comedy: '#FF89B5',
  community: '#71E096',
  conference: '#F5A26F',
  dance: '#90D4F7',
  food: '#ED6D79',
  health: '#668DE5',
  movie: '#F5A26F',
  music: '#DA97E0',
  nightlife: '#ED6D79',
  other: '#FF96E3',
  religion: '#BB96FF',
  shopping: '#668DE5',
  social: '#67EEBD',
  sport: '#71E096',
  theater: '#5AD0E5',
}
