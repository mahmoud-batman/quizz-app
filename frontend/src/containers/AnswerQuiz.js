import React, { Component } from "react";
import {
  Form,
  Grid,
  Button,
  Icon,
  Header,
  Segment,
  Container,
  Label,
  Radio,
  Progress,
} from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getQuiz } from "../store/actions/teacher";
import { createResponse } from "../store/actions/quizTaker";
import ModalForm from "./Modal";
import { Detector, Offline, Online } from "react-detect-offline";
import { logout, checkAuth } from "../store/actions/auth";
import { quizurl } from "../constants";
import axios from "axios";

function secondsToTime(e) {
  var h = Math.floor(e / 3600)
      .toString()
      .padStart(2, "0"),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, "0"),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, "0");

  return h + ":" + m + ":" + s;
}

class StartQuiz extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.interval = "";
  }

  state = {
    index: 0,
    online: false,
    questions: [{}],
    modal: false,
    disabled: true,
    time: 0,
  };
  
  //    setInterval(() => {
  //     if (this.state.time > 1) {
  //       this.setState({ time: this.state.time - 1 });
  //     }
  // }, 1000);

  componentDidMount() {
    const { quiz } = this.props;
    this._isMounted = true;
    this.setState({ time: quiz.time * 60 });
    setTimeout(this.handleSubmit, quiz.time * 60 * 1000);

    this.interval = setInterval(() => {
      if (this.state.time > 1) {
        this.setState({ time: this.state.time - 1 });
      } else {
        clearInterval(this.interval);
      }
    }, 1000);

    // setTimeout(this.handleSubmit, quiz.time * 60 * 1000);
    const { slug } = this.props.match.params;
  }

  handleRadioChange = (index, questionId, answerId) => {
    const questions = this.state.questions;
    questions[index] = {
      question: questionId,
      answer: answerId,
    };
    this.setState({
      questions: questions,
      disabled: false,
    });
  };

  handleSubmit = () => {
    const { quizTaker, quiz } = this.props;
    const { questions } = this.state;
    this.props.onCreateResponse(quizTaker.id, questions);
    this.setState({ modal: false });
    clearInterval(this.interval);

    if (quiz.training) {
      return this.props.history.push(`/student/result/`);
    } else {
      return this.props.history.push(`/`);
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  secondsToTime = (e) => {
    var h = Math.floor(e / 3600)
        .toString()
        .padStart(2, "0"),
      m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, "0"),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, "0");

    return h + ":" + m + ":" + s;
  };

  render() {
    const { isTeacher, questions, isAuthenticated, quiz } = this.props;
    if (isTeacher == "true" || !isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <>
        {this.secondsToTime(this.state.time)}
        {/* <Detector
          onChange={(_) => {
            fetch(`${quizurl}`, {
              mode: "no-cors",
            })
              .then(() => {
                console.log("CONNECTED TO INTERNET");
              })
              .catch((err) => {
                this.props.logout();
                this.props.history.push("/");
                
              });
          }}
          render={({ online }) => <></>}
        /> */}
        {questions.map(
          (question, index) =>
            index == this.state.index && (
              <Segment key={question.id}>
                <Progress
                  percent={((this.state.index + 1) / questions.length) * 100}
                  indicating
                />
                <Container textAlign="left">
                  <Label circular color="grey" key="grey">
                    {index + 1}
                  </Label>{" "}
                </Container>
                <Header as="h3" textAlign="center">
                  {question.text}
                </Header>
                <Grid container columns={2} stackable>
                  {question.answers.map((answer) => (
                    <Grid.Column key={answer.id}>
                      <Segment>
                        <Container>
                          <Radio
                            floated="left"
                            label={answer.text}
                            name="radioGroup"
                            checked={
                              index in this.state.questions &&
                              this.state.questions[index].answer == answer.id
                            }
                            onChange={(_) =>
                              this.handleRadioChange(
                                index,
                                question.id,
                                answer.id
                              )
                            }
                          />
                        </Container>
                      </Segment>
                    </Grid.Column>
                  ))}
                </Grid>
              </Segment>
            )
        )}

        <Container>
          {this.state.index > 0 && (
            <Button
              icon="arrow alternate circle left"
              // labelPosition="left"
              // label="Next"
              onClick={() => this.setState({ index: this.state.index - 1 })}
              floated="left"
            />
          )}
          {this.state.index == questions.length - 1 ? (
            <Button
              floated="right"
              onClick={(_) => this.setState({ modal: true })}
            >
              Finish
            </Button>
          ) : (
            <Button
              icon="arrow alternate circle right"
              // labelPosition="left"
              // label="Next"
              // disabled={this.state.disabled}
              onClick={() => this.setState({ index: this.state.index + 1 })}
              floated="right"
            />
          )}
          <ModalForm
            open={this.state.modal}
            onDeny={(_) => this.setState({ modal: false })}
            onAccept={this.handleSubmit}
            title="Are you Sure ?"
            content=" If you finished the exam, you can't go back."
          />
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.AuthReducer.isAuthenticated,
    quizTaker: state.QuizTakerReducer.quizTaker,
    quiz: state.QuizTakerReducer.quiz,
    questions: state.QuizTakerReducer.questions,
    response: state.QuizTakerReducer.response,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onAuth: (email, password) => dispatch(authLogin(email, password)),
    onCreateResponse: (quizTakerId, questions) =>
      dispatch(createResponse(quizTakerId, questions)),
    logout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartQuiz);
