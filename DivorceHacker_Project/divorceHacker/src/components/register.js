import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
// import PinAuth from './pin_auth';
import t from 'tcomb-form-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { signUp, addUser, fetchUser } from '../backend/firebasedb';

const Form = t.form.Form;

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

const Email = t.refinement(t.String, s => /@/.test(s));

const Password = t.refinement(t.String, s => s.length >= 2);

function samePasswords(x) {
  return x.password === x.ConfirmPassword;
}

const pass_confirm = t.subtype(t.struct({
  password: Password,
  ConfirmPassword: Password,
}), samePasswords);

const Person = t.struct({
  FirstName: t.String,
  LastName: t.String,
  email: Email,
  pass_confirm,
  doYouHaveChildren: t.Boolean,
});


// overriding the text color
stylesheet.textbox.normal.color = '#181715';
stylesheet.textbox.normal.borderRadius = 1;
stylesheet.textbox.error.color = '#181715';
stylesheet.textbox.normal.borderColor = '#181715';


stylesheet.controlLabel.normal.color = '#181715';
stylesheet.controlLabel.error.color = '#181715';

const options = {
  auto: 'placeholders',
  fields: {
    FirstName: {
      autoCorrect: false,
      autoCapitalize: 'words',
      placeholderTextColor: '#464543',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#577D7E',
      returnKeyType: 'next',
      stylesheet,
      error: 'Please input your first name',
    },
    LastName: {
      autoCorrect: false,
      autoCapitalize: 'words',
      placeholderTextColor: '#464543',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#577D7E',
      returnKeyType: 'next',
      stylesheet,
      error: 'Please input your last name',
    },
    email: {
      keyboardType: 'email-address',
      autoCorrect: false,
      placeholderTextColor: '#464543',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#577D7E',
      returnKeyType: 'next',
      autoCapitalize: 'none',
      stylesheet,
      error: 'Please input a valid email',
    },
    doYouHaveChildren: {
      label: 'Do you have children?',
      stylesheet,
      onTintColor: '#577D7E',
    },
    pass_confirm: {
      error: 'Passwords must match',
      fields: {
        password: {
          password: true,
          secureTextEntry: true,
          placeholderTextColor: '#464543',
          clearButtonMode: 'while-editing',
          keyboardAppearance: 'dark',
          selectionColor: '#577D7E',
          returnKeyType: 'go',
          stylesheet,
          error: 'Please input a valid password',
        },
        ConfirmPassword: {
          password: true,
          secureTextEntry: true,
          placeholderTextColor: '#464543',
          clearButtonMode: 'while-editing',
          keyboardAppearance: 'dark',
          selectionColor: '#577D7E',
          returnKeyType: 'go',
          stylesheet,
          error: 'Please input a valid password',
        },
      },
    },
  },


};


class Register extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft:
  <Icon
    name="chevron-left"
    size={25}
    color="#577D7E"
    style={{ left: 17, marginTop: 10 }}
    onPress={() => navigation.goBack()}
  />,
    cardStack: {
      gesturesEnabled: false,
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      options,
      value: null,
      type: Person,
      registered: null,
      success: null,
      test: null,
      register_error: null,
      signup_error: null,
      navigator: this.navigator,
    };

    this.onPress = this.onPress.bind(this);
    this._onRegisterSuccess = this._onRegisterSuccess.bind(this);
    this.Registered = this.Registered.bind(this);
  }

  onPress() {
    const value = this.form.getValue();
    if (value) {
      const user_first_name = value.FirstName;
      const user_last_name = value.LastName;
      const user_email = value.email;
      const user_password = value.pass_confirm.password;
      const user_children = value.doYouHaveChildren;

      let uID = null;

      signUp(user_email, user_password).then((user) => {
        uID = user.uid;
        this._onRegisterSuccess(uID, user_first_name,
          user_last_name, user_email, user_children);
      })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    }
  }

  _onRegisterSuccess(uID, firstName, lastName, email, hasChildren) {
    addUser(uID, firstName, lastName, email, hasChildren).then(() => {
      this.Registered(uID, email);
    })
      .catch((error) => {
        alert(error.message);
      });
  }

  Registered(userid, email) {
    this.props.fetchUser(userid, email);
    this.props.navigation.navigate('About');
    return true;
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.header}>
          <Text style={styles.headerText}>Register</Text>
        </View>
        <ScrollView style={styles.scroll}>
          {/* display */}
          <View style={styles.form_container}>
            <Form
              ref={(form) => { this.form = form; }}
              type={this.state.type}
              options={this.state.options}
              value={this.state.value}
            />
          </View>
          <TouchableHighlight style={styles.button} onPress={() => this.onPress()} underlayColor="#577D7E">
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableHighlight>
        </ScrollView>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f3f9f9',
    borderColor: '#f3f9f9',
  },
  header: {
    borderWidth: 0.5,
    marginTop: -15,
    borderColor: 'transparent',
  },
  headerText: {
    fontSize: 35,
    paddingBottom: 3,
    marginBottom: 10,
    color: '#181715',
    fontWeight: '200',
  },
  scroll: {
    flex: 1,
  },
  logo: {
    width: 325,
    height: 80,
    alignSelf: 'center',
  },
  logo_container: {
    marginTop: 50,
    bottom: 20,
    borderBottomColor: '#7D7D7D',
    borderBottomWidth: 1,
  },
  form_container: {
    flex: 1,
  },
  buttonText: {
    fontSize: 20,
    color: '#181715',
    alignSelf: 'center',
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#C2E5E6',
    borderColor: '#577D7E',
    borderWidth: 3.5,
    marginTop: 30,
    borderRadius: 50,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 40,
    paddingRight: 40,
  },
});

// react-redux glue
export default connect(null, { fetchUser })(Register);
