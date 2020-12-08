import React, { Component } from "react";
import { Form, Button, Icon, Segment } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { getQuiz } from "../store/actions/quizTaker";
import { connect } from "react-redux";

class QuizCodeForm extends Component {
  state = {
    code: "",
    disabled: true,
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      disabled: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { code } = this.state;
    this.props.onGetQuiz(code);
    return this.props.history.push(`/student/quiz/${code}`);
  };

  render() {
    const { isTeacher, quiz } = this.props;

    if (isTeacher == "true") {
      return <Redirect to="/" />;
    }

    // if (!Object.entries(quiz).length === 0) {
    //   return <Redirect to={`/student/quiz/${this.code}`} />;
    // }

    return (
      <Form onSubmit={this.handleSubmit}>
        <br />
        <Form.Field>
          <label>Enter Quiz Code </label>
          <input
            placeholder="Enter Code "
            name="code"
            value={this.state.code}
            onChange={this.handleChange}
          />
        </Form.Field>

        <Button disabled={this.state.disabled} animated>
          <Button.Content visible>Submit</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow right" />
          </Button.Content>
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.AuthReducer.isAuthenticated,
    quiz: state.QuizTakerReducer.quiz,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onAuth: (email, password) => dispatch(authLogin(email, password)),
    onGetQuiz: (slug) => dispatch(getQuiz(slug)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizCodeForm);
