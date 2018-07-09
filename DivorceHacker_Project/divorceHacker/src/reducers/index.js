import { combineReducers } from 'redux';

import ProgressReducer from './progress-reducer';


export default function getRootReducer(navReducer) {
  return combineReducers({
    nav: navReducer,
    progress: ProgressReducer,
  });
}
