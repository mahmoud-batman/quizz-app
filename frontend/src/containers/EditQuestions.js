import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Form, Label, Radio, Loader } from "semantic-ui-react";
import RichTextEditor from "./TextArea/TextArea";
import { editQuestion } from "../store/actions/teacher";
import axios from "axios";
import { quizurl } from "../constants";
// import { Redirect } from "react-router-dom";

export class EditQuestions extends Component {
  state = {
    file: { name: null },
    question: "",
    answers: [],
    0: { text: "", is_correct: false },
    1: { text: "", is_correct: false },
    2: { text: "", is_correct: false },
    3: { text: "", is_correct: false },
    correct_answer: "",
    // modal: false,
    // id: "",
    // activeIndex: 0,
    disableSubmit: true,
    disableFile: false,
    disableTextArea: false,
    time: 0,
    listeningTimeInput: false,
    showDeleteBtn: false,
  };

  componentDidMount() {
    const { slug, id } = this.props.match.params;
    /**
answers: (4) [{…}, {…}, {…}, {…}]
file: "/user_100002/2qccg/111_SVGwsWw.mp3"
id: 65
text: ""
time: 45
 */
    axios
      .get(`${quizurl}/${slug}/questions/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.setState({
          answers: res.data.answers,
          question: res.data.text,
        });
        // if (res.data.time) {
        //   this.setState({ time: res.data.time, listeningTimeInput: true });
        // }
        if (res.data.file) {
          this.setState({
            file: { name: res.data.file },
            disableTextArea: true,
            showDeleteBtn: true,
            time: res.data.time,
            listeningTimeInput: true,
          });
        }
        for (var i = 0; i < 4; i++) {
          this.setState({
            [i]: {
              id: res.data.answers[i].id,
              text: res.data.answers[i].text,
              is_correct: res.data.answers[i].is_correct,
            },
          });
          if (res.data.answers[i].is_correct) {
            this.setState({ correct_answer: i });
          }
        }
      })
      .catch((error) => console.log(error));
  }

  handleDeleteAudio = () => {
    this.setState({
      file: { name: null },
      time: 0,
      listeningTimeInput: false,
      showDeleteBtn: false,
      disableTextArea: false,
    });
    document.question.reset();
  };

  handleFileChange = (e) => {
    if (!e.target.files[0]) {
      this.setState({
        file: { name: null },
        // file: null,
        listeningTimeInput: false,
        showDeleteBtn: false,
        disableSubmit: false,
      });
    } else {
      this.setState({
        file: e.target.files[0],
        listeningTimeInput: true,
        showDeleteBtn: true,
        disableSubmit: false,
        disableTextArea: true,
      });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      disableSubmit: false,
    });
  };

  handleAnswer = (e) => {
    const { name, value } = e.target;
    //
    this.setState({
      [name]: {
        id: this.state[name].id,
        text: value,
        is_correct: this.state[name].is_correct,
      },
      disableSubmit: false,
    });
  };

  handleRadioChange = (i) => {
    for (var index = 0; index < 4; index++) {
      this.setState({
        [index]: {
          id: this.state[index].id,
          text: this.state[index].text,
          is_correct: false,
        },
        disableSubmit: false,
      });
    }
    const answer = this.state[i];
    answer.is_correct = true;
    this.setState({
      correct_answer: i,
      [i]: answer,
      disableSubmit: false,
    });
  };

  handleTextArea = (editor) => {
    if (editor === "<p><br></p>" || editor === "") {
      this.setState({
        question: "",
        disableSubmit: false,
        disableFile: false,
      });
    } else {
      this.setState({
        question: editor,
        disableSubmit: false,
        disableFile: true,
      });
    }
  };

  handleSubmit = () => {
    const { question, file, time } = this.state;
    const { slug, id } = this.props.match.params;
    const answers = [];
    for (var i = 0; i < 4; i++) {
      answers.push(this.state[i]);
    }

    this.props.onEditQuestion(slug, question, answers, time, file, id);

    document.question.reset(); // to reset the filename

    this.setState({
      file: { name: null },
      question: "",
      answers: [],
      0: { text: "", is_correct: false },
      1: { text: "", is_correct: false },
      2: { text: "", is_correct: false },
      3: { text: "", is_correct: false },
      correct_answer: "",
      disableSubmit: true,
      listeningTimeInput: false,
      showDeleteBtn: false,
    });

    // return <a href="/" />;
    return this.props.history.goBack();
  };

  render() {
    // const { slug, id } = this.props.match.params;
    const { question } = this.props;
    return (
      <div>
        {question ? (
          <Form name="question" onSubmit={this.handleSubmit} id="Question-form">
            <Form.Field>
              <Form.Field>
                <Form.Input
                  // label={this.state.file}
                  placeholder={this.state.file}
                  width={16}
                  type="file"
                  accept=".mp3,audio/*"
                  //   value={`${localhost}${this.state.file}`}
                  onChange={this.handleFileChange}
                  hidden={this.state.showDeleteBtn}
                  disabled={this.state.disableFile}
                />
              </Form.Field>
              <Button
                // basic
                hidden={!this.state.showDeleteBtn}
                color="red"
                icon="trash"
                label={this.state.file && this.state.file.name}
                circular
                onClick={this.handleDeleteAudio}
              />
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
              {!this.state.disableTextArea && (
                <RichTextEditor
                  name="question"
                  value={this.state.question}
                  onChange={this.handleTextArea}
                  disabled={true}
                />
              )}
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

            <Button type="submit" disabled={this.state.disableSubmit}>
              Submit
            </Button>
          </Form>
        ) : (
          <Loader active inline="centered" size="large" />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  question: state.TeacherReducer.question,
});

const mapDispatchToProps = (dispatch) => {
  return {
    // onGetQuizQuestions: (slug) => dispatch(getQuestions(slug)),

    onEditQuestion: (slug, question, answers, time, file, id) =>
      dispatch(editQuestion(slug, question, answers, time, file, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditQuestions);
