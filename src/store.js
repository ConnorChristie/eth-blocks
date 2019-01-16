import { createStore, applyMiddleware, compose } from 'redux';
import persistState from 'redux-localstorage';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(ReduxThunk),
    persistState(['transactions', 'contracts'])
  )
);
