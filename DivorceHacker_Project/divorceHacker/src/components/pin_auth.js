import React, { Component } from 'react';
import Register from './register.js';
// import storage from 'react-native-simple-store';

import {
  AppRegistry,
  StyleSheet,
  Text,
  Dimensions,
  View,
  NavigatorIOS,
  TouchableHighlight,
  AlertIOS,
} from 'react-native';
import _ from 'lodash';
import Dashboard from './dashboard.js';
import t from 'tcomb-form-native';
// import storage from 'react-native-simple-store';


// clone the default stylesheet
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.textbox.normal.color = '#FFFFFF';
stylesheet.textbox.normal.borderRadius = 0;
stylesheet.textbox.normal.borderLeftColor = '#1B676B';
stylesheet.textbox.normal.borderRightColor = '#1B676B';
stylesheet.textbox.normal.borderTopColor = '#1B676B';
stylesheet.textbox.normal.width = 300;
stylesheet.textbox.normal.height = 70;
stylesheet.textbox.normal.fontSize = 36;
stylesheet.textbox.normal.marginTop = 100;

const Form = t.form.Form;

const PinForm = t.struct({

  Pin: t.Number,
});

const options = {
  auto: 'placeholders',
  fields: {
    Pin: {
      keyboardType: 'phone-pad',
      autoCorrect: false,
      autoCapitalize: 'none',
      placeholderTextColor: 'white',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#88C425',
      returnKeyType: 'next',
      autoCapitalize: 'none',
      stylesheet,
      error: 'Please input the authentication pin',
    },
  },
};

class PinAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
    };

    this._onPress = this._onPress.bind(this);
    this.authUser = this.authUser.bind(this);
  }

  authUser(token, user_id) {
    this.props.navigator.push({
      title: 'Dashboard',
      component: Dashboard,
    });
  }

  _onPress() {
    const value = this.refs.form.getValue();
    if (!value) {
      return null;
    }
    const pin = value.Pin;
    const user_id = this.state.user_id;
    const token = null;

    this.authUser(token, user_id);
  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.infoText}>Check your email for a {'\n'} pin and enter it here:</Text>

        <Text style={styles.hint}>Hint: it may take a few minutes</Text>

        <Form
          ref="form"
          type={PinForm}
          options={options}
          style={styles.title}
        />
        <TouchableHighlight onPress={this._onPress} style={styles.Registerbutton}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30,
    color: 'white',
  },
  hint: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'center',
    fontStyle: 'italic',
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center',
  },
  Registerbutton: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6600',
    borderBottomColor: '#000000',
    borderTopWidth: 30,
    paddingTop: 25,
    paddingBottom: 25,
    width: 275,
  },
  infoText: {
    marginTop: 50,
    color: 'white',
    fontSize: 24,
  },
});

export default PinAuth;
