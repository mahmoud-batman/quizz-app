import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getListeningQuestions,
  addListeningQuestion,
  // deleteQuestion,
} from "../store/actions/teacher";
import {
  Button,
  Divider,
  Form,
  Label,
  Radio,
  Table,
  // Accordion,
  // List,
} from "semantic-ui-react";

// import ModalForm from "./Modal";
import { localhost } from "../constants";
// import axios from "axios";

export class ListeningQuestions extends Component {
  state = {
    file: null,
  };

  componentDidMount() {
    this.props.onGetQuizQuestions(this.props.match.params.slug);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { slug } = this.props.match.params;
    const { file } = this.state;
    this.props.onAddListeningQuestion(slug, file);
    this.setState({
      file: "",
    });
  };

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  render() {
    const { listening_questions } = this.props;
    return (
      <>
        {listening_questions.length != 0 ? (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>NO.</Table.HeaderCell>
                <Table.HeaderCell>Question.</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {listening_questions.map((question, index) => (
                <Table.Row key={question.id}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <audio controls>
                      <source
                        src={`${localhost}/${question.file}`}
                        type="audio/mpeg"
                      />
                    </audio>
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
            <Form.Input
              label="Upload Mp3 file"
              placeholder="Upload Mp3 file"
              width={16}
              type="file"
              accept=".mp3,audio/*"
              onChange={this.handleFileChange}
            />
          </Form.Field>
          {[...Array(4)].map((_, i) => (
            <Form.Group widths="equal" key={i}>
              <Label>{i + 1}.</Label>
              <Form.Field
                control="input"
                name={i}
                // value={this.state[i].text}
                // onChange={this.handleAnswer}
              />
              <Radio
                label="Correct"
                name="radioGroup"
                // checked={this.state.correct_answer === i}
                // onChange={(_) => this.handleRadioChange(i)}
              />
            </Form.Group>
          ))}

          <Button
            type="submit"
            // disabled={this.state.disabled}
          >
            Submit
          </Button>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  listening_questions: state.TeacherReducer.listening_questions,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onGetQuizQuestions: (slug) => dispatch(getListeningQuestions(slug)),
    onAddListeningQuestion: (slug, file) =>
      dispatch(addListeningQuestion(slug, file)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListeningQuestions);
