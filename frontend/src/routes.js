import React from "react";
import Layout from "./Layout/Layout";
import EditQuiz from "./containers/EditQuiz";
import LoginForm from "./containers/Login";
import Questions from "./containers/Questions";
import EditQuestions from "./containers/EditQuestions";
// import ListeningQuestions from "./containers/ListeningQuestions";
import SignupForm from "./containers/Signup";
import WelcomePage from "./containers/Welcome";
import QuizesTable from "./containers/QuizesTable";
// import UsersTable from "./containers/UsersTable";
import Users from "./containers/Users";
import QuizCodeForm from "./containers/QuizCodeForm";
import StartQuiz from "./containers/StartQuiz";
import TeacherAdmin from "./Layout/TeacherAdmin";
import StudentLayout from "./Layout/StudentLayout";
import AnswerQuiz from "./containers/AnswerQuiz";
import QuizTaker from "./containers/QuizTakers";
import Result from "./containers/Result";
import { Route, Switch } from "react-router-dom";

export default function Routes() {
  return (
    <Switch>
      <Route path="/login" component={LoginForm} />
      <Route path="/signup" component={SignupForm} />
      <Layout>
        <Route path="/teacher">
          <TeacherAdmin>
            <Route
              exact
              path="/teacher/quizes/:slug/questions/"
              component={Questions}
            />
            <Route
              exact
              path="/teacher/quizes/:slug/questions/:id/"
              component={EditQuestions}
            />
            {/* <Route
              exact
              path="/teacher/quizes/:slug/listening-questions/"
              component={ListeningQuestions}
            /> */}
            <Route exact path="/teacher/quiztaker" component={QuizTaker} />
            <Route exact path="/teacher/quizes/:slug" component={EditQuiz} />
            <Route exact path="/teacher/quizes" component={QuizesTable} />
            <Route exact path="/teacher/users/" component={Users} />
          </TeacherAdmin>
        </Route>
        <Route path="/student">
          <StudentLayout>
            <Route
              exact
              path="/student/quiz/:slug/start-quiz"
              component={AnswerQuiz}
            />
            <Route exact path="/student/quiz/:slug/" component={StartQuiz} />
            <Route exact path="/student/result" component={Result} />
            <Route exact path="/student" component={QuizCodeForm} />
          </StudentLayout>
        </Route>
        <Route exact path="/" component={WelcomePage} />
      </Layout>
    </Switch>
  );
}
