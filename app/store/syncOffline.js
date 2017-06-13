import offline from 'react-native-simple-store'

export default function(store) {

  store.subscribe(() => {
    const {user} = store.getState().user;
  })
}
