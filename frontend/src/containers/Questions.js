import React, { Component } from "react";
import {
  Button,
  Divider,
  Form,
  Label,
  Radio,
  Table,
  Accordion,
  List,
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  addQuestion,
  getQuestions,
  deleteQuestion,
} from "../store/actions/teacher";
import ModalForm from "./Modal";

class Questions extends Component {
  state = {
    question: "",
    answers: [],
    0: { text: "", is_correct: false },
    1: { text: "", is_correct: false },
    2: { text: "", is_correct: false },
    3: { text: "", is_correct: false },
    correct_answer: "",
    disabled: true,
    modal: false,
    id: "",
  };

  componentDidMount() {
    this.props.onGetQuizQuestions(this.props.match.params.slug);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    console.log(this.state);
    this.setState({
      [name]: value,
    });
  };

  handleAnswer = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: { text: value },
    });
  };

  handleRadioChange = (i) => {
    for (var index = 0; index < 4; index++) {
      this.setState({
        [index]: { text: this.state[index].text, is_correct: false },
      });
    }
    const answer = this.state[i];
    answer.is_correct = true;
    this.setState({
      correct_answer: i,
      [i]: answer,
      disabled: false,
    });
  };

  handleDelete = (id) => {
    const { slug } = this.props.match.params;
    this.props.onDeleteQuestion(slug, id);
    this.setState({ modal: false });
  };

  handleSubmit = () => {
    const { question } = this.state;
    const { slug } = this.props.match.params;
    const answers = [...this.state.answers];
    for (var i = 0; i < 4; i++) {
      answers.push(this.state[i]);
    }
    console.log(this.state);
    this.props.onAddQuizQuestion(slug, question, answers);
    this.setState({
      question: "",
      answers: [],
      0: { text: "", is_correct: false },
      1: { text: "", is_correct: false },
      2: { text: "", is_correct: false },
      3: { text: "", is_correct: false },
      correct_answer: "",
      disabled: true,
    });
  };

  render() {
    const { questions } = this.props;
    // console.log(questions);
    return (
      <>
        {questions.length != 0 ? (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>NO.</Table.HeaderCell>
                <Table.HeaderCell>Text</Table.HeaderCell>
                <Table.HeaderCell collapsing>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {questions.map((question, index) => (
                <Table.Row key={question.id}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <Accordion
                      panels={[
                        {
                          key: 1,
                          title: `${question.text}`,
                          content: {
                            content: (
                              <List>
                                {question.answers.map((answer) => (
                                  <List.Item
                                    key={answer.id}
                                    icon={
                                      answer.is_correct ? "check" : "delete"
                                    }
                                    content={answer.text}
                                    style={
                                      answer.is_correct
                                        ? { color: "green" }
                                        : { color: "red" }
                                    }
                                  />
                                ))}
                              </List>
                            ),
                          },
                        },
                      ]}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <Button
                      basic
                      color="red"
                      icon="trash alternate"
                      circular
                      onClick={() =>
                        this.setState({
                          id: question.id,
                          modal: true,
                        })
                      }
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell> Questions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>No Question</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </>
        )}
        <Divider horizontal>Add New Question</Divider>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.Field
              // style={{ maxLength: 150 }}
              maxLength="250"
              control="textarea"
              name="question"
              value={this.state.question}
              onChange={this.handleChange}
            />
          </Form.Field>
          {[...Array(4)].map((_, i) => (
            <Form.Group widths="equal" key={i}>
              <Label>{i + 1}.</Label>
              <Form.Field
                control="input"
                name={i}
                value={this.state[i].text}
                onChange={this.handleAnswer}
              />
              <Radio
                label="Correct"
                name="radioGroup"
                checked={this.state.correct_answer === i}
                onChange={(_) => this.handleRadioChange(i)}
              />
            </Form.Group>
          ))}

          <Button type="submit" disabled={this.state.disabled}>
            Submit
          </Button>
        </Form>
        <ModalForm
          open={this.state.modal}
          onDeny={(_) => this.setState({ modal: false })}
          onAccept={() => this.handleDelete(this.state.id)}
          // title="Are you Sure ?!!"
          content="Are you Sure you want to delete this question ? "
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.TeacherReducer.questions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetQuizQuestions: (slug) => dispatch(getQuestions(slug)),
    onAddQuizQuestion: (slug, question, answers) =>
      dispatch(addQuestion(slug, question, answers)),
    onDeleteQuestion: (slug, id) => dispatch(deleteQuestion(slug, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
