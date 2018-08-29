import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  Image,
  View,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import t from 'tcomb-form-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import _ from 'lodash';
// import storage from 'react-native-simple-store';


import { signIn, fetchUser } from '../backend/firebasedb';


// import serverInfo from './env.js';


class DivorceHacker extends Component {
  static navigationOptions = () => ({
    headerRight: null,
    headerLeft: null,
    gesturesEnabled: false,
  });
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: null,
      progress: 0,
      token_button: null,
      keep_login: true,
      success: null,
      test: null,
    };

    this._onLoginForward = this._onLoginForward.bind(this);
    this._onRegisterForward = this._onRegisterForward.bind(this);
    this.access_token = this.access_token.bind(this);
    this.render_token = this.render_token.bind(this);
    this._onLoginSuccess = this._onLoginSuccess.bind(this);
  }

  _onLoginForward() {
    const value = this.form.getValue();
    if (value) {
      const user_email = value.login.email;
      const user_password = value.login.password;

      // const token = null;
      signIn(user_email, user_password)
        .then(user => this._onLoginSuccess(user, user_email))
        .catch((error) => {
          alert(error.message);
        });
    }
  }

  _onLoginSuccess(user, email) {
    this.props.fetchUser(user.uid, email);
    this.props.navigation.navigate('Dashboard');
  }

  _onRegisterForward() {
    this.props.navigation.navigate('Register');
  }


  access_token() {
    if (this.state.keep_login === false) {
      return (
        <Icon name="ios-close-circle-outline" color="#f95543" size={28} style={styles.select_token} onPress={this.render_token} />
      );
    }

    return (
      <Icon name="ios-checkmark-circle-outline" color="#3bdba5" size={28} style={styles.select_token} onPress={this.render_token} />
    );
  }
  render_token() {
    this.setState({
      keep_login: !this.state.keep_login,
    });
  }

  /* eslint-disable-line global-require */

  render() {
    const Form = t.form.Form;
    const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
    const Email = t.refinement(t.String, s => /@/.test(s));

    const login = t.struct({
      email: Email,
      password: t.String,
    });

    const LoginForm = t.struct({
      login,
    });


    // overriding the text color
    stylesheet.textbox.normal.color = '#181715';
    stylesheet.textbox.error.color = '#181715';
    stylesheet.textbox.normal.borderRadius = 0.5;
    stylesheet.textbox.normal.borderColor = '#181715';
    stylesheet.textbox.normal.borderRightColor = '#181715';
    stylesheet.textbox.normal.borderTopColor = '#181715';


    const options = {
      auto: 'placeholders',
      fields: {
        login: {
          error: 'Incorrect email and/or password',
          fields: {
            password: {
              password: true,
              secureTextEntry: true,
              placeholderTextColor: '#181715',
              clearButtonMode: 'while-editing',
              keyboardAppearance: 'dark',
              selectionColor: '#577D7E',
              returnKeyType: 'go',
              stylesheet,
              error: 'Please insert a valid password',
            },
            email: {
              keyboardType: 'email-address',
              autoCorrect: false,
              autoCapitalize: 'none',
              placeholderTextColor: '#181715',
              clearButtonMode: 'while-editing',
              keyboardAppearance: 'dark',
              selectionColor: '#577D7E',
              returnKeyType: 'next',
              stylesheet,
              error: 'Please insert a valid email address',
            },
          },
        },
      },
    };

    return (

      <KeyboardAvoidingView style={styles.keyboard_container} behavior="padding" enabled>
        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
          />
          <Image source={require('../../photos/DivorceHacker_Logo.png')} style={styles.logo} onLoadEnd={this.handleImageLoaded} />

          <View style={styles.word_container}>
            <Text style={styles.LoginButtonText} onPress={() => this._onLoginForward()}>Login</Text>
            <Text style={styles.orText}> or </Text>
            <Text style={styles.RegisterButtonText} onPress={this._onRegisterForward}>Register</Text>
          </View>

          {/* display */}
          <View style={styles.form_container}>
            <Form
              ref={(form) => { this.form = form; }}
              type={LoginForm}
              options={options}
            />
          </View>
          <View style={styles.token_container}>
            <Text style={styles.orText}>Keep me logged in.</Text>
            {this.access_token()}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f3f9f9',
    padding: 10,
    marginTop: 20,

  },
  keyboard_container: {
    justifyContent: 'space-around',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f3f9f9',
    padding: 10,
  },
  word_container: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    top: 70,
    marginBottom: -30,
  },
  form_container: {
    flex: 1,
    top: 30,
  },
  token_container: {
    flexDirection: 'row',
  },
  select_token: {
    left: 15,
    marginTop: -3,
  },
  logo: {
    bottom: 30,
    marginBottom: -150,
    width: '100%',
    height: '40%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    padding: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  LoginButtonText: {
    fontSize: 18,
    color: '#356567',
  },
  orText: {
    fontSize: 18,
    color: '#464543',
  },
  RegisterButtonText: {
    fontSize: 18,
    color: '#356567',
  },
  left_nav: {
    left: 10,
  },
});


// react-redux glue
export default connect(null, { fetchUser })(DivorceHacker);
