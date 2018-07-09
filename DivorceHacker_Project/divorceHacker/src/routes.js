
import About from './components/about';
import DivorceHacker from './components/divorceHacker';
import Dashboard from './components/dashboard';
import Register from './components/register';
import Settings from './components/settings';
import Monthly_Goals from './components/monthly_goals';
import Goal_Tasks from './components/goal_tasks';

// All potential screens must be added to the list of routes below

/* eslint-disable prefer-default-export */
const Routes = {
  Home: { screen: DivorceHacker },
  About: { screen: About },
  Register: { screen: Register },
  Dashboard: { screen: Dashboard },
  Settings: { screen: Settings },
  Monthly_Goals: { screen: Monthly_Goals },
  Goal_Tasks: { screen: Goal_Tasks },
};


export default Routes;
