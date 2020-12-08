import React, { Component } from "react";
import { Form, Button, Icon } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";

class QuizCodeForm extends Component {
  render() {
    const isTeacher = localStorage.getItem("is_teacher");
    if (isTeacher == "true") {
      return <Redirect to={"/"} />;
    }

    return (
      <Form>
        <br />
        <Form.Field>
          <label>Enter Quiz Code </label>
          <input placeholder="Enter Code " />
        </Form.Field>

        <Button animated>
          <Button.Content visible>Submit</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow right" />
          </Button.Content>
        </Button>
      </Form>
    );
  }
}

export default QuizCodeForm;
