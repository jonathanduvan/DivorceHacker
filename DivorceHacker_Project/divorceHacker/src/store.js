import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import getRootReducer from './reducers';

// Redux store setup
export default function getStore(navReducer) {
  const store = createStore(
    getRootReducer(navReducer),
    {},
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );

  return store;
}


// const store = createStore(getRootReducer(navReducer), {}, compose(
//   applyMiddleware(thunk),
//   window.devToolsExtension ? window.devToolsExtension() : f => f,
// ));

// export default store;
