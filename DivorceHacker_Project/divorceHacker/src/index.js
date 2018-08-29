import React, { Component } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { Provider, connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
// import createFragment from 'react-addons-create-fragment';

import Routes from './routes';

import getStore from './store';

console.disableYellowBox = true;
// Establish Routes and Navigator Bar Style
const AppNavigator = StackNavigator(Routes, {
  navigationOptions: {
    headerStyle: { backgroundColor: '#f3f9f9', height: Dimensions.get('window').height / 8, borderColor: '#f3f9f9' },
    headerTintColor: '#577D7E',
  },
});

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};
// Connect App navigator with state
@connect(state => ({
  nav: state.nav,
}))
class AppWithNavigationState extends Component {
  render() {
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
          reduxState: this.props.state,
        })}
      />
    );
  }
}

const store = getStore(navReducer);

export default function App() {
  return (
    <Provider store={store}>
      <AppWithNavigationState />
    </Provider>
  );
}
