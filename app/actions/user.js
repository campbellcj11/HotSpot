import * as types from './types'
import Api from '../lib/api'

//Test Images
import image1 from '../images/image1.png'
import image2 from '../images/image2.png'

locations = [
  {id:1,city:'Fort Worth',state:'TX',image:image1},
  {id:2,city:'Dallas',state:'TX',image:image2}
]
export function getUserLocations(){
  return {
    type: types.GET_USER_LOCATIONS,
    locations: locations,
  }
}
