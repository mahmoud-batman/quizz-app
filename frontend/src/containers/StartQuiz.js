import React, { Component } from "react";
import {
  // Form,
  Button,
  Icon,
  Header,
  // Segment,
  Container,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  createQuizTaker,
  getQuiz,
  getQuizQuestions,
} from "../store/actions/quizTaker";

class StartQuiz extends Component {
  state = {};

  componentDidMount() {
    // const { slug } = this.props.match.params;
    // const { quiz } = this.props;
    // this.props.onGetQuiz(slug);
  }

  handleSubmit = (id, slug) => {
    // console.log(i);
    this.props.onCreateQuizTaker(id);
    // this.props.onGetQuizQuestions(slug);
    return this.props.history.push(`/student/quiz/${slug}/start-quiz/`);
  };

  render() {
    const { isTeacher, quiz, isAuthenticated } = this.props;
    // const path = this.props.match.url;

    if (isTeacher === "true" || !isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <>
        {" "}
        <Container>
          <>
            <Header size="huge">
              {quiz.roll_out ? quiz.name : "Not Found"}
            </Header>
            <p className="lead">{quiz.description}</p>
            {quiz.roll_out ? (
              <Button
                animated
                disabled={!quiz.roll_out ? true : false}
                onClick={() => this.handleSubmit(quiz.id, quiz.slug)}
              >
                <Button.Content visible>Start Quiz</Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow right" />
                </Button.Content>
              </Button>
            ) : (
              <Button animated onClick={() => this.props.history.goBack()}>
                <Button.Content visible>Try again</Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow left" />
                </Button.Content>
              </Button>
            )}
          </>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quiz: state.QuizTakerReducer.quiz,
    questions: state.QuizTakerReducer.questions,
    isAuthenticated: state.AuthReducer.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetQuiz: (slug) => dispatch(getQuiz(slug)),
    onGetQuizQuestions: (slug) => dispatch(getQuizQuestions(slug)),
    onCreateQuizTaker: (id) => dispatch(createQuizTaker(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartQuiz);
