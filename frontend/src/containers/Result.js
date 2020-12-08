import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { getResult } from "../store/actions/quizTaker";
import { Button, Header } from "semantic-ui-react";
import { Typography, Space } from "antd";
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
    const { quizTaker } = this.props;
    // this.props.onGetResult(quizTaker.id);
    this.setState({
      showResult: true,
    });
  };

  render() {
    const { isTeacher, quiz, isAuthenticated, result } = this.props;

    if (isTeacher == "true" || !isAuthenticated) {
      return <Redirect to="/" />;
    }
    console.log(this.props);
    const { quizTaker } = this.props;
    return (
      <>
        {this.state.showResult && (
          <>
            <Header size="huge">
              {" "}
              <Text type="success" strong>
                {result}{" "}
              </Text>
              <Text>/ {quiz.questions_count}</Text>
            </Header>

            <br />
            <Text type="success" strong size="Huge">
              {Math.round((result / quiz.questions_count) * 100)}%{" "}
            </Text>
          </>
        )}
        {!this.state.showResult && (
          <Button onClick={this.handleSubmit}>Show result</Button>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onAuth: (email, password) => dispatch(authLogin(email, password)),
    onGetResult: (quizTakerId) => dispatch(getResult(quizTakerId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Result);
