import React, { Component } from "react";
import {
  Icon,
  Table,
  Form,
  TextArea,
  Button,
  Dropdown,
  Divider,
  Loader,
  Dimmer,
} from "semantic-ui-react";

import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getQuizes, getSubjects, setQuiz } from "../store/actions/teacher";
// import _ from "lodash";

class QuizesTable extends Component {
  state = {
    name: "",
    subject: "",
    loading: true,
  };

  componentDidMount() {
    // let quiz = this.props.onGetQuizes();
    this.props.onGetQuizes();

    // this.setState({
    //   loading: false,
    // });
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
      // console.log("error");
      value = null;
    }
    this.setState({
      subject: value,
    });
  };

  render() {
    const { quizes, isAuthenticated, subjects } = this.props;
    const path = this.props.match.path;
    // console.log(process.env);
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

    return (
      <>
        {this.props.loading && (
          <Dimmer active>
            <Loader active inverted inline="centered" size="large" color="red">
              LOADING
            </Loader>
          </Dimmer>
        )}
        {quizes.length !== 0 ? (
          <>
            {" "}
            <Divider horizontal>Quizes Table</Divider>
            <Table celled selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    {" "}
                    <Icon name="student" />
                    Training
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    <Icon name="clock" />
                    Minutes
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    {" "}
                    <Icon name="dashboard" />
                    Count
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    <Icon name="code" />
                    Code
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    {" "}
                    <Icon name="edit" />
                    Edit
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing>Questions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {quizes.map((quiz) => (
                  <Table.Row key={quiz.id}>
                    <Table.Cell>{quiz.name}</Table.Cell>
                    {quiz.roll_out ? (
                      <Table.Cell positive>
                        <Icon name="thumbs up" />
                        Approved
                      </Table.Cell>
                    ) : (
                      <Table.Cell negative>
                        <Icon name="thumbs down" />
                        Not Approved
                      </Table.Cell>
                    )}
                    {quiz.training ? (
                      <Table.Cell warning>
                        <Icon name="lock open" />
                        Training
                      </Table.Cell>
                    ) : (
                      <Table.Cell positive>
                        <Icon name="lock" />
                        Quiz
                      </Table.Cell>
                    )}
                    <Table.Cell>{quiz.time} </Table.Cell>
                    <Table.Cell>{quiz.questions_count}</Table.Cell>
                    <Table.Cell>{quiz.slug}</Table.Cell>
                    <Table.Cell>
                      <Link to={`${path}/${quiz.slug}/`}>
                        <Button circular icon="write" />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {/* <Link to={`${path}/${quiz.slug}/listening-questions`}>
                    </Link> */}
                      <Link to={`${path}/${quiz.slug}/questions`}>
                        <Button circular secondary icon="comment alternate" />
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
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
    loading: state.TeacherReducer.loading,
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
