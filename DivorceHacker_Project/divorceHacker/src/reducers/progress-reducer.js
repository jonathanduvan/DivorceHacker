import { ActionTypes } from '../backend/firebasedb';

const ProgressReducer = (state = { all: {}, currentCategory: null, currentGoal: null, userInfo: {} }, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PROGRESS:
      return {
        ...state,
        all: action.payload };
    case ActionTypes.FETCH_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload };
    case ActionTypes.FETCH_TASKS:
      return {
        ...state,
        currentGoal: action.payload };
    case ActionTypes.FETCH_USER_INFO:
      return {
        ...state,
        userInfo: action.payload };
    case ActionTypes.UPDATE_PROGRESS:
      return {
        ...state,
        all: action.payload.newProgress };
    case ActionTypes.UPDATE_USER_INFO:
      return {
        ...state,
        userInfo: action.payload.newInfo };
    default:
      return state;
  }
};

export default ProgressReducer;
