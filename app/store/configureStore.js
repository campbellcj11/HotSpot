import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import syncOffline from './syncOffline'
import { createLogger } from 'redux-logger'

const logger = createLogger({ predicate: (getState, action) => __DEV__  });

export default function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunk, // lets us dispatch() functions
    ),
  );

  const store = createStore(reducer, initialState, enhancer);

  syncOffline(store)

  return store
}
