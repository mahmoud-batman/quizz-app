import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  id: null,
  user_id: null,
  full_name: "",
  isTeacher: false,
  is_staff: false,
  error: null,
  loading: false,
  isAuthenticated: false,
  online: false,
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const loading = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    id: action.id,
    user_id: action.user_id,
    full_name: action.full_name,
    isTeacher: action.is_teacher,
    isAuthenticated: true,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    isAuthenticated: false,
  });
};

const logout = (state, action) => {
  return updateObject(state, initialState);
};

const online = (state, action) => {
  console.log(action);
  return updateObject(state, {
    online: true,
  });
};

const resetError = (state, action) => {
  return updateObject(state, {
    error: null,
  });
};

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING:
      return loading(state, action);
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      // sleep(2000);
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return logout(state, action);
    case actionTypes.RESET_ERROR:
      return resetError(state, action);
    case actionTypes.ONLINE:
      return online(state, action);
    default:
      return state;
  }
};
export default reducer;
