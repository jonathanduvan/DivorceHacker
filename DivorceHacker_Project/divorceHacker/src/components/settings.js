import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import t from 'tcomb-form-native';
import _ from 'lodash';

import { updatePropsUserInfo } from '../backend/firebasedb';


// import PinAuth from './pin_auth';
// import t from 'tcomb-form-native';
// import _ from 'lodash';
// import * as firebasedb from '../backend/firebasedb';


const Form = t.form.Form;

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

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
    firstName: {
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
    lastName: {
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
    passConfirm: {
      error: 'Passwords must match',
      fields: {
        currentPassword: {
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
        confirmPassword: {
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
function samePasswords(x) {
  return (x.password === x.ConfirmPassword) && (x.password !== x.currentPassword);
}

class Settings extends Component {
  static navigationOptions =({ navigation }) => ({
    title: 'Settings',
    headerStyle: { backgroundColor: '#181715' },
    headerLeft:
  <Icon
    name="chevron-left"
    size={20}
    color="#dddddd"
    style={{ left: 5 }}
    onPress={() => navigation.goBack()}
  />,
    headerRight: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      passwordCheck: {},
      activeSection: false,
      nameModalVisible: false,
      emailModalVisible: false,
      passwordModalVisible: false,
      nameChange: false,
      emailChange: false,
      passwordChange: false,

    };
    this.buildSettings = this.buildSettings.bind(this);
    this.emailFormModal = this.emailFormModal.bind(this);
    this.nameFormModal = this.nameFormModal.bind(this);
    this.passwordFormModal = this.passwordFormModal.bind(this);

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);

    this.editEmail = this.editEmail.bind(this);
    this.editName = this.editName.bind(this);
    this.showModal = this.showModal.bind(this);
  }
  componentWillMount() {
    if (Object.keys(this.props.userInfo).length !== 0) {
      this.setState({
        value: {
          firstName: this.props.userInfo.firstName,
          lastName: this.props.userInfo.lastName,
          email: this.props.userInfo.email,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.userInfo).length !== 0) {
      this.setState({
        value: {
          firstName: nextProps.userInfo.firstName,
          lastName: nextProps.userInfo.lastName,
          email: nextProps.userInfo.email,
        },
        nameChange: false,
        emailChange: false,
        passwordChange: false,
        nameModalVisible: false,
        emailModalVisible: false,
        passwordModalVisible: false,
      });
    }
  }


  editPassword() {
    /* Render*/
  }


  onEmailChange() {
    if (!this.state.emailChange) {
      this.setState({
        emailChange: true,
      });
    }
  }

  editEmail() {
    /* Render*/
    const emailValues = this.emailForm.getValue();
    if (emailValues) {
      const { value } = this.state;
      value.email = emailValues.email;


      this.props.updatePropsUserInfo(value);
    }
  }

  onNameChange() {
    // const value = this.state.value;
    // value.firstName = e.firstName;
    // value.lastName = e.lastName;
    // this.setState({
    //   value,
    // });


    if (!this.state.nameChange) {
      this.setState({
        nameChange: true,
      });
    }
  }

  editName() {
    /* Render*/
    const nameValues = this.nameForm.getValue();
    const { value } = this.state;

    if (nameValues) {
      value.firstName = nameValues.firstName;
      value.lastName = nameValues.lastName;
      // this.setState({
      //   value,
      // });

      this.props.updatePropsUserInfo(value);
    }
  }

  emailFormModal() {
    const Email = t.refinement(t.String, s => /@/.test(s));

    const emailInputs = t.struct({
      email: Email,
    });

    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.emailModalVisible}
        style={styles.container}
      >
        <View style={styles.containerModal}>
          <View style={styles.iconContainer}>
            <Icon name="times-circle" color="#d1d1d1" size={28} style={styles.select_token} onPress={() => this.closeModal()} />
          </View>
          <Form
            ref={(form) => { this.emailForm = form; }}
            type={emailInputs}
            onChange={() => this.onEmailChange()}
            value={this.state.value}
            options={options}
          />

          {this.state.emailChange ? (<TouchableHighlight style={styles.button} onPress={() => this.editEmail()} underlayColor="#FF781A">
            <Text style={styles.buttonText}>Update Email</Text>
          </TouchableHighlight>) : (<Text style={styles.updateText}>Email Up to Date</Text>)}

        </View>
      </Modal>

    );
  }
  passwordFormModal() {
    const Password = t.refinement(t.String, s => s.length >= 2);
    const passConfirm = t.subtype(t.struct({
      currentPassword: Password,
      password: Password,
      confirmPassword: Password,
    }), samePasswords);

    const passInputs = t.struct({
      passConfirm,
    });


    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.passwordModalVisible}
        style={styles.container}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}
      >
        <View style={styles.containerModal}>
          <View style={styles.iconContainer}>
            <Icon name="times-circle" color="#d1d1d1" size={28} style={styles.select_token} onPress={() => this.closeModal('Password')} />
          </View>
          <Form
            ref={(form) => { this.passForm = form; }}
            type={passInputs}
            options={options}
          />
          <TouchableHighlight style={styles.button} underlayColor="#FF781A">
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableHighlight>
        </View>
      </Modal>

    );
  }

  nameFormModal() {
    const nameInputs = t.struct({
      firstName: t.String,
      lastName: t.String,
    });

    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.nameModalVisible}
        style={styles.container}
      >
        <View style={styles.containerModal}>
          <View style={styles.iconContainer}>
            <Icon name="times-circle" color="#d1d1d1" size={28} style={styles.select_token} onPress={() => this.closeModal('Name')} />
          </View>
          <KeyboardAvoidingView behavior="padding" enabled>
            <Form
              type={nameInputs}
              ref={(form) => { this.nameForm = form; }}
              value={this.state.value}
              onChange={() => this.onNameChange()}
              options={options}
            />
          </KeyboardAvoidingView>

          {this.state.nameChange ? (<TouchableHighlight style={styles.button} onPress={() => this.editName()} underlayColor="#FF781A">
            <Text style={styles.buttonText}>Update Name</Text>
          </TouchableHighlight>) : (<Text style={styles.updateText}>Name Up to Date</Text>)}

        </View>
      </Modal>

    );
  }

  closeModal(modal) {
    if (modal === 'Email') {
      this.setState({
        nameModalVisible: false,
        emailModalVisible: false,
        passwordModalVisible: false,
        emailChanged: false,
      });
    } else if (modal === 'Name') {
      this.setState({
        nameModalVisible: false,
        emailModalVisible: false,
        passwordModalVisible: false,
        nameChange: false,
      });
    } else {
      this.setState({
        nameModalVisible: false,
        emailModalVisible: false,
        passwordModalVisible: false,
        passwordChange: false,
      });
    }
  }
  showModal(item) {
    if (item.key === 'Email') {
      this.setState({
        nameModalVisible: false,
        emailModalVisible: true,
        passwordModalVisible: false,
      });
    } else if (item.key === 'Name') {
      this.setState({
        nameModalVisible: true,
        emailModalVisible: false,
        passwordModalVisible: false,
      });
    } else {
      this.setState({
        nameModalVisible: false,
        emailModalVisible: false,
        passwordModalVisible: true,
      });
    }
  }

  buildSettings() {
    const list = [];

    list.push({
      key: 'Email',
      value: this.state.value.email,
      modal: this.state.emailModalVisible,
    },
    {
      key: 'Name',
      value: (`${this.state.value.firstName} ${this.state.value.lastName}`),
      modal: this.state.nameModalVisible,
    },
    {
      key: 'Password',
      value: null,
      modal: this.state.passwordModalVisible,
    },
    );

    const renderMonthList = (
      <View style={styles.container2}>
        <FlatList
          data={list}
          scrollEnabled={false}
          renderItem={({ item }) =>

            (<TouchableHighlight style={styles.goalContainer} onPress={() => this.showModal(item)} underlayColor="#373737">
              <View style={styles.innerSettingsContainer}>
                <Text style={styles.headerText}>{item.key}</Text>
                <View style={styles.InfoIconContainer}>
                  <Text style={styles.userInfoText}>{item.value}</Text>
                  {item.modal ? (<Icon
                    name="chevron-up"
                    size={20}
                    color="#d1d1d1"
                  />) : (<Icon
                    name="chevron-down"
                    size={20}
                    color="#d1d1d1"
                  />)}
                </View>
              </View>
            </TouchableHighlight>)
          }
        />
      </View>

    );

    return renderMonthList;
  }

  render() {
    if (this.props.userInfo) {
      const list = this.buildSettings();

      const emailModal = this.emailFormModal();
      const passwordModal = this.passwordFormModal();
      const nameModal = this.nameFormModal();

      return (
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView style={styles.scroll}>
            {list}
            {emailModal}
            {passwordModal}
            {nameModal}
            <TouchableHighlight style={styles.signoutButton} underlayColor="#373737">
              <View style={styles.container2}>
                <Text style={styles.signoutText}> Sign Out</Text>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: 10,
    backgroundColor: '#181715',

  },
  containerModal: {
    flexDirection: 'column',
    marginTop: 22,
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(34,34,34, .93)',

  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
    flexGrow: 0,
    paddingBottom: 40,

  },
  InfoIconContainer: {
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    right: 10,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },

  buttonText: {
    fontSize: 20,
    color: '#181715',
    alignSelf: 'center',
  },
  updateText: {
    fontSize: 20,
    color: '#ff6600',
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#dddddd',
    marginRight: 5,
    fontWeight: '600',
  },
  userInfoText: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: '#dddddd',
    fontWeight: '300',
    right: 10,
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6600',
    marginTop: 20,
    marginBottom: 30,

    borderRadius: 50,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 40,
    paddingRight: 40,
  },
  signoutButton: {
    alignSelf: 'center',
    backgroundColor: '#222222',
    alignItems: 'center',
    borderColor: '#222222',
    borderWidth: 1,
    width: (Dimensions.get('window').width - 10),
    height: 50,
    top: 40,
  },
  signoutText: {
    fontSize: 24,
    color: '#ff6600',
    fontWeight: '300',
  },
  scroll: {
    flex: 1,
  },
  goalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#181715',
    backgroundColor: '#222222',
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 2,
    alignItems: 'center',
  },
  innerSettingsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#222222',
    paddingLeft: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  taskContainer: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
  },
  select_token: {
    right: 10,
  },
});

const mapDispatchToProps = state => (
  {
    userInfo: state.progress.userInfo,
  }
);

export default connect(mapDispatchToProps, { updatePropsUserInfo })(Settings);
