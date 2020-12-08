import React, { Component } from "react";
import {
  Table,
  Form,
  Button,
  Divider,
  Segment,
  Input,
  Label,
} from "semantic-ui-react";
import { Typography } from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  getQuizTaker,
  getQuiz,
  deleteQuizTaker,
} from "../store/actions/teacher";
import _ from "lodash";
import ModalForm from "./Modal";
import ReactToPrint from "react-to-print";

const { Text } = Typography;

class QuizTaker extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  state = {
    code: "",
    id: "",
  };

  //   handleSubmit = (e) => {
  //     e.preventDefault();
  //     const { name, subject } = this.state;
  //     this.props.onSetQuiz(name, subject);
  //     this.setState({
  //       name: "",
  //       subject: "",
  //     });
  //   };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = () => {
    const { code } = this.state;
    this.props.onGetQuiz(code);
    this.props.onGetQuizTaker(code);
  };

  handleDelete = (id) => {
    const { quiz } = this.props;
    this.props.onDeleteQuizTaker(quiz.slug, id);
    this.setState({ modal: false });
  };

  render() {
    const { quiztakers, isAuthenticated, quiz } = this.props;
    // const path = this.props.match.path;

    if (!isAuthenticated) {
      return <Redirect to={"/"} />;
    }
    return (
      <>
        <Form>
          <Form.Field inline>
            <Label>Enter Quiz Code </Label>
            <Input
              placeholder="Enter Quiz Code"
              name="code"
              vlaue={this.state.code}
              onChange={this.handleChange}
            />
            <Button
              icon="search"
              onClick={this.handleSubmit}
              disabled={this.state.code == ""}
            />
          </Form.Field>
        </Form>

        <Divider horizontal>Quiz Taker List</Divider>

        {quiztakers.length != 0 ? (
          <>
            <ReactToPrint
              trigger={() => (
                <Button icon="print" color="black" style={{ float: "right" }} />
              )}
              content={() => this.myRef.current}
            />{" "}
            <div ref={this.myRef}>
              <Table celled selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                    <Table.HeaderCell>Completed</Table.HeaderCell>
                    <Table.HeaderCell>Correct Answers</Table.HeaderCell>
                    <Table.HeaderCell>Precentage</Table.HeaderCell>
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {quiztakers.map((quiztaker) => (
                    <Table.Row key={quiztaker.id}>
                      <Table.Cell>{quiztaker.user.user_id}</Table.Cell>
                      <Table.Cell>{quiztaker.user.fullname}</Table.Cell>
                      <Table.Cell>{quiztaker.timestamp}</Table.Cell>
                      <Table.Cell
                        positive={quiztaker.completed}
                        negative={!quiztaker.completed}
                      >
                        {quiztaker.completed ? "Completed" : "Not Completed"}
                      </Table.Cell>
                      <Table.Cell>
                        {quiztaker.correct_answers} | {quiz.questions_count}
                      </Table.Cell>
                      <Table.Cell
                        positive={
                          (quiztaker.correct_answers / quiz.questions_count) *
                            100 >
                          50
                        }
                        negative={
                          (quiztaker.correct_answers / quiz.questions_count) *
                            100 <
                          50
                        }
                      >
                        <Text
                          code
                          strong
                          type={
                            (quiztaker.correct_answers / quiz.questions_count) *
                              100 >=
                            50
                              ? "success"
                              : "danger"
                          }
                        >
                          {Math.round(
                            (quiztaker.correct_answers / quiz.questions_count) *
                              100
                          )}
                          %
                        </Text>
                      </Table.Cell>
                      {/* {quiz.roll_out ? (
                    <Table.Cell positive>
                      <Icon name="checkmark" />
                      Approved
                    </Table.Cell>
                  ) : (
                    <Table.Cell negative>
                      <Icon name="close" />
                      Not Approved
                    </Table.Cell>
                  )} */}
                      {/* <Table.Cell>{quiz.questions_count}</Table.Cell>
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
                  </Table.Cell> */}
                      <Table.Cell>
                        {" "}
                        <Button
                          basic
                          color="red"
                          icon="trash alternate"
                          circular
                          onClick={() =>
                            this.setState({
                              id: quiztaker.id,
                              modal: true,
                            })
                          }
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </>
        ) : (
          <>
            {" "}
            <Segment>
              <h3>No Quiz Taker</h3>
            </Segment>
          </>
        )}

        {/* <Form onSubmit={this.handleSubmit}>
          <Form.Field
            id="form-textarea-control-opinion"
            control={Input}
            // label="Quiz Name"
            placeholder="Quiz Name"
            name="name"
            // value={this.state.name}
            // onChange={this.handleChange}
          />

          <Form.Field>
            <Button animated="vertical" type="submit">
              <Button.Content hidden>
                <Icon name="add" />
              </Button.Content>
              <Button.Content visible>Add Quiz</Button.Content>
            </Button>
          </Form.Field>
        </Form> */}

        <ModalForm
          open={this.state.modal}
          onDeny={(_) => this.setState({ modal: false })}
          onAccept={() => this.handleDelete(this.state.id)}
          // title="Are you Sure ?!!"
          content={`Are you Sure you want to delete this Quiz Taker ? `}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quiztakers: state.TeacherReducer.quiztaker,
    quiz: state.TeacherReducer.quiz,
    isAuthenticated: state.AuthReducer.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetQuizTaker: (slug) => dispatch(getQuizTaker(slug)),
    onGetQuiz: (slug) => dispatch(getQuiz(slug)),
    onDeleteQuizTaker: (slug, id) => dispatch(deleteQuizTaker(slug, id)),
    // onSetQuiz: (name, subject) => dispatch(setQuiz(name, subject)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizTaker);
