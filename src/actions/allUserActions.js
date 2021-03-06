import _ from 'lodash';

export const actionTypes = {
  LOAD_USERS_INIT: 'ALL_USERS.STEEM.LOAD.INIT',
  LOAD_USERS_DONE: 'ALL_USERS.STEEM.LOAD.DONE',
  LOAD_USERS_ERROR: 'ALL_USERS.STEEM.LOAD.ERROR',
  LOAD_HAPRAMP_USER_INIT: 'ALL_USERS.HAPRAMP.LOAD.INIT',
  LOAD_HAPRAMP_USER_DONE: 'ALL_USERS.HAPRAMP.LOAD.DONE',
  LOAD_HAPRAMP_USER_ERROR: 'ALL_USERS.HAPRAMP.LOAD.ERROR',
};

export const loadUserAccounts = usernames => (dispatch, getState, { steemAPI }) => {
  const { fetchingUsers } = getState().allUsers;
  const pendingUsernames = _.uniq(usernames.filter(username => !fetchingUsers[username]));
  if (!pendingUsernames.length) {
    return usernames;
  }
  dispatch({ type: actionTypes.LOAD_USERS_INIT, usernames: pendingUsernames });
  return steemAPI.getUserAccounts(pendingUsernames)
    .then(results => dispatch({ type: actionTypes.LOAD_USERS_DONE, results }))
    .catch(error => dispatch({
      type: actionTypes.LOAD_USERS_ERROR, reason: error, usernames: pendingUsernames,
    }));
};

export const loadHaprampUserDetails = username => (dispatch, getState, { haprampAPI }) => {
  dispatch({ type: actionTypes.LOAD_HAPRAMP_USER_INIT, username });
  return haprampAPI.v2.users.getUserDetailsByUsername(username)
    .then(result => dispatch({ type: actionTypes.LOAD_HAPRAMP_USER_DONE, result }))
    .catch(reason => dispatch({ type: actionTypes.LOAD_HAPRAMP_USER_ERROR, reason }));
};
