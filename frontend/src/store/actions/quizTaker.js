import axios from "axios";
import * as actionTypes from "./actionTypes";
import { quizurl } from "../../constants";
// import { authAxios } from "../utility";

export const getQuiz = (slug) => {
  return (dispatch) => {
    axios
      .get(`${quizurl}/quiztaker/${slug}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch(getQuizQuestions(res.data.slug));
        dispatch({
          type: actionTypes.GET_QUIZ_QUIZ_TAKER,
          quiz: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: actionTypes.GET_QUIZ_QUIZ_TAKER,
          quiz: {},
        });
      });
  };
};

export const getQuizQuestions = (slug) => {
  return (dispatch) => {
    axios
      .get(`${quizurl}/quiztaker/${slug}/questions/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_QUIZ_QUESTIONS,
          questions: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const createQuizTaker = (id) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/quiztaker/`,
        { quiz: id },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.CREATE_QUIZ_TAKER,
          quizTaker: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const createResponse = (quizTakerId, questions) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/quiztaker/${quizTakerId}/response/`,
        { questions: questions },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch(getResult(quizTakerId));
        // dispatch(getResponse(quizTakerId));
        dispatch({
          type: actionTypes.CREATE_RESPONSE,
          response: res.data,
        });
        // console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
};

export const getResponse = (quizTakerId) => {
  return (dispatch) => {
    axios
      .get(`${quizurl}/quiztaker/${quizTakerId}/response/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_RESPONSE,
          response: res.data,
        });
        // console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
};

export const getResult = (quizTakerId) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/quiztaker/${quizTakerId}/result/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.GET_RESULT,
          result: res.data.result,
        });
      })
      .catch((err) => console.log(err));
  };
};
