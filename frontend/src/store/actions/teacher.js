import axios from "axios";
import * as actionTypes from "./actionTypes";
import { quizurl, authurl } from "../../constants";
// import { authAxios } from "../utility";

export const loading = () => {
  return {
    type: actionTypes.LOADING,
  };
};

export const getQuizes = () => {
  return (dispatch) => {
    dispatch(loading());

    axios
      .get(`${quizurl}/`, {
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
    dispatch(loading());
    axios
      .get(`${authurl}/`, {
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
    // dispatch(loading());
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
    dispatch(loading());
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
    dispatch(loading());
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
        dispatch(getQuizes());
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
    dispatch(loading());

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
    dispatch(loading());

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

// export const getQuestion = (slug, id) => {
//   return (dispatch) => {
//     axios
//       .get(`${quizurl}/${slug}/questions/${id}/`, {
//         headers: {
//           Authorization: `Token ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((res) => {
//         dispatch({
//           type: actionTypes.GET_QUESTION,
//           question: res.data,
//         });
//       })
//       .catch((error) => console.log(error));
//   };
// };

export const editQuestion = (slug, question, answers, time, file, id) => {
  return (dispatch) => {
    // dispatch(loading());

    const obj = {
      text: question,
      answers: answers,
      time: time,
      id: id,
    };
    let url = `${quizurl}/${slug}/questions/${id}/`;

    let form_data = new FormData();

    // if (file.size > 0) {
    //   form_data.append("file", file, file.name);
    // } else if (file.name == "delete") {
    //   form_data.append("file", file.name);
    // } else {
    //   form_data.append("file", file.name);
    // }

    if (file.size > 0) {
      form_data.append("file", file, file.name);
    } else {
      form_data.append("file", file.name);
    }

    let _question = JSON.stringify(obj);
    form_data.append("question", _question);
    axios
      .post(url, form_data, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.EDIT_QUESTION,
          question: res.data,
        });
        // dispatch(getQuestions(slug));
      })
      .catch((error) => console.log(error));
  };
};

export const getListeningQuestions = (slug) => {
  return (dispatch) => {
    axios
      .get(`${quizurl}/${slug}/listening-questions/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_LISTENING_QUESTIONS,
          questions: res.data,
        });
      })
      .catch((error) => console.log(error));
  };
};

export const deleteQuestion = (slug, id) => {
  return (dispatch) => {
    dispatch(loading());

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

export const addQuestion = (slug, question, answers, time, file) => {
  return (dispatch) => {
    dispatch(loading());

    const obj = {
      text: question,
      answers: answers,
      time: time,
    };

    let form_data = new FormData();
    if (file != null) {
      form_data.append("file", file, file.name);
    } else {
      form_data.append("file", null);
    }

    let _question = JSON.stringify(obj);
    form_data.append("question", _question);

    let url = `${quizurl}/${slug}/questions/`;
    axios
      .post(url, form_data, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.ADD_QUESTIONS,
          question: res.data,
        });
      })
      .catch((error) => console.log(error));
  };
};

// export const addQuestion = (slug, question, answers) => {
//   return (dispatch) => {
//     axios
//       .post(
//         `${quizurl}/${slug}/questions/`,
//         { text: question, answers: answers },
//         {
//           headers: {
//             Authorization: `Token ${localStorage.getItem("token")}`,
//           },
//         }
//       )
//       .then((res) => {
//         dispatch({
//           type: actionTypes.ADD_QUESTIONS,
//           question: res.data,
//         });
//       })
//       .catch((error) => console.log(error));
//   };
// };

export const addListeningQuestion = (slug, file) => {
  return (dispatch) => {
    // cosnt blob = new Blob()
    let from_data = new FormData();
    from_data.append("file", file, file.name);
    let url = `${quizurl}/${slug}/listening-questions/`;
    axios
      .post(url, from_data, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch({
          type: actionTypes.ADD_LISTENING_QUESTION,
          question: res.data,
        });
      })
      .catch((err) => console.log(err));
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
