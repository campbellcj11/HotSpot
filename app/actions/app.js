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
      console.warn('Error: ', ex);
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
      if(startDate < new Date())
      {
        startDate = new Date();
      }
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

export function setLocalEndDate(endDate){
  offline.save('endDate', endDate);
  return (dispatch) => {
    dispatch(stateSaveLocalEndDate(endDate))
  }
}
export function getLocalEndDate(){
  return (dispatch, getState) => {
    return offline.get('endDate').then(endDate => {
      dispatch(stateSaveLocalEndDate(endDate));
    });
  }
}
function stateSaveLocalEndDate(endDate){
  var endDate = endDate ? endDate : getOneYearOut();
  return {
    type: types.SAVE_END_DATE,
    endDate: endDate,
  }
}
function getOneYearOut(){
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var day = today.getDate();
  var todayNextYear = new Date(year + 1, month, day)

  return todayNextYear;
}

export function setDateFilterType(filterType){
  offline.save('dateFilterType', filterType);
  return (dispatch) => {
    dispatch(stateSaveDateFilterType(filterType))
  }
}
export function getDateFilterType(){
  return (dispatch, getState) => {
    return offline.get('dateFilterType').then(dateFilterType => {
      dispatch(stateSaveDateFilterType(dateFilterType));
    });
  }
}
function stateSaveDateFilterType(filterType){
  return {
    type: types.SAVE_DATE_FILTER_TYPE,
    dateFilterType: filterType,
  }
}
