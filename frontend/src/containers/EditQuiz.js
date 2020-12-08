import React, { Component } from "react";
import {
  Form,
  Button,
  Icon,
  Dropdown,
  Checkbox,
  Label,
  Segment,
} from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getQuiz, updateQuiz, deleteQuiz } from "../store/actions/teacher";
import axios from "axios";
import { quizurl } from "../constants";
import ModalForm from "./Modal";

class EditQuiz extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    name: "",
    subject: "",
    roll_out: false,
    training: false,
    disabled: true,
    modal: false,
    time: 1,
  };

  componentDidMount() {
    const slug = this.props.match.params.slug;
    axios
      .get(`${quizurl}/${slug}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          roll_out: res.data.roll_out,
          training: res.data.training,
          subject: res.data.subject,
        });
        return res.data;
      })
      .catch((err) => console.log(err));
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      disabled: false,
    });
  };

  handleDropdownChange = (e) => {
    this.setState({
      subject: e.target.children[0].innerHTML,
      disabled: false,
    });
  };

  handleRollout = () => {
    this.setState({
      roll_out: !this.state.roll_out,
      disabled: false,
    });
  };

  handleTraining = () => {
    this.setState({
      training: !this.state.training,
      disabled: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, subject, roll_out, training, time } = this.state;
    const slug = this.props.match.params.slug;
    this.props.onUpdateQuiz(name, subject, roll_out, training, time, slug);
    return this.props.history.goBack();
  };

  handleDelete = (e) => {
    e.preventDefault();
    const slug = this.props.match.params.slug;

    this.props.onDeleteQuiz(slug);
    return this.props.history.goBack();
  };

  render() {
    const { isAuthenticated, subjects, quiz } = this.props;
    if (!isAuthenticated) {
      return <Redirect to={"/"} />;
    }

    const options =
      subjects &&
      subjects.map((subject) => {
        return {
          key: subject.id,
          text: subject.name,
          value: subject.name,
        };
      });

    return (
      <Segment>
        <Button
          negative
          icon
          labelPosition="right"
          float="right"
          onClick={(_) => this.setState({ modal: true })}
        >
          Delete
          <Icon name="trash alternate" />
        </Button>{" "}
        <Form onSubmit={this.handleSubmit}>
          <br />
          <Form.Field>
            <label>Edit Quiz name</label>
            <input
              placeholder={quiz.name}
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </Form.Field>{" "}
          <Form.Field>
            <Form.Group inline>
              <Checkbox
                toggle
                label="Activate"
                onClick={this.handleRollout}
                checked={this.state.roll_out}
              />
            </Form.Group>
          </Form.Field>{" "}
          <Form.Field>
            <Form.Group inline>
              <Checkbox
                toggle
                label="Training"
                onClick={this.handleTraining}
                checked={this.state.training}
              />
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group inline>
              <Form.Input
                placeholder="10 min"
                min="1"
                type="number"
                width={4}
                name="time"
                value={this.state.time}
                onChange={this.handleChange}
              />
              <Label>Time (min)</Label>
            </Form.Group>
          </Form.Field>
          <Button animated disabled={this.state.disabled}>
            <Button.Content visible>Submit</Button.Content>
            <Button.Content hidden>
              <Icon name="edit" />
            </Button.Content>
          </Button>
        </Form>
        <ModalForm
          open={this.state.modal}
          onDeny={(_) => this.setState({ modal: false })}
          onAccept={this.handleDelete}
          title="Are you Sure ?!!"
          content="Delete Quiz will delete all questions inside it"
        />
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quiz: state.TeacherReducer.quiz,
    subjects: state.TeacherReducer.subjects,
    isAuthenticated: state.AuthReducer.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onGetQuiz: (slug) => dispatch(getQuiz(slug)),
    onUpdateQuiz: (name, subject, roll_out, training, time, slug) =>
      dispatch(updateQuiz(name, subject, roll_out, training, time, slug)),
    onDeleteQuiz: (slug) => dispatch(deleteQuiz(slug)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditQuiz);
