import React, { Component } from "react";
import {
  Icon,
  Table,
  Form,
  TextArea,
  Button,
  Dropdown,
  Divider,
} from "semantic-ui-react";

import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getQuizes, getSubjects, setQuiz } from "../store/actions/teacher";
import _ from "lodash";
import Speech from "react-speech";

class QuizesTable extends Component {
  state = {
    name: "",
    subject: "",
  };

  componentDidMount() {
    this.props.onGetQuizes();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, subject } = this.state;
    this.props.onSetQuiz(name, subject);
    this.setState({
      name: "",
      subject: "",
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };
  handleDropdownChange = (e) => {
    let value = "";
    try {
      value = e.target.children[0].innerHTML;
    } catch (error) {
      console.log("error");
      value = null;
    }
    this.setState({
      subject: value,
    });
  };

  render() {
    const { quizes, isAuthenticated, subjects } = this.props;
    const path = this.props.match.path;

    const options =
      subjects &&
      subjects.map((subject) => {
        return {
          key: subject.id,
          text: subject.name,
          value: subject.name,
        };
      });

    if (!isAuthenticated) {
      return <Redirect to={"/"} />;
    }
    // const style = {
    //   play: {
    //     hover: {
    //       backgroundColor: "black",
    //       color: "white",
    //     },
    //     button: {
    //       width: "28",
    //       height: "28",
    //       cursor: "pointer",
    //       pointerEvents: "none",
    //       outline: "none",
    //       backgroundColor: "yellow",
    //       border: "solid 1px rgba(255,255,255,1)",
    //       borderRadius: 6,
    //       padding: "4",
    //       fontFamily: "Helvetica",
    //       fontSize: "1.0em",
    //       cursor: "pointer",
    //       pointerEvents: "none",
    //       outline: "none",
    //       backgroundColor: "inherit",
    //       border: "none",
    //     },
    //   },
    // };

    const style = {
      container: {},
      text: {},
      buttons: {},
      play: {
        hover: {
          backgroundColor: "GhostWhite",
        },
        button: {
          cursor: "pointer",
          pointerEvents: "none",
          outline: "none",
          backgroundColor: "Gainsboro",
          border: "solid 1px rgba(255,255,255,1)",
          borderRadius: 6,
        },
      },
      pause: {
        play: {},
        hover: {},
      },
      stop: {
        play: {
          hover: {},
          button: {},
        },
        resume: {
          play: {
            hover: {},
            button: {},
          },
        },
      },
    };

    return (
      <>
        {/* <Speech
          styles={style}
          textAsButton={true}
          displayText="Hello"
          text="I have text displayed as a button"
        /> */}
        <Speech
          text="I have altered my voice"
          voice="Google UK English Female"
        />
        {quizes.length != 0 ? (
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Training</Table.HeaderCell>
                <Table.HeaderCell>Time (Min)</Table.HeaderCell>
                <Table.HeaderCell>Questions</Table.HeaderCell>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
                <Table.HeaderCell>Questions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {quizes.map((quiz) => (
                <Table.Row key={quiz.id}>
                  <Table.Cell>{quiz.name}</Table.Cell>
                  {quiz.roll_out ? (
                    <Table.Cell positive>
                      <Icon name="checkmark" />
                      Approved
                    </Table.Cell>
                  ) : (
                    <Table.Cell negative>
                      <Icon name="close" />
                      Not Approved
                    </Table.Cell>
                  )}
                  {quiz.training ? (
                    <Table.Cell warning>
                      <Icon name="attention" />
                      Training
                    </Table.Cell>
                  ) : (
                    <Table.Cell positive>
                      <Icon name="checkmark" />
                      Quiz
                    </Table.Cell>
                  )}
                  <Table.Cell>{quiz.time} </Table.Cell>
                  <Table.Cell>{quiz.questions_count}</Table.Cell>
                  <Table.Cell>{quiz.slug}</Table.Cell>
                  <Table.Cell>
                    <Link to={`${path}/${quiz.slug}/`}>
                      <Button primary icon="edit" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`${path}/${quiz.slug}/questions`}>
                      <Button secondary icon="add" />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <>
            <h3>No Quizes yet</h3>
            <hr />
          </>
        )}
        <Divider horizontal>Add New Quiz</Divider>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field
            id="form-textarea-control-opinion"
            control={TextArea}
            // label="Quiz Name"
            placeholder="Quiz Name"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <Form.Field>
            {subjects && (
              <Dropdown
                selection
                options={options}
                placeholder="subject"
                name="subject"
                value={this.state.subject}
                onChange={this.handleDropdownChange}
              />
            )}
          </Form.Field>

          <Form.Field>
            <Button animated="vertical" type="submit">
              <Button.Content hidden>
                <Icon name="add" />
              </Button.Content>
              <Button.Content visible>Add Quiz</Button.Content>
            </Button>
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quizes: state.TeacherReducer.quizes,
    subjects: state.TeacherReducer.subjects,
    isAuthenticated: state.AuthReducer.isAuthenticated,
    token: state.AuthReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onAuth: (email, password) => dispatch(authLogin(email, password)),
    onGetQuizes: () => dispatch(getQuizes()),
    onGetSubjects: () => dispatch(getSubjects()),
    onSetQuiz: (name, subject) => dispatch(setQuiz(name, subject)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizesTable);
