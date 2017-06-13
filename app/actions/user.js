import * as types from './types'
import Api from '../lib/api'

locations = [
  {id:1,city:'Fort Worth',state:'TX'},
  {id:2,city:'Dallas',state:'TX'}
]
export function getUserLocations(){
  return {
    type: types.GET_USER_LOCATIONS,
    locations: locations,
  }
}
