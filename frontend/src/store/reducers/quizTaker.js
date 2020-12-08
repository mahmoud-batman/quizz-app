import { updateObject } from "../utility";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  //   quizes: [],
  questions: [],
  quizTaker: {},
  quiz: {},
  response: {},
  result: "",
};

const getQuiz = (state, action) => {
  return updateObject(state, {
    quiz: action.quiz,
    // loading: true,
  });
};
const getQuizQuestions = (state, action) => {
  return updateObject(state, {
    questions: action.questions,
    // loading: true,
  });
};

const quizTaker = (state, action) => {
  return updateObject(state, {
    quizTaker: action.quizTaker,
  });
};

const createResponse = (state, action) => {
  return updateObject(state, {
    result: "",
    response: action.questions,
  });
};

const result = (state, action) => {
  return updateObject(state, {
    result: action.result,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_QUIZ_QUIZ_TAKER:
      return getQuiz(state, action);
    case actionTypes.CREATE_QUIZ_TAKER:
      return quizTaker(state, action);
    case actionTypes.GET_QUIZ_QUESTIONS:
      return getQuizQuestions(state, action);
    case actionTypes.CREATE_RESPONSE:
      return createResponse(state, action);
    case actionTypes.GET_RESULT:
      return result(state, action);
    default:
      return state;
  }
};

export default reducer;
