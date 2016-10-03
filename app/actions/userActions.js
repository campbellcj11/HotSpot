import offline from 'react-native-simple-store'

export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

export function loginUser(user){
  console.log('Logging in user');
  return {
    type: LOG_IN,
    currentUser: user
  }
}

export function logoutUser(){
  console.log('Logging out user');
  return {
    type: LOG_OUT
  }
}
