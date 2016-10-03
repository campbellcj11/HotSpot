import offline from 'react-native-simple-store'

export default function(store) {

  store.subscribe(() => {
    console.log('Store ',store.getState());
  })
}
