import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Animated,
  Text,
  Dimensions,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
} from 'react-native';
// import PinAuth from './pin_auth';
// import t from 'tcomb-form-native';
// import _ from 'lodash';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Markdown from 'react-native-markdown-renderer';
// import * as Animatable from 'react-native-animatable';

const deviceWidth = Dimensions.get('window').width;
const FIXED_BAR_WIDTH = 285;
const BAR_SPACE = 10;

class About extends Component {
  static navigationOptions =() => ({
    headerLeft: null,
    headerRight: null,
    cardStack: {
      gesturesEnabled: false,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      itemWidth: (FIXED_BAR_WIDTH / 3) - ((3 - 1) * BAR_SPACE),
      animVal: new Animated.Value(0),

    };

    this.onPress = this.onPress.bind(this);
  }

  componentWillMount() {
  }

  onPress() {
    this.props.navigation.navigate('Dashboard');
  }

  render() {
    const barArray = [];
    const aboutArray = [(
      <ScrollView>
        <View
          style={styles.textAndIcons}
          key={'about0'}
        >
          <Text style={styles.bodyText}><Text style={styles.italicizedText}>The Divorce {"Hacker's"} Guide</Text> outlines each step in the legal process from the decision to file through the final judgement. It addresses all the things you must consider in six key areas, and breaks them down into manageable tasks so that nothing falls through the cracks. {'\n\n'}
          Look for these icons throughout in the book and in the app:
          </Text>
          <Image source={require('../../photos/dh_icons_all.png')} style={styles.dhIcons} />
        </View>
      </ScrollView>
    ),
      (
        <View
          style={styles.textAndIcons}
          key={'about1'}
        >
          <Text style={styles.bodyText}>Your progress for each category will be displayed on a graph and tracked against the vertical time bar to help motivate you to complete your tasks in eight months or less.
          </Text>
          <Image source={require('../../photos/DHGraph.png')} style={styles.dhGraph} />
        </View>
      ),
      (
        <View
          style={styles.startButtonView}
          key={'about2'}
        >
          <TouchableHighlight style={styles.button} underlayColor="#577D7E" onPress={this.onPress}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableHighlight>
        </View>
      )];
    aboutArray.forEach((info, i) => {
      let scrollBarVal = this.state.animVal.interpolate({
        inputRange: [deviceWidth * (i - 0.95), deviceWidth * (i + 0.95)],
        outputRange: [-this.state.itemWidth, (this.state.itemWidth)],
        extrapolate: 'clamp',
      });

      if (i === 1) {
        scrollBarVal = this.state.animVal.interpolate({
          inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 0.99)],
          outputRange: [-this.state.itemWidth - 1.1, (this.state.itemWidth + 9)],
          extrapolate: 'clamp',
        });
      } else if (i === 2) {
        scrollBarVal = this.state.animVal.interpolate({
          inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
          outputRange: [-this.state.itemWidth, (this.state.itemWidth + 18)],
          extrapolate: 'clamp',
        });
      }

      /* eslint-disable*/

      const thisBar = (
        <View
          key={`bar${i}`}
          style={[
            styles.track,
            {
              width: this.state.itemWidth,
              marginLeft: i === 0 ? 0 : BAR_SPACE,
            },
          ]}
        >
          <Animated.View

            style={[
              styles.bar,
              {
                width: this.state.itemWidth,
                transform: [
                  { translateX: scrollBarVal },
                ],
              },
            ]}
          />
        </View>
      );
      /*eslint-enable*/

      barArray.push(thisBar);
    });
    return (
      <View
        style={styles.container}
        flex={1}
      >
        <Text style={styles.headerText}>       Welcome to{'\n'}The Divorce Hacker</Text>

        <ScrollView
          style={styles.scroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.state.animVal } } }],
            )
          }
        >
          {aboutArray}
        </ScrollView>
        <View
          style={styles.barContainer}
        >
          {barArray}
        </View>
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

    backgroundColor: '#f3f9f9',
  },

  goalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 140,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  track: {
    backgroundColor: '#ccc',
    overflow: 'hidden',
    height: 2,
  },
  bar: {
    backgroundColor: '#577D7E',
    height: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  headerText: {
    fontSize: 40,
    marginBottom: 40,
    alignSelf: 'center',
    color: '#181715',
    fontWeight: '200',
  },
  textAndIcons: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 5,
    paddingLeft: 5,
    flexGrow: 0,
    justifyContent: 'flex-start',
    width: deviceWidth - 20,
  },
  startButtonView: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 5,
    paddingLeft: 5,
    flexGrow: 0,
    justifyContent: 'center',
    width: deviceWidth - 20,
  },
  bodyText: {
    color: '#181715',
    marginTop: 20,
    fontSize: 20,
  },
  buttonText: {
    fontSize: 22,
    color: '#181715',
    alignSelf: 'center',
  },
  dhIcons: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -250,
    marginBottom: -200,
    width: (deviceWidth - 70),
  },
  dhGraph: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: (deviceWidth - 50),
    marginTop: -80,
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#C2E5E6',
    borderColor: '#577D7E',
    borderWidth: 3.5,
    marginTop: 20,
    marginBottom: 30,

    borderRadius: 50,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 40,
    paddingRight: 40,
  },
  italicizedText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },

});


export default connect(null, { })(About);
