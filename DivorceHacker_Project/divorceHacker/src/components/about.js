import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
// import PinAuth from './pin_auth';
// import t from 'tcomb-form-native';
// import _ from 'lodash';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Markdown from 'react-native-markdown-renderer';
// import * as Animatable from 'react-native-animatable';

class About extends Component {
  static navigationOptions =({ navigation }) => ({
    headerLeft: null,
    headerRight: null,
  });

  constructor(props) {
    super(props);
    this.state = {};

    this.onPress = this.onPress.bind(this);
  }

  componentWillMount() {
  }

  onPress() {
    this.props.navigation.navigate('Dashboard');
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.headerText}>Welcome to The DivorceHacker</Text>
          <Text style={styles.bodyText}>Congratulations on making the choice to take back your power. Using a checklist approach to simplify what you need to do and when to do it, The Divorce Hacker</Text>

        </ScrollView>

        <TouchableHighlight style={styles.button} underlayColor="#FF781A" onPress={this.onPress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
    backgroundColor: '#181715',
  },

  goalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 40,
    marginBottom: 40,
    color: '#d1d1d1',
    fontWeight: '200',
  },
  bodyText: {
    color: '#d1d1d1',
    fontSize: 16,
  },
  buttonText: {
    fontSize: 22,
    color: '#181715',
    alignSelf: 'center',
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
  scroll: {
    flex: 1,

  },

});


export default connect(null, { })(About);
