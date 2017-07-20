import * as types from './types'
import Api from '../lib/api'
import * as firebase from 'firebase';
//initialize firebase TODO:pull from a credentials file

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

export function getEvents(filters){
  return (dispatch, getState) => {
    // firebase.auth().currentUser.getToken().then(token => {
      var uid = getState().user.user.uid;
      var token = '0000';

      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
        'uid' : uid,
        'token' : token,
      }
      var body ={
      	"tags": filters.tags,
          "sortBy": "start_date",
          "pageSize": 20,
          "pageNumber": filters.page,
          "count": filters.showCount,
          "query": [
          	{
          		"field": "locale_id",
          		"operator": "=",
          		"value": filters.locationID,
          		"logicAfter" : "AND"
          	},
          	{
          		"field": "status",
          		"operator": "=",
          		"value": "active",
          		"logicAfter" : "AND"
          	},
          	{
          		"field": "start_date",
          		"operator": ">=",
          		"value": filters.startDate,
              "logicAfter" : "AND"
          	},
            {
          		"field": "start_date",
          		"operator": "<=",
          		"value": filters.endDate
          	}
          ]
      }
      return Api.post('/getEvents?',headers,body).then(resp => {

        // console.warn('GetEvents Success');
        // console.warn(resp.count);
        var events = [];
        if(filters.showCount){
          events = resp.events;
        }
        else {
          events = resp;
        }

        var currentEventsHash = getState().events.fetchedEventsHash;
        currentEventsHash[filters.locationID] = events;
        var newEventsHash = currentEventsHash;

        // for(var i=0;i<Object.keys(currentEventsHash);i++)
        // {
        //   var key = Object.keys(currentEventsHash)[i];
        //   if(key == filters.locationID)
        //   {
        //     newEventsHash[key] = events
        //   }
        //   else {
        //     newEventsHash[key] = currentEventsHash[key];
        //   }
        // }
        // dispatch(setFetchedEvents(resp,filters.locationID,newEventsHash));
        // console.log('Events: ', events);
        // console.warn('Filters: ', filters.locationID);
        // console.warn('NEH: ', newEventsHash);
        // console.warn(Object.keys(newEventsHash));

        clearTimeout(this.eventsTimeout);
        this.eventsTimeout = setTimeout(() => dispatch(setFetchedEvents(events,filters.locationID,newEventsHash)), 500)

      }).catch( (ex) => {
        // console.warn('Error: ', ex);
        // console.warn('GetEvents Fail');
      })
    // }).catch( (ex) => {
    //   console.warn('Error: ', ex);
    //   console.warn('Issue with auth');
    // })
  }
}
export function getPopular(filters){
  return (dispatch, getState) => {
    // firebase.auth().currentUser.getToken().then(token => {
      var uid = getState().user.user.uid;
      var token = '0000';

      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
        'uid' : uid,
        'token' : token,
      }
      var startDate = new Date(filters.startDate);
      var startDate2 = new Date(filters.startDate);
      var hours2Later = startDate2.setHours(startDate2.getHours()+2);
      hours2Later = new Date(hours2Later);

      var body ={
      	  "tags": [],
          "sortBy": "interested",
          "sortOrder": "DESC",
          "pageSize": filters.pageSize ? filters.pageSize : 20,
          "pageNumber": filters.page,
          "count": filters.showCount,
          "query": [
          	{
          		"field": "status",
          		"operator": "=",
          		"value": "active",
          		"logicAfter" : "AND"
          	},
          	{
          		"field": "start_date",
          		"operator": ">=",
          		"value": filters.startDate
          	}
          ]
      }
      return Api.post('/getEvents?',headers,body).then(resp => {

        // console.warn('SearchEvents Success');
        // console.warn(resp.count);
        var events = [];
        if(filters.showCount){
          events = resp.events;
        }
        else {
          events = resp;
        }
        // console.log(events);
        return events;

      }).catch( (ex) => {
        console.warn('Error: ', ex);
        console.warn('Popular Fail');
      })
    // }).catch( (ex) => {
    //   console.warn('Error: ', ex);
    //   console.warn('Issue with auth');
    // })
  }
}
export function getNowEvents(filters){
  return (dispatch, getState) => {
    // firebase.auth().currentUser.getToken().then(token => {
      var uid = getState().user.user.uid;
      var token = '0000';

      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
        'uid' : uid,
        'token' : token,
      }
      var startDate = new Date(filters.startDate);
      var startDate2 = new Date(filters.startDate);
      var hours2Later = startDate2.setHours(startDate2.getHours()+2);
      hours2Later = new Date(hours2Later);

      var body ={
      	  "tags": [],
          "sortBy": "start_date",
          "pageSize": filters.pageSize ? filters.pageSize : 20,
          "pageNumber": filters.page,
          "count": filters.showCount,
          "query": [
          	{
          		"field": "status",
          		"operator": "=",
          		"value": "active",
          		"logicAfter" : "AND"
          	},
          	{
          		"field": "start_date",
          		"operator": ">=",
          		"value": filters.startDate,
              "logicAfter" : "AND"
          	},
            {
          		"field": "start_date",
          		"operator": "<=",
          		"value": hours2Later
          	}
          ]
      }
      return Api.post('/getEvents?',headers,body).then(resp => {

        // console.warn('SearchEvents Success');
        // console.warn(resp.count);
        var events = [];
        if(filters.showCount){
          events = resp.events;
        }
        else {
          events = resp;
        }

        return events;

      }).catch( (ex) => {
        console.warn('Error: ', ex);
        console.warn('HappeningNow Fail');
      })
    // }).catch( (ex) => {
    //   console.warn('Error: ', ex);
    //   console.warn('Issue with auth');
    // })
  }
}
export function searchEvents(filters){
  return (dispatch, getState) => {
    // firebase.auth().currentUser.getToken().then(token => {
      var uid = getState().user.user.uid;
      var token = '0000';

      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
        'uid' : uid,
        'token' : token,
      }
      var body ={
      	  "tags": [],
          "sortBy": "start_date",
          "pageSize": 20,
          "pageNumber": filters.page,
          "count": filters.showCount,
          "query": [
          	{
          		"field": "status",
          		"operator": "=",
          		"value": "active",
          		"logicAfter" : "AND"
          	},
          	{
          		"field": "start_date",
          		"operator": ">=",
          		"value": filters.startDate,
              "logicAfter" : "AND"
          	},
            {
          		"field": "name",
          		"operator": "LIKE",
          		"value": filters.searchText,
          	}
          ]
      }
      return Api.post('/getEvents?',headers,body).then(resp => {

        // console.warn('SearchEvents Success');
        // console.warn(resp.count);
        var events = [];
        if(filters.showCount){
          events = resp.events;
        }
        else {
          events = resp;
        }

        return events;

      }).catch( (ex) => {
        console.warn('Error: ', ex);
        console.warn('SearchEvents Fail');
      })
    // }).catch( (ex) => {
    //   console.warn('Error: ', ex);
    //   console.warn('Issue with auth');
    // })
  }
}

export function loadMoreEvents(filters){
  // console.warn('loadingMore');
  return (dispatch, getState) => {
    // firebase.auth().currentUser.getToken().then(token => {
      var uid = getState().user.user.uid;
      var token = '0000';

      // console.warn('EndDate: ',filters.endDate);
      // console.warn('Filters.page: ', filters.page);
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
        'uid' : uid,
        'token' : token,
      }
      var body ={
        "tags": filters.tags,
          "sortBy": "start_date",
          "pageSize": 20,
          "pageNumber": filters.page,
          "count": filters.showCount,
          "query": [
            {
              "field": "locale_id",
              "operator": "=",
              "value": filters.locationID,
              "logicAfter" : "AND"
            },
            {
              "field": "status",
              "operator": "=",
              "value": "active",
              "logicAfter" : "AND"
            },
            {
              "field": "start_date",
              "operator": ">=",
              "value": filters.startDate,
              "logicAfter" : "AND"
            },
            {
              "field": "start_date",
              "operator": "<=",
              "value": filters.endDate
            }
          ]
      }
      return Api.post('/getEvents?',headers,body).then(resp => {

        // console.warn('Loading More Success');
        // console.warn('R: ',resp.count);

        var currentEventsHash = getState().events.fetchedEventsHash;
        var currentEvents = currentEventsHash[filters.locationID];

        // var events = currentEvents;

        // console.warn('EB: ',currentEvents.length);
        if(filters.showCount){
          for(var i=0;i<resp.events.length;i++){
            currentEvents.push(resp.events[i]);
          }
          // currentEvents.concat(resp.events);
        }
        else {
          for(var i=0;i<resp.length;i++){
            currentEvents.push(resp[i]);
          }
          // currentEvents.concat(resp);
        }
        // console.warn('EA: ',currentEvents.length);
        // currentEvents.concat(events);
        var newEvents = []
        for(var i=0;i<currentEvents.length;i++){
          newEvents.push(currentEvents[i])
        }
        currentEventsHash[filters.locationID] = newEvents;
        // var newEventsHash = currentEventsHash;
        // dispatch(setFetchedEvents(resp,filters.locationID,newEventsHash));
        // console.warn('Events: ', events);
        // console.warn('Filters: ', filters.locationID);
        // console.warn('NEH: ', newEventsHash);
        dispatch(setFetchedEvents(newEvents,filters.locationID,currentEventsHash))

      }).catch( (ex) => {
        console.warn('Error: ', ex);
        console.warn('LoadMore Fail');
      })
    // }).catch( (ex) => {
    //   console.warn('Error: ', ex);
    //   console.warn('Issue with auth');
    // })
  }
}
// export function loadMoreEvents(filters){
//   return (dispatch, getState) => {
//     var currentEventsHash = getState().events.fetchedEventsHash;
//
//     eventsToShow = [];
//
//     for( i=0 ; i < filters.currentEvents.length ; i++ ){
//       if(filters.locationID == 1){
//         if(i < FWevents.length){
//           event = FWevents[i];
//           eventsToShow.push(event);
//         }
//       }
//       else{
//         if(i < Devents.length){
//           event = Devents[i];
//           eventsToShow.push(event);
//         }
//       }
//     }
//
//     pageLimit = 5;
//     pageNumber = filters.page;
//     startIndex = pageNumber*pageLimit;
//     endIndex = startIndex+pageLimit;
//
//     for( i=startIndex ; i < endIndex ; i++ ){
//       if(filters.locationID == 1){
//         if(i < FWevents.length){
//           event = FWevents[i];
//           event.cityID = filters.locationID;
//           eventsToShow.push(event);
//         }
//       }
//       else{
//         if(i < Devents.length){
//           event = Devents[i];
//           event.cityID = filters.locationID;
//           eventsToShow.push(event);
//         }
//       }
//     }
//     currentEventsHash[filters.locationID] = eventsToShow;
//
//     var newEventsHash = currentEventsHash;
//
//     dispatch(setFetchedEvents(eventsToShow,filters.locationID,newEventsHash))
//   }
// }

export function setFetchedEvents(events,locationID,currentEventsHash){
  return {
    type: types.SET_FETCHED_EVENTS,
    events: events,
    locationID: locationID,
    currentEventsHash: currentEventsHash,
  }
}
