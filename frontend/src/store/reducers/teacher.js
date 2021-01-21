import { updateObject } from "../utility";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  quizes: [],
  questions: [],
  question: {},
  listening_questions: [],
  quiz: {},
  quiztaker: [],
  users: [],
  loading: true,
};

const loading = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const getQuizes = (state, action) => {
  return updateObject(state, {
    quizes: action.quizes,
    loading: false,
  });
};

const getQuiz = (state, action) => {
  return updateObject(state, {
    quiz: action.quiz,
    loading: false,
  });
};

const setQuiz = (state, action) => {
  return updateObject(state, {
    quizes: [...state.quizes, action.quiz],
    loading: false,
  });
};
const updateQuiz = (state, action) => {
  //   var foundIndex = items.findIndex(x => x.id == item.id);
  // items[foundIndex] = item;
  const quizes = state.quizes;
  const quizIndex = quizes.findIndex((x) => x.id === action.quiz.id);
  quizes[quizIndex] = action.quiz;

  return updateObject(state, {
    quizes: quizes,
    loading: false,
  });
};

const editQuestion = (state, action) => {
  const questions = [...state.questions];
  const questionIndex = questions.findIndex((x) => x.id === action.question.id);
  questions[questionIndex] = action.question;

  return updateObject(state, {
    questions: [...questions],
    loading: false,
  });
};

const deleteQuiz = (state, action) => {
  //   var foundIndex = items.findIndex(x => x.id == item.id);
  // items[foundIndex] = item;
  const quizes = state.quizes;
  // const quizIndex = quizes.findIndex((x) => x.id == action.quiz.id);
  // quizes[quizIndex] = action.quiz;
  return updateObject(state, {
    quizes: quizes.filter((quiz) => quiz.slug !== action.quiz.slug),
    loading: false,
  });
};

const getSubjects = (state, action) => {
  return updateObject(state, {
    subjects: action.subjects,
    loading: false,
  });
};

const getQuestions = (state, action) => {
  return updateObject(state, {
    questions: action.questions,
    loading: false,
  });
};

// const getQuestion = (state, action) => {
//   return updateObject(state, {
//     question: action.question,
//     loading: false,
//   });
// };

const getListeningQuestions = (state, action) => {
  return updateObject(state, {
    listening_questions: action.questions,
    loading: false,
  });
};

const addQuestions = (state, action) => {
  return updateObject(state, {
    questions: [...state.questions, action.question],
    loading: false,
  });
};

const addListeningQuestion = (state, action) => {
  return updateObject(state, {
    listening_questions: [...state.listening_questions, action.question],
    loading: false,
  });
};

const deleteQuestion = (state, action) => {
  const questions = state.questions;
  return updateObject(state, {
    questions: questions.filter((question) =>
      question.file != null
        ? question.file !== action.question.file
        : question.text !== action.question.text
    ),
    // questions: [...state.questions, action.question],
    loading: false,
  });
};

const getQuizTaker = (state, action) => {
  return updateObject(state, {
    quiztaker: action.quiztaker,
    loading: false,
  });
};

const getUsers = (state, action) => {
  return updateObject(state, {
    users: action.users,
    loading: false,
  });
};

const setUser = (state, action) => {
  return updateObject(state, {
    users: [action.user, ...state.users],
  });
};

const deleteUser = (state, action) => {
  const users = state.users;
  return updateObject(state, {
    users: users.filter((user) => user.user_id !== action.user.user_id),
  });
};

const deleteQuizTaker = (state, action) => {
  const qts = state.quiztaker;
  // console.log(quiztaker[0].user.user_id);
  return updateObject(state, {
    quiztaker: qts.filter(
      (qt) => qt.user.user_id !== action.quizTaker.user.user_id
    ),
  });
};

const resetQuizTable = (state) => {
  return updateObject(state, initialState);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING:
      return loading(state, action);
    case actionTypes.GET_QUIZES:
      return getQuizes(state, action);
    case actionTypes.GET_SUBJECTS:
      return getSubjects(state, action);
    case actionTypes.SET_QUIZ:
      return setQuiz(state, action);
    case actionTypes.UPDATE_QUIZ:
      return updateQuiz(state, action);
    case actionTypes.DELETE_QUIZ:
      return deleteQuiz(state, action);
    case actionTypes.GET_QUIZ:
      return getQuiz(state, action);
    case actionTypes.RESET_QUIZTABLE:
      return resetQuizTable(state);
    case actionTypes.GET_QUESTIONS:
      return getQuestions(state, action);
    case actionTypes.EDIT_QUESTION:
      return editQuestion(state, action);
    case actionTypes.GET_LISTENING_QUESTIONS:
      return getListeningQuestions(state, action);
    case actionTypes.ADD_LISTENING_QUESTION:
      return addListeningQuestion(state, action);
    case actionTypes.ADD_QUESTIONS:
      return addQuestions(state, action);
    case actionTypes.DELETE_QUESTION:
      return deleteQuestion(state, action);
    case actionTypes.GET_QUIZ_TAKER:
      return getQuizTaker(state, action);
    case actionTypes.GET_USERS:
      return getUsers(state, action);
    case actionTypes.SET_USER:
      return setUser(state, action);
    case actionTypes.DELETE_USER:
      return deleteUser(state, action);
    case actionTypes.DELETE_QUIZTAKER:
      return deleteQuizTaker(state, action);
    default:
      return state;
  }
};
export default reducer;
