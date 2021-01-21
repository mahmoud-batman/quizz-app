import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getResult } from "../store/actions/quizTaker";
import {
  Button,
  Header,
  Loader,
  Divider,
  Label,
  List,
  // Segment,
  // Container,
  // Icon,
} from "semantic-ui-react";
import { localhost } from "../constants";
import Parser from "html-react-parser";

import { Typography } from "antd";
const { Text } = Typography;

class Result extends Component {
  state = {
    showResult: true,
  };

  componentDidMount() {
    // const { quizTaker } = this.props;
    // this.props.onGetResult(quizTaker.id);
  }

  handleSubmit = () => {
    // const { quizTaker } = this.props;
    // this.props.onGetResult(quizTaker.id);
    this.setState({
      showResult: true,
    });
  };

  wrongAnswers = () => {
    const { response, questions } = this.props;
    // {quiztaker: {…}, question: 31, answer: null}
    // {id: 35, text: "trest iosjdfohiso ?", file: null, answers: Array(4)}
    // for each question if response answer is not same as question push to last array
    if (questions != null && response != null) {
      let _questions = questions.filter((question, index) =>
        question.answers.find(
          (answer) =>
            answer.is_correct === true && answer.id !== response[index].answer
        )
      );
      // console.log(_questions);
      return _questions;
    } else return;
  };

  render() {
    const {
      isTeacher,
      quiz,
      isAuthenticated,
      result,
      // quizTaker,
    } = this.props;

    if (isTeacher === "true" || !isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <>
        {result >= "0" ? (
          <>
            <Header size="huge">
              {" "}
              <Text
                type={
                  Math.round(result / quiz.questions_count) > 0.5
                    ? "success"
                    : "danger"
                }
                strong
              >
                {result}{" "}
              </Text>
              <Text>/ {quiz.questions_count}</Text>
              <br />
              <Text
                type={
                  Math.round(result / quiz.questions_count) > 0.5
                    ? "success"
                    : "danger"
                }
              >
                {Math.round((result / quiz.questions_count) * 100)}%{" "}
              </Text>
            </Header>
            {this.wrongAnswers().length > 0 && (
              <>
                <Divider horizontal>
                  <Label circular color="grey" key="grey">
                    Answers
                  </Label>{" "}
                </Divider>

                <List divided style={{ width: "80vw" }}>
                  {this.wrongAnswers().map((question, index) => (
                    <List.Item key={question.id}>
                      <List.Content>
                        <List.Header>
                          {question.file != null ? (
                            <audio
                              controls
                              preload="metadata"
                              style={{ width: "100%" }}
                            >
                              <source
                                src={`${localhost}/${question.file}`}
                                type="audio/mpeg"
                              />
                            </audio>
                          ) : (
                            Parser(question.text)
                          )}
                        </List.Header>

                        {question.answers.map((answer) => (
                          <List.Description key={answer.id}>
                            {answer.is_correct && (
                              <List.Icon name="check" color="green">
                                {answer.text}
                              </List.Icon>
                            )}
                          </List.Description>
                        ))}
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </>
            )}{" "}
            <Divider horizontal>
              <Button>
                <a href="/" type="button">
                  Finish
                </a>
              </Button>
            </Divider>
          </>
        ) : (
          <Loader active inline="centered" size="large" />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.AuthReducer.isAuthenticated,
    quizTaker: state.QuizTakerReducer.quizTaker,
    result: state.QuizTakerReducer.result,
    quiz: state.QuizTakerReducer.quiz,
    questions: state.QuizTakerReducer.questions,
    response: state.QuizTakerReducer.response,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onAuth: (email, password) => dispatch(authLogin(email, password)),
    onGetResult: (quizTakerId) => dispatch(getResult(quizTakerId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Result);
