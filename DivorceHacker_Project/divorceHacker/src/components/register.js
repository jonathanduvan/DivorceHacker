import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
// import PinAuth from './pin_auth';
import t from 'tcomb-form-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { signUp, addUser, updateUserCount, getAllProgress, fetchUserInfo } from '../backend/firebasedb';

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
stylesheet.textbox.normal.color = '#dddddd';
stylesheet.textbox.normal.borderRadius = 0;
stylesheet.textbox.error.color = '#dddddd';
stylesheet.textbox.normal.borderLeftColor = '#1B676B';
stylesheet.textbox.normal.borderRightColor = '#1B676B';
stylesheet.textbox.normal.borderTopColor = '#1B676B';

stylesheet.controlLabel.normal.color = '#dddddd';
stylesheet.controlLabel.error.color = '#dddddd';

const options = {
  auto: 'placeholders',
  fields: {
    FirstName: {
      autoCorrect: false,
      autoCapitalize: 'words',
      placeholderTextColor: '#dddddd',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#ff6600',
      returnKeyType: 'next',
      stylesheet,
      error: 'Please input your first name',
    },
    LastName: {
      autoCorrect: false,
      autoCapitalize: 'words',
      placeholderTextColor: '#dddddd',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#ff6600',
      returnKeyType: 'next',
      stylesheet,
      error: 'Please input your last name',
    },
    email: {
      keyboardType: 'email-address',
      autoCorrect: false,
      placeholderTextColor: '#dddddd',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#ff6600',
      returnKeyType: 'next',
      autoCapitalize: 'none',
      stylesheet,
      error: 'Please input a valid email',
    },
    doYouHaveChildren: {
      label: 'Do you have children?',
      stylesheet,
      onTintColor: '#ff6600',
    },
    pass_confirm: {
      error: 'Passwords must match',
      fields: {
        password: {
          password: true,
          secureTextEntry: true,
          placeholderTextColor: '#dddddd',
          clearButtonMode: 'while-editing',
          keyboardAppearance: 'dark',
          selectionColor: '#ff6600',
          returnKeyType: 'go',
          stylesheet,
          error: 'Please input a valid password',
        },
        ConfirmPassword: {
          password: true,
          secureTextEntry: true,
          placeholderTextColor: '#dddddd',
          clearButtonMode: 'while-editing',
          keyboardAppearance: 'dark',
          selectionColor: '#ff6600',
          returnKeyType: 'go',
          stylesheet,
          error: 'Please input a valid password',
        },
      },
    },
  },


};


class Register extends Component {
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

      this.props.navigation.navigate('About');

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
    // updateUserCount();
    // this.props.fetchUserInfo(userid, email);
    // this.props.getAllProgress(userid);
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
          <TouchableHighlight style={styles.button} onPress={() => this.Registered(1, 1)} underlayColor="#FF781A">
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
    backgroundColor: '#181715',
  },
  header: {
    borderWidth: 0.5,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 35,
    paddingBottom: 3,
    marginBottom: 10,
    color: '#dddddd',
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
    backgroundColor: '#ff6600',
    marginTop: 30,
    borderRadius: 50,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 40,
    paddingRight: 40,
  },
});

// react-redux glue
export default connect(null, { getAllProgress, fetchUserInfo })(Register);
