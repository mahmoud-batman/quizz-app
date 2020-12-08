import axios from "axios";
import * as actionTypes from "./actionTypes";
import { quizurl, authurl } from "../../constants";
import { authAxios } from "../utility";

export const getQuizes = () => {
  return (dispatch) => {
    axios
      .get(`${quizurl}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_QUIZES,
          quizes: res.data,
        });
        dispatch(getSubjects());
      })
      .catch((err) => console.log(err));
  };
};

export const getUsers = () => {
  return (dispatch) => {
    axios
      .get(`${authurl}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_USERS,
          users: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getSubjects = () => {
  return (dispatch) => {
    axios
      .get(`${quizurl}/subjects/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_SUBJECTS,
          subjects: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getQuiz = (slug) => {
  // console.log(slug);
  return (dispatch) => {
    axios
      .get(`${quizurl}/${slug}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_QUIZ,
          quiz: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const setQuiz = (name, subject) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/`,
        {
          name: name,
          subject: subject,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.SET_QUIZ,
          quiz: res.data,
        });
      })
      .catch((error) => {
        // dispatch(authFail(error));
      });
  };
};

export const updateQuiz = (name, subject, roll_out, training, time, slug) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/${slug}/`,
        {
          name: name,
          subject: subject,
          roll_out: roll_out,
          training: training,
          time: time,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.UPDATE_QUIZ,
          quiz: res.data,
        });
      })
      .catch((error) => {
        // dispatch(authFail(error));
        console.log(error);
      });
  };
};

export const deleteQuiz = (slug) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/${slug}/delete/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: actionTypes.DELETE_QUIZ,
          quiz: res.data,
        });
      })
      .catch((error) => {
        // dispatch(authFail(error));
        console.log(error);
      });
  };
};

export const getQuestions = (slug) => {
  return (dispatch) => {
    axios
      .get(`${quizurl}/${slug}/questions/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_QUESTIONS,
          questions: res.data,
        });
      })
      .catch((error) => console.log(error));
  };
};
export const deleteQuestion = (slug, id) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/${slug}/questions/${id}/delete/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.DELETE_QUESTION,
          question: res.data,
        });
      })
      .catch((error) => console.log(error));
  };
};

export const addQuestion = (slug, question, answers) => {
  return (dispatch) => {
    axios
      .post(
        `${quizurl}/${slug}/questions/`,
        { text: question, answers: answers },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.ADD_QUESTIONS,
          question: res.data,
        });
      })
      .catch((error) => console.log(error));
  };
};

export const getQuizTaker = (slug) => {
  return (dispatch) => {
    axios
      .get(`${quizurl}/${slug}/quiztaker/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_QUIZ_TAKER,
          quiztaker: res.data,
        });
      })
      .catch((error) => console.log(error));
  };
};

export const resetQuiz = () => {
  return (dispatch) => {
    return dispatch({
      type: actionTypes.RESET_QUIZTABLE,
    });
  };
};

// export const setUserSuccess = () => {
//   return (dispatch) => {
//     return dispatch({
//       type: actionTypes.RESET_QUIZTABLE,
//     });
//   };
// };

export const setUser = (
  first_name,
  second_name,
  password,
  user_id,
  is_teacher
) => {
  console.log(first_name, second_name, user_id, password, is_teacher);
  return (dispatch) => {
    // dispatch(loading());
    axios
      .post(
        `${authurl}/create-user/`,
        {
          user_id: user_id,
          first_name: first_name,
          last_name: second_name,
          password: password,
          is_teacher: is_teacher,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: res.data,
        });
      });
    // .then((res) => {
    //   const { token, full_name, user_id, id, is_teacher } = res.data;

    //   dispatch(setUserSuccess(token, full_name, user_id, id, is_teacher));
    // });
  };
};

export const deleteUser = (user_id) => {
  return (dispatch) => {
    // dispatch(loading());
    axios
      .post(
        `${authurl}/${user_id}/delete/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: actionTypes.DELETE_USER,
          user: res.data,
        });
      });
    // .then((res) => {
    //   const { token, full_name, user_id, id, is_teacher } = res.data;

    //   dispatch(setUserSuccess(token, full_name, user_id, id, is_teacher));
    // });
  };
};

export const deleteQuizTaker = (slug, quizTaker_id) => {
  return (dispatch) => {
    // dispatch(loading());
    axios
      .delete(`${quizurl}/${slug}/quiztaker/${quizTaker_id}/delete/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        dispatch({
          type: actionTypes.DELETE_QUIZTAKER,
          quizTaker: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
