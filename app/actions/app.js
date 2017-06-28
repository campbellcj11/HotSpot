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
  return (dispatch, getState) => {
    return offline.get('localInterests').then(interests => {
      dispatch(stateSaveLocalInterests(interests));
    });
  }
}
function stateSaveLocalInterests(sentInterests){
  return {
    type: types.SAVE_LOCAL_INTERESTS,
    localInterests: sentInterests,
  }
}

export function setLocalStartDate(startDate){
  offline.save('startDate', startDate);
  return (dispatch) => {
    dispatch(stateSaveLocalStartDate(startDate))
  }
}
export function getLocalStartDate(){
  return (dispatch, getState) => {
    return offline.get('startDate').then(startDate => {
      dispatch(stateSaveLocalStartDate(startDate));
    });
  }
}
function stateSaveLocalStartDate(startDate){
  var startDate = startDate ? startDate : new Date();
  return {
    type: types.SAVE_START_DATE,
    startDate: startDate,
  }
}