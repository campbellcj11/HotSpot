

class Api {
  // static headers() {
  //   var user = {uid:1}
  //   var userToken;
  //   // user.getToken().then();
  //   return {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'dataType': 'json',
  //     'token' : userToken,
  //     'uid' : user.uid,
  //   }
  // }

  static get(route, headers) {
    return this.xhr(route, headers, null, 'GET');
  }

  static put(route, headers, params) {
    return this.xhr(route, headers, params, 'PUT')
  }

  static post(route, headers, params) {
    return this.xhr(route, headers, params, 'POST')
  }

  static delete(route, headers, params) {
    return this.xhr(route, headers, params, 'DELETE')
  }

  static xhr(route, headers, params, verb) {
    const host = 'http://hotspotenv.6qmp7ct7m5.us-east-1.elasticbeanstalk.com'
    const url = `${host}${route}`
    // console.log('url: ', url);
    let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null );
    options.headers = headers
    return fetch(url, options).then( resp => {
      if (resp.ok) {
        return resp.json()
      }
      return resp.json().then(err => {throw err});
    }).then( json => json );
  }
}
export default Api
