import * as firebase from 'firebase';


// keys for actiontypes
export const ActionTypes = {
  FETCH_PROGRESS: 'FETCH_PROGRESS',
  FETCH_USER_INFO: 'FETCH_USER_INFO',
  FETCH_CATEGORY: 'FETCH_CATEGORY',
  FETCH_TASKS: 'FETCH_TASKS',
  FETCH_USER: 'FETCH_USER',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
};

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyASpN5xKDzPLxSiRViKWbaf9mYb-OP9Cs0',
  authDomain: 'divorcehacker.firebaseapp.com',
  databaseURL: 'https://divorcehacker.firebaseio.com',
  projectId: 'divorcehacker',
  storageBucket: 'divorcehacker.appspot.com',
  messagingSenderId: '23323103582',
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();
const auth = firebase.auth();


export async function signIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

export function signOut() {
  return auth.signOut();
}

export function signUp(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

/*
Function to update database with new user based on basic information.
Allocates space in database with beginning numbers for total progress and for month 1.
*/
export function addUser(userID, firstName, lastName, Email, hasChildren) {
  const startDate = new Date();
  const timestamp = startDate.getTime();
  const user = {
    first_name: firstName,
    last_name: lastName,
    has_children: hasChildren,
    start_time: timestamp,
    Financial: {
      progress: 0,
      month_1: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
        },
        subcat_2: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
          task_8: 0,
          task_9: 0,
          task_10: 0,
          task_11: 0,
          task_12: 0,
          task_13: 0,
          task_14: 0,
        },
      },
      month_2: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
        },
        subcat_2: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
        },
      },
      month_3: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
          task_8: 0,
          task_9: 0,
          task_10: 0,
          task_11: 0,
          task_12: 0,
          task_13: 0,
          task_14: 0,
          task_15: 0,
          task_16: 0,
          task_17: 0,
          task_18: 0,
          task_19: 0,
          task_20: 0,
          task_21: 0,
          task_22: 0,
          task_23: 0,
        },
      },
      month_4: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
        },
      },
      month_5: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
        },
      },
      month_6: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_7: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_8: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
          task_8: 0,
          task_9: 0,
        },
      },
    },
    Legal: {
      progress: 0,
      month_1: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
        subcat_2: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_2: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
        },
      },
      month_3: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_4: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
        },
      },
      month_5: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
        },
      },
      month_6: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_7: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_8: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
        },
      },
    },
    Work: {
      progress: 0,
      month_1: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
        },
      },
      month_2: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
        },
      },
      month_3: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
        },
      },
      month_4: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
        },
      },
      month_5: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
          task_8: 0,
          task_9: 0,
        },
      },
      month_6: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
        },
      },
      month_7: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
        },
      },
      month_8: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
        },
      },
    },
    Home: {
      progress: 0,
      month_1: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_2: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_3: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_4: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
        },
      },
      month_5: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
        },
      },
      month_6: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
        },
      },
      month_7: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
          task_8: 0,
          task_9: 0,
          task_10: 0,
          task_11: 0,
          task_12: 0,
        },
      },
      month_8: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
          task_7: 0,
        },
      },
    },
    Wellbeing: {
      progress: 0,
      month_1: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
        },
      },
      month_2: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
        },
        subcat_2: {
          progress: 0,
          task_1: 0,
        },
      },
      month_3: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
          task_6: 0,
        },
      },
      month_4: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
        },
      },
      month_5: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
        },
      },
      month_6: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
        },
      },
      month_7: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
          task_2: 0,
          task_3: 0,
          task_4: 0,
          task_5: 0,
        },
      },
      month_8: {
        progress: 0,
        subcat_1: {
          progress: 0,
          task_1: 0,
        },
      },
    },
  };

  if (hasChildren) {
    Object.assign(user, {
      Children: {
        progress: 0,
        month_1: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
          },
        },
        month_2: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
            task_3: 0,
            task_4: 0,
          },
          subcat_2: {
            progress: 0,
            task_1: 0,
            task_2: 0,
            task_3: 0,
            task_4: 0,
            task_5: 0,
            task_6: 0,
            task_7: 0,
            task_8: 0,
            task_9: 0,
          },
        },
        month_3: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
            task_3: 0,
            task_4: 0,
            task_5: 0,
            task_6: 0,
            task_7: 0,
            task_8: 0,
          },
        },
        month_4: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
            task_3: 0,
            task_4: 0,
            task_5: 0,
            task_6: 0,
            task_7: 0,
          },
        },
        month_5: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
            task_3: 0,
          },
        },
        month_6: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
            task_3: 0,
            task_4: 0,
            task_5: 0,
            task_6: 0,
          },
        },
        month_7: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
          },
        },
        month_8: {
          progress: 0,
          subcat_1: {
            progress: 0,
            task_1: 0,
            task_2: 0,
            task_3: 0,
          },
        },
      },
    });
  }

  return database.ref(`Users/${userID}`).set(user);
}

/*
Update total count of users in DB
*/
export function updateUserCount() {
  let userTotal = null;
  database.ref('Users').once('value').then((snapshot) => {
    userTotal = snapshot.val().total_users;
  });

  userTotal += 1;
  return database.ref('Users').update({
    total_users: userTotal,
  });
}

/*

Functions for Updating Progress Values
-------------------------------------

NOTES:

Since when a user first signs in we grab all their progress from all categories, there won't be a need to fetch progress data again.

Functions will need to be added the database with whatever progress a user completes.

With that in mind, we'll never be doing a full sweep update to a user's progress in the database. For each task completed, the local redux copy of the user's progress is updated immediately afterwards. This shouldn't be an issue because it's local redux data updates and not calls to Firebase. The functions below would be called during one of the following:

 A user goes into month N for Category X and clicks complete on a certain number of tasks, which triggers updates to the redux state.

1. As soon as a user goes back to the category X screen, a call to firebase is made IF a change occurred to the local redux state with an update for the specific month that the user did work in.

2. When the user goes back to the dashboard from the monthly goals screen for Category X, we check if changes were made to the redux state, then do a complete update of progress for Category X, regardless of the month that was worked on.

Option 2 sounds better since we'll reduce the number of calls to the database.


export function updateLegalProgress(userID, newProgress) {
}

export function updateFinancialProgress(userID, newProgress) {
}

export function updateWellbeingProgress(userID, newProgress) {
}

export function updateWorkProgress(userID, newProgress) {
}

export function updateHomeProgress(userID, newProgress) {
}

export function updateChildrenProgress(userID, newProgress) {
}

*/

/*
Fetch All user progress. Function is called after user is verified
signing in or after completion of sign up
*/
export function fetchUser(userID, email) {
  return (dispatch) => {
    const progressRef = database.ref(`Users/${userID}`).once('value');
    progressRef.then((snapProgress) => {
      const legalProg = snapProgress.child('Legal').val();
      const financialProg = snapProgress.child('Financial').val();
      const wellbeingProg = snapProgress.child('Wellbeing').val();
      const workProg = snapProgress.child('Work').val();
      const homeProg = snapProgress.child('Home').val();
      const firstName = snapProgress.child('first_name').val();
      const lastName = snapProgress.child('last_name').val();
      const startTime = snapProgress.child('start_time').val();

      const userInfo = {
        userID,
        firstName,
        lastName,
        email,
        startTime,
      };
      if (snapProgress.hasChild('Children')) {
        const childrenProg = snapProgress.child('Children').val();
        const hasChildren = true;
        const progress = {
          Legal: legalProg,
          Financial: financialProg,
          Wellbeing: wellbeingProg,
          Work: workProg,
          Home: homeProg,
          Children: childrenProg,
          hasChildren,
        };
        dispatch({
          type: 'FETCH_USER',
          payload: {
            progress,
            userInfo,
          },
        });
      } else {
        const hasChildren = false;
        const progress = {
          Legal: legalProg,
          Financial: financialProg,
          Wellbeing: wellbeingProg,
          Work: workProg,
          Home: homeProg,
          hasChildren,
        };
        dispatch({
          type: 'FETCH_USER',
          payload: {
            progress,
            userInfo,
          },
        });
      }
      /* NEED TO FIGURE OUT ERROR HANDLING HERE*/
    })
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
      });
  };
}


export function fetchGoals(category) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_CATEGORY',
      payload: {
        category,
      },
    });
  };
}

export function fetchTasks(item) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_TASKS',
      payload: {
        title: item.key,
        month: item.month,
        subcat: item.subcat,
      },
    });
  };
}

/*
Fetch user information (not progress). Function is called after a user logs in or completes sign up
*/
export function fetchUserInfo(userID, email) {
  return (dispatch) => {
    const progressRef = database.ref(`Users/${userID}`).once('value');
    progressRef.then((snapProgress) => {
      const firstName = snapProgress.child('first_name').val();
      const lastName = snapProgress.child('last_name').val();
      const startTime = snapProgress.child('start_time').val();
      dispatch({
        type: 'FETCH_USER_INFO',
        payload: {
          userID,
          firstName,
          lastName,
          email,
          startTime,
        },
      });
    })
      .catch((error) => {
        console.log(error.message);
      });
  };
}


export function updatePropsProgress(newProgress) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_PROGRESS,
      payload: {
        newProgress,
      },
    });
  };
}

export function updatePropsUserInfo(newInfo) {
  console.log(newInfo);
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_USER_INFO,
      payload: {
        newInfo,
      },
    });
  };
}
export function updateBackendProgress(userID, newProgress) {
  if (newProgress.hasChildren) {
    database.ref(`Users/${userID}`).update({
      Financial: newProgress.Financial,
      Legal: newProgress.Legal,
      Wellbeing: newProgress.Wellbeing,
      Work: newProgress.Work,
      Home: newProgress.Home,
      Children: newProgress.Children,
    }).then(() => {
      updatePropsProgress(newProgress);
    })
      .catch(() => {
        updatePropsProgress(newProgress);
      });
  } else {
    database.ref(`Users/${userID}`).update({
      Financial: newProgress.Financial,
      Legal: newProgress.Legal,
      Wellbeing: newProgress.Wellbeing,
      Work: newProgress.Work,
      Home: newProgress.Home,
      Children: newProgress.Children,
    }, updatePropsProgress());
  }
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_PROGRESS,
      payload: {
        newProgress,
      },
    });
  };
}

export function reauthenticateUser(email, currentPassword) {
  const user = auth.currentUser;
  const cred = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
  return user.reauthenticateWithCredential(cred);
}

export function updateName(userInfo) {
  return database.ref(`Users/${userInfo.userID}`).update({
    first_name: userInfo.firstName,
    last_name: userInfo.lastName,
  });
}

export function updateEmail(userInfo) {
  const user = auth.currentUser;

  return user.updateEmail(userInfo.email);
}

export function updatePassword(newPassword) {
  const user = auth.currentUser;
  return user.updatePassword(newPassword);
}
