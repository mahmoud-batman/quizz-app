import React, { Component, createRef } from "react";
// import ReactDOM from "react-dom";

import {
  Button,
  Divider,
  Form,
  Label,
  Radio,
  Table,
  Accordion,
  List,
  Sticky,
  Ref,
  Loader,
  Dimmer,
  Icon,
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  addQuestion,
  getQuestions,
  deleteQuestion,
} from "../store/actions/teacher";
import ModalForm from "./Modal";
import RichTextEditor from "./TextArea/TextArea";
import { localhost } from "../constants";
import Parser from "html-react-parser";
import { Link } from "react-router-dom";

// function convertToPlain(rtf) {
//   rtf = rtf.replace(/\\par[d]?/g, "");
//   return rtf
//     .replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "")
//     .trim();
// }
// function convertToRtf(plain) {
//   plain = plain.replace(/\n/g, "\\par\n");
//   return (
//     "{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang2057{\\fonttbl{\\f0\\fnil\\fcharset0 Microsoft Sans Serif;}}\n\\viewkind4\\uc1\\pard\\f0\\fs17 " +
//     plain +
//     "\\par\n}"
//   );
// }

class Questions extends Component {
  contextRef = createRef();

  state = {
    file: null,
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
    listeningTimeInput: false,
    time: 0,
    activeIndex: 0,
  };

  componentDidMount() {
    this.props.onGetQuizQuestions(this.props.match.params.slug);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleTextArea = (editor) => {
    this.setState({
      question: editor,
    });
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
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

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0], listeningTimeInput: true });
  };

  handleSubmit = () => {
    const { question, file, time } = this.state;
    const { slug } = this.props.match.params;
    const answers = [...this.state.answers];
    for (var i = 0; i < 4; i++) {
      answers.push(this.state[i]);
    }
    this.props.onAddQuizQuestion(slug, question, answers, time, file);
    document.question.reset(); // to reset the filename

    this.setState({
      file: null,
      question: "",
      answers: [],
      0: { text: "", is_correct: false },
      1: { text: "", is_correct: false },
      2: { text: "", is_correct: false },
      3: { text: "", is_correct: false },
      correct_answer: "",
      disabled: true,
      listeningTimeInput: false,
      time: 0,
    });
  };

  render() {
    const { questions } = this.props;
    const { activeIndex } = this.state;
    // const { slug } = this.props.match.params;
    const url = this.props.match.url;
    return (
      <>
        {/* <Link to="#Question-form">Tet</Link> */}
        <Sticky active={true} context={this.contextRef}>
          <a href="#Question-form">
            <Button circular icon="arrow down" />
          </a>
          <a href="#table-header">
            <Button circular icon="arrow up" />
          </a>
        </Sticky>
        {this.props.loading && (
          <Dimmer active>
            <Loader active inverted inline="centered" size="large" color="red">
              LOADING
            </Loader>
          </Dimmer>
        )}{" "}
        {questions.length !== 0 ? (
          <Ref innerRef={this.contextRef}>
            <Table celled>
              <Table.Header id="table-header">
                <Table.Row>
                  <Table.HeaderCell collapsing>NO.</Table.HeaderCell>
                  <Table.HeaderCell>Question</Table.HeaderCell>

                  <Table.HeaderCell collapsing>Edit </Table.HeaderCell>
                  <Table.HeaderCell collapsing>Delete </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {questions.map((question, index) => (
                  <Table.Row key={question.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell style={{ maxWidth: "500px" }}>
                      {/* {question.file != null && (
                        <audio controls style={{ width: "50vw" }}>
                          <source
                            src={`${localhost}/${question.file}`}
                            type="audio/mpeg"
                          />
                        </audio>
                      )} */}
                      {/*  <td
                              dangerouslySetInnerHTML={{
                                __html: question.text,
                              }}
                            /> */}
                      <Accordion styled>
                        {question.file != null && (
                          <>
                            <Label
                              color="blue"
                              // style={{ color: "#1890ff" }}
                              ribbon
                            >
                              <Icon name="time" />
                              {question.time} sec
                            </Label>
                            <audio controls style={{ width: "100%" }}>
                              <source
                                src={`${localhost}/${question.file}`}
                                type="audio/mpeg"
                              />
                            </audio>
                          </>
                        )}
                        <Accordion.Title
                          index={index}
                          active={activeIndex === index}
                          onClick={this.handleClick}
                        >
                          {Parser(question.text)}
                          {"   "}
                          <Label
                            basic
                            size="large"
                            circular
                            color="blue"
                            icon="dropdown"
                            // style={{ color: "#1890ff" }}
                          />
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                          <List>
                            {question.answers.map((answer) => (
                              <List.Item
                                key={answer.id}
                                icon={answer.is_correct ? "check" : "delete"}
                                content={answer.text}
                                style={
                                  answer.is_correct
                                    ? { color: "green" }
                                    : { color: "red" }
                                }
                              />
                            ))}
                          </List>
                        </Accordion.Content>
                      </Accordion>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`${url}/${question.id}/`}>
                        {/* <Link to={`${path}/${slug}/questions/${question.id}/`}> */}
                        <Button
                          color="blue"
                          // style={{ color: "#1890ff" }}
                          icon="edit"
                          circular
                          onClick={() =>
                            this.setState({
                              id: question.id,
                              modal: true,
                            })
                          }
                        />{" "}
                      </Link>
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
          </Ref>
        ) : (
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
        )}{" "}
        <Divider horizontal>Add New Question</Divider>
        <Form name="question" onSubmit={this.handleSubmit} id="Question-form">
          <Form.Field>
            <Form.Field>
              <Form.Input
                label="Upload Mp3 file"
                placeholder="Upload Mp3 file"
                width={16}
                type="file"
                accept=".mp3,audio/*"
                // value={this.state.file != null ? this.state.file.name : ""}
                onChange={this.handleFileChange}
              />
            </Form.Field>
            {this.state.listeningTimeInput && (
              <Form.Input
                label="Listening Question Time"
                placeholder="10 sec"
                min="1"
                type="number"
                width={10}
                name="time"
                value={this.state.time}
                onChange={this.handleChange}
              />
            )}
            {/* {!this.state.listeningTimeInput && (
              <Form.Field
                // style={{ maxLength: 150 }}
                label="Text Question"
                maxLength="2500"
                control="textarea"
                name="question"
                value={this.state.question}
                onChange={this.handleChange}
              />
            )} */}
            <RichTextEditor
              name="question"
              value={this.state.question}
              onChange={this.handleTextArea}
            />
          </Form.Field>
          <Label>Answers</Label>

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
    loading: state.TeacherReducer.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetQuizQuestions: (slug) => dispatch(getQuestions(slug)),
    onAddQuizQuestion: (slug, question, answers, time, file) =>
      dispatch(addQuestion(slug, question, answers, time, file)),
    onDeleteQuestion: (slug, id) => dispatch(deleteQuestion(slug, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
