import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
// import { authurl } from "../utility";
import { authurl } from "../../constants";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const loading = () => {
  return {
    type: actionTypes.LOADING,
  };
};

export const authSuccess = (token, full_name, user_id, id, is_teacher) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    id: id,
    user_id: user_id,
    full_name: full_name,
    is_teacher: is_teacher,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("user_id");
  localStorage.removeItem("name");
  localStorage.removeItem("is_teacher");
  localStorage.removeItem("is_staff");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const online = (online) => {
  return {
    type: actionTypes.ONLINE,
    action: online,
  };
};

export const authLogin = (user_id, password) => {
  return (dispatch) => {
    // dispatch(authStart());
    dispatch(loading());
    axios
      .post(`${authurl}/login/`, {
        user_id: user_id,
        password: password,
      })
      .then((res) => {
        const {
          token,
          full_name,
          user_id,
          id,
          is_teacher,
          is_staff,
        } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("name", full_name);
        localStorage.setItem("is_teacher", is_teacher);
        localStorage.setItem("is_staff", is_staff);
        dispatch(authSuccess(token, full_name, user_id, id, is_teacher));
      })
      .catch((error) => {
        dispatch(authFail(error));
      });
  };
};

export const authSignup = (
  first_name,
  second_name,
  password,
  user_id,
  is_teacher
) => {
  return (dispatch) => {
    dispatch(authStart());
    // console.log(first_name, second_name, password, user_id, is_teacher);
    axios
      .post(`${authurl}/signup/`, {
        user_id: user_id,
        first_name: first_name,
        last_name: second_name,
        password: password,
        is_teacher: is_teacher,
      })
      .then((res) => {
        const {
          token,
          full_name,
          user_id,
          id,
          is_teacher,
          is_staff,
        } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("name", full_name);
        localStorage.setItem("is_teacher", is_teacher);
        localStorage.setItem("is_staff", is_staff);
        dispatch(authSuccess(token, full_name, user_id, id, is_teacher));
      })
      .catch((error) => {
        console.log(error);
        dispatch(authFail(error));
      });
  };
};

export const checkAuth = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const user_id = localStorage.getItem("user_id");
    const is_teacher = localStorage.getItem("is_teacher");
    if (token) {
      dispatch(authSuccess(token, email, user_id, is_teacher));
    } else {
      dispatch(logout());
    }
  };
};
