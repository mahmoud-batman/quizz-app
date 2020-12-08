import { updateObject } from "../utility";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  quizes: [],
  questions: [],
  quiz: {},
  quiztaker: [],
  users: [],
};

const getQuizes = (state, action) => {
  return updateObject(state, {
    quizes: action.quizes,
    // loading: true,
  });
};

const getQuiz = (state, action) => {
  return updateObject(state, {
    quiz: action.quiz,
    // loading: true,
  });
};

const setQuiz = (state, action) => {
  console.log(action.quiz);
  return updateObject(state, {
    quizes: [...state.quizes, action.quiz],
    // loading: true,
  });
};
const updateQuiz = (state, action) => {
  //   var foundIndex = items.findIndex(x => x.id == item.id);
  // items[foundIndex] = item;
  const quizes = state.quizes;
  const quizIndex = quizes.findIndex((x) => x.id == action.quiz.id);
  quizes[quizIndex] = action.quiz;

  return updateObject(state, {
    quizes: quizes,
    // loading: true,
  });
};
const deleteQuiz = (state, action) => {
  //   var foundIndex = items.findIndex(x => x.id == item.id);
  // items[foundIndex] = item;
  const quizes = state.quizes;
  // const quizIndex = quizes.findIndex((x) => x.id == action.quiz.id);
  // quizes[quizIndex] = action.quiz;
  return updateObject(state, {
    quizes: quizes.filter((quiz) => quiz.slug != action.quiz.slug),
    // loading: true,
  });
};

const getSubjects = (state, action) => {
  return updateObject(state, {
    subjects: action.subjects,
    // loading: true,
  });
};

const getQuestions = (state, action) => {
  return updateObject(state, {
    questions: action.questions,
    // loading: true,
  });
};

const addQuestions = (state, action) => {
  return updateObject(state, {
    questions: [...state.questions, action.question],
    // loading: true,
  });
};

const deleteQuestion = (state, action) => {
  const questions = state.questions;
  return updateObject(state, {
    questions: questions.filter(
      (question) => question.text != action.question.text
    ),
    // questions: [...state.questions, action.question],
    // loading: true,
  });
};

const getQuizTaker = (state, action) => {
  return updateObject(state, {
    quiztaker: action.quiztaker,
    // loading: true,
  });
};

const getUsers = (state, action) => {
  return updateObject(state, {
    users: action.users,
    // loading: true,
  });
};

const setUser = (state, action) => {
  return updateObject(state, {
    users: [action.user, ...state.users],
  });
};

const deleteUser = (state, action) => {
  console.log(action.user.id);
  const users = state.users;
  return updateObject(state, {
    users: users.filter((user) => user.user_id != action.user.user_id),
  });
};

const deleteQuizTaker = (state, action) => {
  const qts = state.quiztaker;
  // console.log(quiztaker[0].user.user_id);
  return updateObject(state, {
    quiztaker: qts.filter(
      (qt) => qt.user.user_id != action.quizTaker.user.user_id
    ),
  });
};

const resetQuizTable = (state) => {
  return updateObject(state, initialState);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
