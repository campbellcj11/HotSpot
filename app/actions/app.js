import * as types from './types'
import Api from '../lib/api'


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
