import * as types from './types'
import Api from '../lib/api'
import offline from 'react-native-simple-store'

export function getPossibleLocations(){
  return (dispatch, getState) => {
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'dataType': 'json',
    }
    return Api.get('/locales',headers).then(resp => {
      dispatch(setPossibleLocations(resp));
    }).catch( (ex) => {
      console.warn('Failed to get Locations');
    })
  }
}
export function setPossibleLocations(locations){
  return {
    type: types.GET_POSSIBLE_LOCATIONS,
    possibleLocations: locations,
  }
}

export function setLocalInterests(sentInterests){
  var newInterests = [];
  for(var i=0;i<sentInterests.length;i++){
    newInterests[i] = sentInterests[i];
  }
  
  offline.save('localInterests', newInterests);
  return (dispatch) => {
    dispatch(stateSaveLocalInterests(newInterests))
  }
}
export function getLocalInterests(){
  offline.get('localInterests').then(interests => {
    return (dispatch) => {
      dispatch(stateSaveLocalInterests(interests))
    }
  }).catch(error => {
    dispatch(stateSaveLocalInterests([]))
  });;
}
function stateSaveLocalInterests(sentInterests){
  return {
    type: types.SAVE_LOCAL_INTERESTS,
    localInterests: sentInterests,
  }
}
