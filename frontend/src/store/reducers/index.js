import { combineReducers } from "redux";
import auth from "./auth";
import teacher from "./teacher";
import quiztaker from "./quizTaker";

export default combineReducers({
  AuthReducer: auth,
  TeacherReducer: teacher,
  QuizTakerReducer: quiztaker,
});
