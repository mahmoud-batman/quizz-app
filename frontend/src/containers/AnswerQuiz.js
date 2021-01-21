import React, { Component } from "react";
import {
  Grid,
  Button,
  Segment,
  Container,
  Label,
  Radio,
  Progress,
  Icon,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import { getQuiz } from "../store/actions/teacher";
import { createResponse } from "../store/actions/quizTaker";
import ModalForm from "./Modal";
// import { Detector, Offline, Online } from "react-detect-offline";
import { logout } from "../store/actions/auth";
import { localhost, quizurl } from "../constants";
import Parser from "html-react-parser";
import { Detector } from "react-detect-offline";

// import axios from "axios";
// import { Typography } from "antd";
// const { Text } = Typography;

// function secondsToTime(e) {
//   var h = Math.floor(e / 3600)
//       .toString()
//       .padStart(2, "0"),
//     m = Math.floor((e % 3600) / 60)
//       .toString()
//       .padStart(2, "0"),
//     s = Math.floor(e % 60)
//       .toString()
//       .padStart(2, "0");

//   return h + ":" + m + ":" + s;
// }

// const TIME = 20;

class StartQuiz extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.interval = "";
    // this.listeningInterval = "";
  }

  state = {
    index: 0,
    online: false,
    questions: [],
    modal: false,
    disabled: true,
    time: 0,
    listeningTime: 0,
    currentQuestion: {},
    playing: false,
  };

  componentDidMount() {
    const { quiz, questions } = this.props;
    this._isMounted = true;

    let _questions = questions.map((question) => {
      return { question: question.id };
    });
    this.setState({
      time: quiz.time * 60,
      questions: _questions,
      currentQuestion: questions[this.state.index],
    });

    if (questions[this.state.index] != null) {
      if (questions[this.state.index].file != null) {
        this.setState({ listeningTime: questions[this.state.index].time });
      }
    }

    /**
     * quiz time out
     */
    this.interval = setInterval(() => {
      if (
        document.getElementById("myAudio") != null &&
        document.getElementById("myAudio").readyState
      ) {
      }

      if (this.state.time > 1) {
        // this.setState({ time: this.state.time - 1 });
        if (
          this.state.currentQuestion != null &&
          this.state.currentQuestion.file != null &&
          //document.getElementById("myAudio") != null &&
          //  document.getElementById("myAudio").paused
          //  document.getElementById("myAudio").readyState
          document.getElementById("myAudio") != null &&
          document.getElementById("myAudio").readyState
        ) {
          this.setState({ time: this.state.time - 1 });
          if (this.state.listeningTime > 1) {
            this.setState({
              listeningTime: this.state.listeningTime - 1,
            });
          } else {
            if (this.state.index + 1 === questions.length) {
              this.handleSubmit();
              clearInterval(this.interval);
            } else {
              this.setState({
                index: this.state.index + 1,
                currentQuestion: questions[this.state.index + 1],
                listeningTime: questions[this.state.index + 1].time,
              });
            }

            // if (
            //   questions[this.state.index + 1] != null &&
            //   questions[this.state.index + 1].file != null
            // ) {
            //   this.setState({
            //     listeningTime: questions[this.state.index + 1].time,
            //   });
            // }
          }
        } else {
          this.setState({ time: this.state.time - 1 });
        }
      } else {
        this.handleSubmit();
        clearInterval(this.interval);
      }
    }, 1000);

    /**
     * listening questions
     */

    /**
     * if current question is file : - setListeningInterval and setState listeningTime
     *
     */

    // if (this.state.index <= _questions.length) {
    //   let question = questions[this.state.index];
    //   if (question.file != null) {
    //     this.setState({ listeningTime: question.time });
    //     this.listeningInterval = setInterval(() => {
    //       if (this.state.listeningTime > 1) {
    //         this.setState({ listeningTime: this.state.listeningTime - 1 });
    //       } else {
    //         this.setState({
    //           listeningTime: question.time,
    //           index: this.state.index + 1,
    //         });
    //       }
    //     }, 1000);
    //   }
    // }

    // if (questions[0].file != null) {
    //   this.setState({ listeningTime: questions[0].time });
    // }

    // this.listeningInterval = setInterval(() => {
    //   let question = questions[this.state.index];
    //   if (question && question.file) {
    //     if (this.state.listeningTime > 1) {
    //       this.setState({ listeningTime: this.state.listeningTime - 1 });
    //     } else {
    //       this.setState({
    //         listeningTime: questions[this.state.index + 1].time,
    //         index: this.state.index + 1,
    //       });
    //     }
    //   }
    // }, 1000);
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
    // clearInterval(this.listeningInterval);

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
    const { isTeacher, questions, isAuthenticated } = this.props;

    if (isTeacher === "true" || !isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <>
        {window.addEventListener("beforeunload", function (e) {
          e.preventDefault();
          e.returnValue = "";
        })}

        <Detector
          onChange={(_) => {
            fetch(`${quizurl}`, {
              mode: "no-cors",
            })
              .then(() => {
                console.log("CONNECTED TO INTERNET");
              })
              .catch((err) => {
                console.log("err", err);
                this.props.logout();
                this.props.history.push("/");
              });
          }}
          render={({ online }) => <></>}
        />
        {/* {questions.map(
          (question, index) =>
            index == this.state.index && (
              <Segment key={question.id}>
                <Progress
                  percent={((this.state.index + 1) / questions.length) * 100}
                  indicating
                />
                <Text type="success" strong>
                  {question.file != null && this.state.listeningTime}{" "}
                </Text>
                <Container textAlign="left">
                  <Label circular color="grey" key="grey">
                    {index + 1}
                  </Label>{" "}
                </Container>
                <Header as="h3" textAlign="center">
                  {question.text}
                </Header>{" "}
                {question.file && (
                  <audio
                    autoPlay
                  >
                    <source
                      src={`${localhost}/${question.file}`}
                      type="audio/mpeg"
                    />
                  </audio>
                )}
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
        )} */}
        {this.state.currentQuestion != null && (
          <Segment key={this.state.currentQuestion.id}>
            <Label
              color="black"
              // color="violet"
              // style={{ color: "#1890ff" }}
              // icon="time"
              attached="top"
            >
              <Icon name="time" />
              {this.secondsToTime(this.state.time)} sec
            </Label>
            <Progress
              size="tiny"
              percent={(this.state.time / (this.props.quiz.time * 60)) * 100}
              indicating
            />
            {/* (this.state.time / (this.props.quiz.time * 60)) * 100) */}
            {/* <Progress
              percent={((this.state.index + 1) / questions.length) * 100}
              indicating
            /> */}
            {/* <Text type="success" strong>
              {this.state.currentQuestion.file != null &&
                this.state.listeningTime}{" "}
            </Text> */}
            <Container textAlign="left">
              <Label circular color="grey" key="grey">
                {this.state.index + 1}
              </Label>{" "}
              {this.state.currentQuestion.file && (
                <Label ribbon="right" color="blue">
                  <Icon name="time" />
                  {this.state.currentQuestion.file != null &&
                    this.state.listeningTime}{" "}
                  <Label.Detail>Sec</Label.Detail>
                </Label>
              )}
            </Container>
            {this.state.currentQuestion.file && (
              <>
                <Icon size="big" name="sound" />
                <audio autoPlay id="myAudio" preload="auto">
                  <source
                    src={`${localhost}/${this.state.currentQuestion.file}`}
                    type="audio/mpeg"
                  />
                </audio>
              </>
            )}
            <Container>
              {this.state.currentQuestion.text &&
                Parser(this.state.currentQuestion.text)}
            </Container>{" "}
            <Grid container columns={2} stackable>
              {this.state.currentQuestion.answers != null &&
                this.state.currentQuestion.answers.map((answer) => (
                  <Grid.Column key={answer.id}>
                    <Segment>
                      <Container>
                        <Radio
                          floated="left"
                          label={answer.text}
                          name="radioGroup"
                          checked={
                            this.state.index in this.state.questions &&
                            this.state.questions[this.state.index].answer ===
                              answer.id
                          }
                          onChange={(_) =>
                            this.handleRadioChange(
                              this.state.index,
                              this.state.currentQuestion.id,
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
        )}
        {/* <Segment key={this.state.currentQuestion.id}>
          <Progress
            percent={((this.state.index + 1) / questions.length) * 100}
            indicating
          />
          <Text type="success" strong>
            {this.state.currentQuestion.file != null &&
              this.state.listeningTime}{" "}
          </Text>
          <Container textAlign="left">
            <Label circular color="grey" key="grey">
              {this.state.index + 1}
            </Label>{" "}
          </Container>
          <Header as="h3" textAlign="center">
            {this.state.currentQuestion.text}
          </Header>{" "}
          {this.state.currentQuestion.file && (
            <audio autoPlay>
              <source
                src={`${localhost}/${this.state.currentQuestion.file}`}
                type="audio/mpeg"
              />
            </audio>
          )}
          <Grid container columns={2} stackable>
            {this.state.currentQuestion.answers.map((answer) => (
              <Grid.Column key={answer.id}>
                <Segment>
                  <Container>
                    <Radio
                      floated="left"
                      label={answer.text}
                      name="radioGroup"
                      checked={
                        index in this.state.questions &&
                        this.state.currentQuestion.answer == answer.id
                      }
                      onChange={(_) =>
                        this.handleRadioChange(
                          this.state.index,
                          this.state.currentQuestion.id,
                          answer.id
                        )
                      }
                    />
                  </Container>
                </Segment>
              </Grid.Column>
            ))}
          </Grid>
        </Segment> */}
        <Container>
          {this.state.index > 0 && (
            <Button
              icon="arrow alternate circle left"
              // labelPosition="left"
              // label="Next"
              onClick={() => {
                this.setState({
                  index: this.state.index - 1,
                  currentQuestion: questions[this.state.index - 1],
                  // listeningTime: questions[this.state.index - 1].time,
                });

                if (this.state.currentQuestion.file != null) {
                  this.setState({
                    listeningTime: questions[this.state.index - 1].time,
                  });
                }
              }}
              floated="left"
              disabled={
                this.state.currentQuestion.file != null ||
                // questions[this.state.index].file != null ||
                questions[this.state.index - 1].file != null
              }
            />
          )}
          {this.state.index === questions.length - 1 ? (
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
              // disabled={questions[this.state.index].file != null}
              onClick={() => {
                this.setState({
                  index: this.state.index + 1,
                  currentQuestion: questions[this.state.index + 1],
                });
                if (questions[this.state.index + 1].file != null) {
                  this.setState({
                    listeningTime: questions[this.state.index + 1].time,
                  });
                }
              }}
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
