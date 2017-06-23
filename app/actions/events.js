import * as types from './types'
import Api from '../lib/api'

//Testing Data
import testImage from '../images/gal_01.png'

FWevents = [
  {id:'1',title:'Dojanire Art Galla',startDate:new Date(),location:'Metz Hall',shortDescription:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in sodales erat, eu',image:testImage,tag:'Art'},
  {id:'2',title:'Event 2 title that is a little long and it cant be much longer',startTime:'7:30pm',location:'Metz Hall',shortDescription:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in sodales erat, eu',image:testImage,tag:'Sport'},
  {id:'3',title:'Event 3 has a rediculously long title and it will get cut off for sure',image:testImage,tag:'Comedy'},
  {id:'4',title:'Event 4'},
  {id:'5',title:'Event 5'},
  {id:'6',title:'Event 6'},
  {id:'7',title:'Event 7'},
  {id:'8',title:'Event 8'},
  {id:'9',title:'Event 9'},
  {id:'10',title:'Event 10'},
  {id:'11',title:'Event 11'},
  {id:'12',title:'Event 12'},
  {id:'13',title:'Event 13'},
  {id:'14',title:'Event 14'},
  {id:'15',title:'Event 15'},
  {id:'16',title:'Event 16'},
  {id:'17',title:'Event 17'},
  {id:'18',title:'Event 18'},
  {id:'19',title:'Event 19'},
  {id:'20',title:'Event 20'},
];

Devents = [
  {id:'21',title:'Event 21'},
  {id:'22',title:'Event 22'},
  {id:'23',title:'Event 23'},
  {id:'24',title:'Event 24'},
  {id:'25',title:'Event 25'},
  {id:'26',title:'Event 26'},
  {id:'27',title:'Event 27'},
  {id:'28',title:'Event 28'},
  {id:'29',title:'Event 29'},
  {id:'30',title:'Event 30'},
  {id:'31',title:'Event 31'},
  {id:'32',title:'Event 32'},
  {id:'33',title:'Event 33'},
  {id:'34',title:'Event 34'},
  {id:'35',title:'Event 35'},
  {id:'36',title:'Event 36'},
  {id:'37',title:'Event 37'},
  {id:'38',title:'Event 38'},
  {id:'39',title:'Event 39'},
  {id:'40',title:'Event 40'},
];

// export function getEvents(filters){
//   return (dispatch, getState) => {
//     const params = [
//       'startDate=${encodeURIComponent(filters.startDate)}',
//       'endDate=${encodeURIComponent(filters.endDate)}',
//       'locationID=${encodeURIComponent(filters.locationID)}',
//       'pageLimit=20',
//     ].join('&'); //this gets appened to the url
//     return Api.get('/events/getWithParams?${params}').then(resp => {
//       console.warn('GetEvents Success');
//       var currentEventsHash = getState().events.fetchedEventsHash;
//       currentEventsHash[filters.locationID] = eventsToShow;
//       var newEventsHash = currentEventsHash;
//       dispatch(setFetchedEvents(resp,filters.locationID,newEventsHash));
//       // dispatch(setFetchedEvents(eventsToShow,filters.locationID,newEventsHash))
//     }).catch( (ex) => {
//       console.warn('GetEvents Fail');
//     })
//   }
// }
export function getEvents(filters){
  return (dispatch, getState) => {
    // const params = [
    //   'startDate=${encodeURIComponent(filters.startDate)}',
    //   'startDate=${encodeURIComponent(filters.endDate)}',
    //   'locationID=${encodeURIComponent(filters.locationID)}',
    //   'pageLimit=50',
    // ].join('&'); //this gets appened to the url
    // return Api.get('/events/getWithParams?${params}').then(resp => {
    //   console.warn('Success');
    //   dispatch(setFetchedEvents({ events: resp }));
    // }).catch( (ex) => {
    //   console.warn('Fail');
    // })

    var currentEventsHash = getState().events.fetchedEventsHash;

    pageLimit = 5;
    pageNumber = filters.page;
    startIndex = pageNumber*pageLimit;
    endIndex = startIndex+pageLimit;

    eventsToShow = [];

    for( i=startIndex ; i < endIndex ; i++ ){
      if(filters.locationID == 1){
        if(i < FWevents.length){
          event = FWevents[i];
          event.cityID = filters.locationID;
          eventsToShow.push(event);
        }
      }
      else{
        if(i < Devents.length){
          event = Devents[i];
          event.cityID = filters.locationID;
          eventsToShow.push(event);
        }
      }
    }
    currentEventsHash[filters.locationID] = eventsToShow;

    var newEventsHash = currentEventsHash;

    dispatch(setFetchedEvents(eventsToShow,filters.locationID,newEventsHash))
  }
}

export function loadMoreEvents(filters){
  return (dispatch, getState) => {
    var currentEventsHash = getState().events.fetchedEventsHash;

    eventsToShow = [];

    for( i=0 ; i < filters.currentEvents.length ; i++ ){
      if(filters.locationID == 1){
        if(i < FWevents.length){
          event = FWevents[i];
          eventsToShow.push(event);
        }
      }
      else{
        if(i < Devents.length){
          event = Devents[i];
          eventsToShow.push(event);
        }
      }
    }

    pageLimit = 5;
    pageNumber = filters.page;
    startIndex = pageNumber*pageLimit;
    endIndex = startIndex+pageLimit;

    for( i=startIndex ; i < endIndex ; i++ ){
      if(filters.locationID == 1){
        if(i < FWevents.length){
          event = FWevents[i];
          event.cityID = filters.locationID;
          eventsToShow.push(event);
        }
      }
      else{
        if(i < Devents.length){
          event = Devents[i];
          event.cityID = filters.locationID;
          eventsToShow.push(event);
        }
      }
    }
    currentEventsHash[filters.locationID] = eventsToShow;

    var newEventsHash = currentEventsHash;

    dispatch(setFetchedEvents(eventsToShow,filters.locationID,newEventsHash))
  }
}

export function setFetchedEvents(events,locationID,currentEventsHash){
  return {
    type: types.SET_FETCHED_EVENTS,
    events: events,
    locationID: locationID,
    currentEventsHash: currentEventsHash,
  }
}
