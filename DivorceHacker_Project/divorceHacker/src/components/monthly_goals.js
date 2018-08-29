import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  FlatList,
} from 'react-native';
// import PinAuth from './pin_auth';
// import t from 'tcomb-form-native';
// import _ from 'lodash';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as dh_backend from '../backend/dh_backend.json';
import { fetchTasks, updateBackendProgress } from '../backend/firebasedb';

/* eslint-disable global-require */
const allIcons = {
  Legal: require('../../photos/Legal.png'),
  Financial: require('../../photos/Financial.png'),
  Children: require('../../photos/Children.png'),
  Wellbeing: require('../../photos/Wellbeing.png'),
  Home: require('../../photos/Home.png'),
  Work: require('../../photos/Work.png'),
};
class Monthly_Goals extends Component {
  static navigationOptions =({ navigation }) => ({
    headerTitle: <Image source={allIcons[`${navigation.state.params.title}`]} style={styles.logo} />,
    headerTintColor: `${navigation.state.params.headerTintColor}`,
    headerLeft:
  <Icon
    name="chevron-left"
    size={25}
    color={navigation.state.params.headerTintColor}
    style={{ left: 17 }}
    onPress={() => navigation.goBack()}
  />,
    headerRight: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      color: null,
      value: 1,
    };
    this.buildMonthlyGoals = this.buildMonthlyGoals.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.categoryUpdateCheck = this.categoryUpdateCheck.bind(this);
    this.updateLocalProgress = this.updateLocalProgress.bind(this);
  }


  componentWillMount() {
    this.props.navigation.setParams({
      title: this.props.navigation.state.params.title,
      headerTintColor: this.props.navigation.state.params.headerTintColor,
      month: this.props.navigation.state.params.month,
    });

    this.setState({
      value: this.props.navigation.state.params.month,
      progress: this.props.progress,
    });
  }


  componentWillReceiveProps(nextProps) {
    if (this.categoryUpdateCheck(nextProps.progress)) {
      this.setState({
        progress: nextProps.progress,
      });
    }
  }


  categoryUpdateCheck(newProgress) {
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

  leaveCategoryPage() {
    this.props.updateBackendProgress(this.props.progress);
  }

  _onGoalPress(item) {
    const month = this.state.value;
    this.props.fetchTasks(item);
    this.props.navigation.navigate('Goal_Tasks', { title: this.props.navigation.state.params.title,
      headerTintColor: this.props.navigation.state.params.headerTintColor,
      month,
      updateProgress: this.updateLocalProgress });
  }

  getStatus(category, month, color) {
    const monthText = `month_${month}`;
    const totalTasks = dh_backend.Categories[category][monthText].total_tasks;
    let userTasks = 0;

    Object.keys(this.props.progress[category][monthText]).forEach((subcat) => {
      if (this.props.progress[category][monthText][subcat] !== undefined) {
        Object.keys(this.props.progress[category][monthText][subcat]).forEach((task) => {
          if (this.props.progress[category][monthText][subcat][task] !== undefined && (task !== 'progress')) {
            userTasks += this.props.progress[category][monthText][subcat][task];
          }
        });
      }
    });
    if (userTasks === totalTasks) {
      return (
        <Text style={styles.monthText}>Status: <Text style={{ color,
          fontSize: 24,
          fontWeight: '300' }}
        >Complete</Text></Text>
      );
    }
    return (
      <Text style={styles.monthText}>Status: Incomplete</Text>

    );
  }

  getSubcatStatus(category, monthText, subcat) {
    let userTasks = 0;
    let totalTasks = 0;
    if (this.state.progress[category][monthText][subcat] !== undefined) {
      Object.keys(this.state.progress[category][monthText][subcat]).forEach((task) => {
        totalTasks += 1;
        if (this.state.progress[category][monthText][subcat][task] !== undefined) {
          userTasks += this.state.progress[category][monthText][subcat][task];
        }
      });
    }
    if (userTasks === totalTasks) {
      return true;
    }

    return false;
  }

  updateLocalProgress(progress) {
    this.props.updateBackendProgress(this.props.userInfo.userID, progress);
    this.props.navigation.state.params.buildGraphData(progress);
    this.setState({
      progress,
    });
  }

  buildMonthlyGoals(category) {
    const list = [];
    const cat_details = dh_backend.Categories[category];
    Object.keys(cat_details).forEach((month) => {
      const curr_month = cat_details[month];
      const month_list = [];
      Object.keys(curr_month).forEach((subcat) => {
        const subCatStatus = this.getSubcatStatus(category, month, subcat);
        if (typeof curr_month[subcat] === 'object') {
          const section_title = curr_month[subcat].title;
          month_list.push({
            subcat,
            key: section_title,
            month: curr_month.title,
            status: subCatStatus,
          });
        }
      });
      const render_month_list = (
        <View style={styles.container2}>
          <FlatList
            data={month_list}
            scrollEnabled={false}
            renderItem={({ item }) =>

              (<TouchableHighlight style={styles.listText} underlayColor="#373737" onPress={() => this._onGoalPress(item)}>
                <View style={styles.goalContainer}>
                  {
                    // item.status ? (
                    //   <Icon
                    //     name="check"
                    //     size={20}
                    //     color={this.props.currentCategory.color}
                    //   />
                    // ) : null
                  }
                  <Text style={styles.buttonText}>{item.key}</Text>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color="#181715"
                    style={{ right: 10 }}
                  />
                </View>
              </TouchableHighlight>)
            }
          />
        </View>

      );
      list.push(render_month_list);
    });


    return list;
  }

  render() {
    // const { progress } = this.props;
    const color = this.props.currentCategory.color;
    const list = this.buildMonthlyGoals(this.props.currentCategory.category);
    return (
      <View style={styles.container}>
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>Month:
            <Text style={{ color, fontSize: 28, fontWeight: '300' }}>
              {''} {this.state.value}
            </Text>
          </Text>
          <Slider
            value={this.state.value}
            step={1}
            maximumValue={8}
            minimumValue={1}
            minimumTrackTintColor={color}
            maximumTrackTinyColor={'#F6F8FA'}
            thumbTintColor={color}
            onValueChange={value => this.setState({ value })}
          />
          {this.getStatus(this.props.currentCategory.category, this.state.value, color)}
        </View>
        {list[(this.state.value) - 1]}
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
  container2: {
    paddingTop: 20,
  },
  goalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthContainer: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    height: 150,
  },
  monthsList: {
    flex: 1,
    width: 100,
    alignSelf: 'center',
  },
  header: {
    borderBottomColor: '#f3f9f9',
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  monthBox: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#f3f9f9',
    borderWidth: 5,
    height: 200,
    width: 80,
  },
  monthText: {
    fontSize: 24,
    color: '#181715',
    fontWeight: '200',
  },
  listText: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#cccccc',
    borderBottomColor: '#f3f9f9',
    borderTopColor: '#f3f9f9',
    borderColor: '#f3f9f9',
    borderWidth: 2,
    width: (Dimensions.get('window').width - 10),
    height: 70,
  },
  buttonText: {
    fontSize: 18,
    color: '#181715',
    fontWeight: '300',
    left: 15,
    width: Dimensions.get('window').width * 0.8,
  },
  logo: {
    width: 49,
    height: 49,
    resizeMode: 'contain',
  },
});

const mapDispatchToProps = state => (
  {
    progress: state.progress.all,
    userInfo: state.progress.userInfo,
    currentCategory: state.progress.currentCategory.category,
  }
);

export default connect(mapDispatchToProps, { fetchTasks, updateBackendProgress })(Monthly_Goals);
