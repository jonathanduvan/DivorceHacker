import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Image,
  TouchableHighlight,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Settings from './settings';
// import storage from 'react-native-simple-store';
import * as Progress from 'react-native-progress';
import TimerMixin from 'react-timer-mixin';
// import Overlay from 'react-native-overlay';
import { fetchGoals } from '../backend/firebasedb';
// import * as dh_backend from '../backend/dh_backend.json';


function getTimestep(daysPassed) {
  const currMonth = (Math.ceil(daysPassed / 30));

  const maxTime = (Dimensions.get('window').width - (Dimensions.get('window').width / 8.2)); // Max pixel width of graph bar

  const month1 = maxTime / 9.5;
  const month2 = maxTime / 4.33;
  const month3 = maxTime / 2.77;
  const month4 = maxTime / 2.04;
  const month5 = maxTime / 1.625;
  const month6 = maxTime / 1.34;
  const month7 = maxTime / 1.15;

  const monthPositions = [-1, month1, month2, month3, month4, month5, month6, month7, maxTime];

  if (currMonth >= 8) {
    return maxTime;
  }

  const monthDifference = monthPositions[currMonth] - monthPositions[currMonth - 1];

  const dayInterval = monthDifference / 30;

  const timelinePosition = monthPositions[currMonth - 1] + (dayInterval * (daysPassed - (30 * (currMonth - 1))));

  return timelinePosition;
}

class Dashboard extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Dashboard',
    headerRight:
  <Icon
    name="cog"
    size={35}
    color="#577D7E"
    style={{ right: 17 }}
    onPress={() => navigation.navigate('Settings')}
  />,
    headerLeft: null,
    gesturesEnabled: false,
  });
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      indeterminate: true,
      mixins: [TimerMixin],
      timestep: 48,
      hasChildren: null,
      legal_prog: 3,
      financial_prog: 3,
      wellbeing_prog: 3,
      work_prog: 3,
      home_prog: 3,
      children_prog: 5,
    };


    this.renderCategories = this.renderCategories.bind(this);
    this._onCategoryPress = this._onCategoryPress.bind(this);
    this.buildGraphData = this.buildGraphData.bind(this);
    this.buildGraphTimeline = this.buildGraphTimeline.bind(this);
    this.renderGraph = this.renderGraph.bind(this);
    this.renderTimeBar = this.renderTimeBar.bind(this);
    this.renderTimeBarEnd = this.renderTimeBarEnd.bind(this);

    this.categoryUpdateCheck = this.categoryUpdateCheck.bind(this);
  }
  //
  // componentDidMount() {
  //   this.animate();
  //   if ((Object.keys(this.props.progress).length !== 0) && (Object.keys(this.props.userInfo).length !== 0)) {
  //     this.buildGraphData(this.props.progress);
  //     this.buildGraphTimeline(this.props.userInfo);
  //   }
  // }

  componentWillMount() {
    if ((Object.keys(this.props.progress).length !== 0) && (Object.keys(this.props.userInfo).length !== 0)) {
      this.buildGraphData(this.props.progress);
      this.buildGraphTimeline(this.props.userInfo);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.progress).length !== 0) {
      if (this.categoryUpdateCheck(nextProps.progress)) {
        this.buildGraphData(nextProps.progress);
      }
    }

    this.buildGraphTimeline(nextProps.userInfo);
  }


  // componentWillUpdate(nextProps) {
  //   console.log(this.props.progress, nextProps.progress);
  //   if (this.categoryUpdateCheck(nextProps.progress)) {
  //     this.buildGraphData(nextProps.progress);
  //   }
  // }

  categoryUpdateCheck(newProgress) {
    if (Object.keys(this.props.progress).length === 0) {
      return true;
    }
    let indicators = [];
    let check = false;
    if (newProgress.hasChildren) {
      indicators = ['Legal', 'Financial', 'Wellbeing', 'Work', 'Home', 'Children'];
    } else {
      indicators = ['Legal', 'Financial', 'Wellbeing', 'Work', 'Home'];
    }
    for (let i = 0, len = indicators.length; i < len; i += 1) {
      if (this.props.progress[indicators[i]].progress !== newProgress[indicators[i]].progress) {
        check = true;
        break;
      }
    }

    return check;
  }

  /*
  Animation for circle loading
  */
  animate() {
    let progress = 0;
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({ progress });
      }, 500);
    }, 1500);
  }

  /*
  Convert numerical progress to appropriate distance on bar graph based on phone screen size
  */
  buildGraphData(data) {
    let indicators = [];
    if (data.hasChildren) {
      indicators = ['Legal', 'Financial', 'Wellbeing', 'Work', 'Home', 'Children'];
    } else {
      indicators = ['Legal', 'Financial', 'Wellbeing', 'Work', 'Home'];
    }

    const width = {};
    // let widthCap; // Give with a max cap
    indicators.forEach((item) => {
      width[item] = data[item].progress < 3 ? 3 : data[item].progress;
    });
    // Set state with graph values
    if (!(data.hasChildren)) {
      this.setState({
        legal_prog: new Animated.Value(width.Legal),
        financial_prog: new Animated.Value(width.Financial),
        wellbeing_prog: new Animated.Value(width.Wellbeing),
        work_prog: new Animated.Value(width.Work),
        home_prog: new Animated.Value(width.Home),
        hasChildren: false,
      });
    } else {
      this.setState({
        legal_prog: new Animated.Value(width.Legal),
        financial_prog: new Animated.Value(width.Financial),
        wellbeing_prog: new Animated.Value(width.Wellbeing),
        work_prog: new Animated.Value(width.Work),
        home_prog: new Animated.Value(width.Home),
        children_prog: new Animated.Value(width.Children),
        hasChildren: true,
      });
    }
  }

  /*
  Convert startime into graphical representation of time passed for setting the time bar
  */

  buildGraphTimeline(userInfo) {
    const startTime = userInfo.startTime;
    const currTime = new Date().getTime();
    const _MS_PER_DAY = 1000 * 3600 * 24;

    const timeDifference = Math.abs(currTime - startTime);
    const daysPassed = Math.floor((timeDifference) / _MS_PER_DAY);


    const timestep = getTimestep(daysPassed);

    this.setState({
      timestep,
    });
  }

  /*
  Move to Category Monthly Goals screen
  */
  _onCategoryPress(cat, color) {
    const cat_setup = {
      category: cat,
      color,
    };
    this.props.fetchGoals(cat_setup);

    this.props.navigation.navigate('Monthly_Goals', { title: cat, headerTintColor: color, month: 1, buildGraphData: this.buildGraphData });
  }

  /* eslint-disable global-require */

  /*
  Render category buttons found above the graph
  */
  renderCategories(progress) {
    if (progress !== null) {
      if (progress.hasChildren === true) {
        return (
          <View style={{ flex: 1 }}>
            <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Legal', '#A20021')} underlayColor="#a5a5a5">
              <View style={styles.container2}>
                <Image source={require('../../photos/Legal.png')} style={styles.logo} />
                <Text style={styles.legalText}>Legal</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#A20021"
                  style={{ right: 5 }}
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Financial', '#369362')} underlayColor="#a5a5a5">
              <View style={styles.container2}>
                <Image source={require('../../photos/Financial.png')} style={styles.logo} />
                <Text style={styles.financialText}>Financial</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#369362"
                  style={{ right: 5 }}
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Children', '#906C77')} underlayColor="#a5a5a5">
              <View style={styles.container2}>
                <Image source={require('../../photos/Children.png')} style={styles.logo} />
                <Text style={styles.childrenText}>Children</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#906C77"
                  style={{ right: 5 }}
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Work', '#CE7100')} underlayColor="#a5a5a5">
              <View style={styles.container2}>
                <Image source={require('../../photos/Work.png')} style={styles.logo} />
                <Text style={styles.workText}>Work</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#CE7100"
                  style={{ right: 5 }}
                />
              </View>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Home', '#536FFF')} underlayColor="#a5a5a5">
              <View style={styles.container2}>
                <Image source={require('../../photos/Home.png')} style={styles.logo} />
                <Text style={styles.homeText}>Home</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#536FFF"
                  style={{ right: 5 }}
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Wellbeing', '#41337A')} underlayColor="#373737">
              <View style={styles.container2}>
                <Image source={require('../../photos/Wellbeing.png')} style={styles.logo} />
                <Text style={styles.wellbeingText}>Wellbeing</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#41337A"
                  style={{ right: 5 }}
                />
              </View>
            </TouchableHighlight>
          </View>
        );
      }
    }
    return (
      <View style={{ flex: 1 }}>
        <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Legal', '#E45F56')} underlayColor="#a5a5a5">
          <View style={styles.container2}>
            <Image source={require('../../photos/Legal.png')} style={styles.logo} />
            <Text style={styles.legalText}>Legal</Text>
            <Icon
              name="chevron-right"
              size={20}
              color="#E45F56"
              style={{ right: 5 }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Financial', '#26A96C')} underlayColor="#a5a5a5">
          <View style={styles.container2}>
            <Image source={require('../../photos/Financial.png')} style={styles.logo} />
            <Text style={styles.financialText}>Financial</Text>
            <Icon
              name="chevron-right"
              size={20}
              color="#26A96C"
              style={{ right: 5 }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Work', '#CE7100')} underlayColor="#a5a5a5">
          <View style={styles.container2}>
            <Image source={require('../../photos/Work.png')} style={styles.logo} />
            <Text style={styles.workText}>Work</Text>
            <Icon
              name="chevron-right"
              size={20}
              color="#CE7100"
              style={{ right: 5 }}
            />
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Home', '#536FFF')} underlayColor="#a5a5a5">
          <View style={styles.container2}>
            <Image source={require('../../photos/Home.png')} style={styles.logo} />
            <Text style={styles.homeText}>Home</Text>
            <Icon
              name="chevron-right"
              size={20}
              color="#536FFF"
              style={{ right: 5 }}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => this._onCategoryPress('Wellbeing', '#41337A')} underlayColor="#a5a5a5">
          <View style={styles.container2}>
            <Image source={require('../../photos/Wellbeing.png')} style={styles.logo} />
            <Text style={styles.wellbeingText}>Wellbeing</Text>
            <Icon
              name="chevron-right"
              size={20}
              color="#41337A"
              style={{ right: 5 }}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  /*
  Render graph displaying progress for categories. Does not include rendering time bar.
  */
  renderGraph(progress) {
    const { legal_prog,
      financial_prog,
      wellbeing_prog,
      work_prog,
      home_prog } = this.state;
    if (progress.hasChildren) {
      const { children_prog } = this.state;

      return (
        <View>
          <View style={styles.item}>
            <View style={styles.data}>
              {
                legal_prog &&
                <Animated.View style={[styles.bar, styles.legalBar,
                  { width: legal_prog }]}
                />
              }
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.data}>
              {
                financial_prog &&
                <Animated.View style={[styles.bar, styles.financialBar,
                  { width: financial_prog }]}
                />
              }
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.data}>
              {
                children_prog &&
                <Animated.View style={[styles.bar, styles.childrenBar,
                  { width: children_prog }]}
                />
              }
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.data}>
              {
                work_prog &&
                <Animated.View style={[styles.bar, styles.workBar,
                  { width: work_prog }]}
                />
              }
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.data}>
              {
                home_prog &&
                <Animated.View style={[styles.bar, styles.homeBar,
                  { width: home_prog }]}
                />
              }
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.data}>
              { wellbeing_prog &&
                <Animated.View style={[styles.bar, styles.wellbeingBar,
                  { width: wellbeing_prog }]}
                />
              }
            </View>
          </View>
        </View>
      );
    }

    // User has children setting turned off
    return (
      <View>
        <View style={styles.item}>
          <View style={styles.data}>
            {
              legal_prog &&
                <Animated.View style={[styles.bar, styles.legalBar,
                  { width: legal_prog }]}
                />
            }
          </View>
        </View>
        <View style={styles.item}>
          <View style={styles.data}>
            {
              financial_prog &&
                <Animated.View style={[styles.bar, styles.financialBar,
                  { width: financial_prog }]}
                />
            }
          </View>
        </View>
        <View style={styles.item}>
          <View style={styles.data}>
            {
              work_prog &&
                <Animated.View style={[styles.bar, styles.workBar,
                  { width: work_prog }]}
                />
            }
          </View>
        </View>
        <View style={styles.item}>
          <View style={styles.data}>
            {
              home_prog &&
                <Animated.View style={[styles.bar, styles.homeBar,
                  { width: home_prog }]}
                />
            }
          </View>
        </View>
        <View style={styles.item}>
          <View style={styles.data}>
            {
              wellbeing_prog &&
                <Animated.View style={[styles.bar, styles.wellbeingBar,
                  { width: wellbeing_prog }]}
                />
            }
          </View>
        </View>
      </View>
    );
  }


  renderTimeBar(progress) {
    if (progress.hasChildren) {
      return (
        <View style={[styles.timecontainer, { left: this.state.timestep }]}>
          <Image source={require('../../photos/timeline_light_blue.png')} style={styles.timeline} />
        </View>
      );
    }
    return (
      <View style={[styles.timecontainerNoChildren, { left: this.state.timestep }]}>
        <Image source={require('../../photos/timeline_light_blue.png')} style={styles.timeline} />
      </View>
    );
  }

  renderTimeBarEnd(progress) {
    if (progress.hasChildren) {
      return (
        <View style={styles.timeEnd}>
          <Image source={require('../../photos/timeline.png')} style={styles.timeline} />
        </View>
      );
    }
    return (
      <View style={styles.timeEndNoChildren}>
        <Image source={require('../../photos/timeline.png')} style={styles.timeline} />
      </View>
    );
  }
  /*
  Calls renderCategories, renderGraph, and sets up time bar. If progress hasn't been fetched, then render circle loading animation

  NOTE: may need to have a timeout thing where if it takes so long trying to get user progress, display an error message.

  Will we need to adjust time bar space for different phone screen sizes?

  */
  render() {
    if (this.props.progress !== null && this.props.userInfo) {
      return (
        <View style={styles.container}>
          {this.renderCategories(this.props.progress)}
          <View style={styles.container4}>
            {this.renderGraph(this.props.progress)}
            <TouchableHighlight style={styles.timebox} underlayColor="#181715">
              <Text style={styles.time}>0 . . . 1M . . . 2M . . . 3M . . . 4M . . . 5M . . . 6M . . . 7M . . . 8M</Text>
            </TouchableHighlight>
          </View>
          {this.renderTimeBar(this.props.progress)}
          {this.renderTimeBarEnd(this.props.progress)}

        </View>
      );
    }

    // Progress has not been fetched yet
    return (
      <View style={styles.container}>
        {this.renderCategories(this.props.progress)}
        <View style={styles.circles}>
          <Progress.CircleSnail
            style={styles.progress}
            color={[
              '#ff8533',
            ]}
            size={100}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f9f9',
    flexDirection: 'column',
  },
  time: {
    fontSize: 12,
    color: '#181715',
    fontWeight: '500',
    alignSelf: 'center',
  },
  graphContainer: {
    borderColor: '#181715',
  },
  timeline: {
    height: 245,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  timelineNoChildren: {
    height: 255,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  timecontainer: {
    flex: 1,
    top: Dimensions.get('window').height - 356,
    position: 'absolute',
    zIndex: 2,
  },
  timecontainerNoChildren: {
    flex: 1,
    top: Dimensions.get('window').height - 376,
    position: 'absolute',
    zIndex: 3,
  },
  timeEnd: {
    flex: 1,
    top: Dimensions.get('window').height - 356,
    position: 'absolute',
    zIndex: 2,
    left: (Dimensions.get('window').width - (Dimensions.get('window').width / 8.2)),
  },
  timeEndNoChildren: {
    flex: 1,
    top: Dimensions.get('window').height - 376,
    position: 'absolute',
    zIndex: 2,
    left: (Dimensions.get('window').width - (Dimensions.get('window').width / 8.2)),
  },
  timebox: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderTopColor: '#181715',
    borderTopWidth: 0.5,
    width: 350,
    left: 10,
    top: 5,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container4: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderColor: '#181715',
    right: 10,
  },
  circles: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  progress: {
    margin: 10,
  },
  chart: {
    width: 20,
    height: 200,
    alignSelf: 'center',
    borderColor: 'red',
    left: -50,
  },
  graphs: {
    flex: 1,
    width: 340,
    height: 150,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#181715',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#cccccc',
    borderBottomColor: '#f3f9f9',
    borderTopColor: '#f3f9f9',
    borderColor: '#f3f9f9',
    borderWidth: 0.5,
    width: (Dimensions.get('window').width - 10),
    height: 50,
  },
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 22,
    left: 6,
  },
  item: {
    flexDirection: 'column',
    marginBottom: 40,
    marginLeft: 7,
    top: 15,
    paddingHorizontal: 10,
  },
  data: {
    flex: 2,
    flexDirection: 'row',
  },
  dataNumber: {
    color: '#577D7E',
    fontSize: 12,
    left: 10,
    fontWeight: '500',
    alignSelf: 'center',
    zIndex: 5,
    backgroundColor: 'transparent',
  },
  legalText: {
    fontSize: 24,
    color: '#A20021',
    fontWeight: '300',
    right: 105,
  },
  legalBar: {
    backgroundColor: '#A20021',
  },
  financialText: {
    fontSize: 24,
    color: '#369362',
    fontWeight: '300',
    right: 90,

  },
  financialBar: {
    backgroundColor: '#3EAA70',
  },
  wellbeingText: {
    fontSize: 24,
    color: '#41337A',
    fontWeight: '300',
    right: 85,
  },
  wellbeingBar: {
    backgroundColor: '#4C407A',
  },
  logo: {
    width: 39,
    height: 39,
    marginLeft: 18,
    resizeMode: 'contain',
  },
  workText: {
    fontSize: 24,
    color: '#CE7100',
    fontWeight: '300',
    right: 107,

  },
  workBar: {
    backgroundColor: '#CE7100',
  },
  homeText: {
    fontSize: 24,
    color: '#536FFF',
    fontWeight: '300',
    right: 102,

  },
  homeBar: {
    backgroundColor: '#536FFF',
  },
  childrenText: {
    fontSize: 24,
    color: '#906C77',
    fontWeight: '300',
    right: 92,

  },
  childrenBar: {
    backgroundColor: '#9E7682',
  },
  text: {
    fontSize: 12,
    color: '#577D7E',
    marginLeft: -80,
    marginTop: 10,
  },
});

const mapDispatchToProps = state => (
  {
    progress: state.progress.all,
    userInfo: state.progress.userInfo,
  }
);

export default connect(mapDispatchToProps, { fetchGoals })(Dashboard);
