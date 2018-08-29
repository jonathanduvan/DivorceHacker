import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
// import PinAuth from './pin_auth';
// import t from 'tcomb-form-native';
// import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import Accordion from 'react-native-collapsible/Accordion';
import Switch from 'react-native-material-switch';
import Markdown from 'react-native-markdown-renderer';
import * as Animatable from 'react-native-animatable';
import * as dh_backend from '../backend/dh_backend.json';
import { updatePropsProgress } from '../backend/firebasedb';

class Goal_Tasks extends Component {
  static navigationOptions =({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerTintColor: `${navigation.state.params.headerTintColor}`,
    gesturesEnabled: true,
    headerLeft:
  <Icon
    name="chevron-left"
    size={25}
    color={navigation.state.params.headerTintColor}
    style={{ left: 17 }}
    onPress={() => navigation.state.params.leaveGoalsPage()}
  />,
    headerRight: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      category: null,
      color: null,
      update: false,
      value: 1,
      month: 0,
      progress: {},
    };

    this.buildMonthlyGoals = this.buildMonthlyGoals.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this.activateTask = this.activateTask.bind(this);
    this.deactivateTask = this.deactivateTask.bind(this);
    this.leaveGoalsPage = this.leaveGoalsPage.bind(this);
    this.updateLocalProgress = this.updateLocalProgress.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      leaveGoalsPage: this.leaveGoalsPage,
    });

    this.setState({
      month: this.props.navigation.state.params.month,
      progress: this.props.progress,
    });
  }

  buildMonthlyGoals(category, goal_info) {
    const list = [];
    const month = goal_info.month.split(' ').join('_');
    if ({}.propertyIsEnumerable.call(dh_backend.Categories[category][month], goal_info.subcat)) {
      if (dh_backend.Categories[category][month][goal_info.subcat].title === goal_info.title) {
        const cat_details = dh_backend.Categories[category][month][goal_info.subcat];
        for (let i = 1; i <= cat_details.total_tasks; i += 1) {
          const current_task = (`task_${i}`);
          list.push({
            task_num: i,
            current_task,
            subcat: goal_info.subcat,
            title: cat_details[current_task].title,
            description: cat_details[current_task].description,
            month,
          });
        }
      }
    }
    return list;
  }

  // {this.buildMonthlyGoals(category)}
  getGoalStatus(section) {
    const category = this.props.currentCategory.category;
    if (this.props.progress[category][section.month][section.subcat][section.current_task]) {
      return (
        <Icon
          name="check"
          size={20}
          color="#d1d1d1"
        />
      );
    }

    return (
      null
    );
  }

  leaveGoalsPage() {
    this.updateLocalProgress();
    //
    // this.props.navigation.setParams({ title: this.props.navigation.state.params.title, headerTintColor: this.props.navigation.state.params.color, month });
    this.props.navigation.goBack();
  }

  updateLocalProgress() {
    /* eslint-disable*/
    if (this.state.update) {
      this.props.navigation.state.params.updateProgress(this.state.progress)
    }
    /* eslint-enable*/
  }

  activateTask(s, section) {
    if (s) {
      const { progress } = this.state;
      const category = this.props.currentCategory.category;
      const maxWidth = (Dimensions.get('window').width) - 34; // Max pixel width of graph bar

      const categoryMonthMax = maxWidth / 8;
      const totalMonthTasks = dh_backend.Categories[category][section.month].total_tasks;
      progress[category][section.month][section.subcat][section.current_task] = 1;
      progress[category][section.month][section.subcat].progress += 1;
      progress[category][section.month].progress += 1;

      const taskValue = (categoryMonthMax) / totalMonthTasks;
      progress[category].progress += taskValue;
      if (!this.state.update) {
        this.setState({
          progress,
          update: true,
        });
      } else {
        this.setState({
          progress,
        });
      }
    } else {
      this.deactivateTask(section);
    }
  }

  deactivateTask(section) {
    const { progress } = this.state;
    const category = this.props.currentCategory.category;
    const maxWidth = (Dimensions.get('window').width) - 30;
    const categoryMonthMax = maxWidth / 8;
    const totalTasks = dh_backend.Categories[category][section.month].total_tasks;
    progress[category][section.month][section.subcat][section.current_task] = 0;
    progress[category][section.month][section.subcat].progress -= 1;
    progress[category][section.month].progress -= 1;
    const taskValue = (categoryMonthMax) / totalTasks;
    progress[category].progress -= taskValue;
    if (!this.state.update) {
      this.setState({
        progress,
        update: true,
      });
    } else {
      this.setState({
        progress,
      });
    }
  }

  _renderHeader(section, index, isActive) {
    const category = this.props.currentCategory.category;

    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{
          borderColor: (isActive ? this.props.currentCategory.color : '#f3f9f9'),
          backgroundColor: '#cccccc',
          padding: 15,
          flex: 1,
          borderWidth: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.goalContainer}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={styles.buttonText}>{section.task_num}</Text>
            {this.props.progress[category][section.month][section.subcat][section.current_task] ? (
              <Icon
                name="check"
                size={20}
                color={this.props.currentCategory.color}
              />
            ) : null}
          </View>
          {isActive ? (<Icon
            name="chevron-up"
            size={20}
            color="#181715"
          />) : (<Icon
            name="chevron-down"
            size={20}
            color="#181715"
          />)}
        </View>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive) {
    const category = this.props.currentCategory.category;
    let description = '';
    let title = '';
    if (section.description !== null) {
      description = section.description;
    }
    if (section.title !== null) {
      title = section.title;
    }
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
      >
        <Animatable.View
          duration={300}
          easing="ease-out"
          style={styles.taskContainer} // Make a Month Container
          // animation={isActive ? 'zoomIn' : false}
        >
          <Text style={styles.goalText}>{title}</Text>
          <Markdown style={styles}>{description}</Markdown>
          <View style={styles.container2}>
            <Switch
              active={Boolean(this.state.progress[category][section.month][section.subcat][section.current_task])}
              onChangeState={(s => this.activateTask(s, section))}
              inactiveButtonColor="#E1DCD9"
              activeButtonColor={this.props.currentCategory.color}
              activeBackgroundColor={this.props.currentCategory.color}
              activeButtonPressedColor={this.props.currentCategory.color}
            />
          </View>
        </Animatable.View>
      </Animatable.View>
    );
  }
  render() {
    const color = this.props.currentCategory.color;

    if (this.props.currentGoal && this.props.currentCategory.category) {
      const list = this.buildMonthlyGoals(this.props.currentCategory.category, this.props.currentGoal);
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scroll}>
            <Text style={styles.headerText}>{this.props.currentGoal.title}</Text>
            <Accordion
              sections={list}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
            />
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.headerText}>{this.props.currentGoal.title}</Text>
        </ScrollView>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  goalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  taskContainer: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',

  },
  monthContainer: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    backgroundColor: '#B9B9B9',
    height: 150,
  },
  monthsList: {
    flex: 1,
    width: 100,
    alignSelf: 'center',
  },
  header: {
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    marginBottom: 40,
    color: '#181715',
    fontWeight: '200',
  },
  goalText: {
    fontSize: 20,
    marginBottom: 10,
    color: '#181715',
    fontWeight: 'bold',
    width: Dimensions.get('window').width * 0.8,
  },
  text: {
    color: '#181715',
    fontSize: 18,
  },
  monthBox: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#222222',
    borderWidth: 5,
    height: 200,
    width: 80,
  },

  buttonText: {
    fontSize: 16,
    color: '#181715',
    marginRight: 5,
    fontWeight: '100',
  },
  scroll: {
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
});

const mapDispatchToProps = state => (
  {
    progress: state.progress.all,
    currentCategory: state.progress.currentCategory.category,
    currentGoal: state.progress.currentGoal,
  }
);

export default connect(mapDispatchToProps, { updatePropsProgress })(Goal_Tasks);
