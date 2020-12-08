import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Header,
  Button,
  Segment,
  Container,
  Image,
  Grid,
} from "semantic-ui-react";
import { connect } from "react-redux";
import QuizCodeForm from "../containers/QuizCodeForm";

class WelcomePage extends Component {
  render() {
    const { isAuthenticated } = this.props;

    const is_Teacher = localStorage.getItem("is_teacher");
    const is_staff = localStorage.getItem("is_staff");

    return (
      <Segment
        raised
        // color="red"
        inverted
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10%",
        }}
      >
        <Container>
          <Grid textAlign="center">
            <Image
              src="/assets/imgs/adc-gold.png"
              size="small"
              // circular
              style={{ marginTop: "25px" }}
            ></Image>
            <Grid.Row></Grid.Row>
          </Grid>
          <>
            <Header as="h2" inverted>
              Air Defense Institute English Lab{" "}
              <Header.Subheader>
                Language is “the infinite use of finite means.”
              </Header.Subheader>
            </Header>
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>{" "}
                <Link to="/signup">
                  <Button secondary>Sign Up</Button>
                </Link>
              </>
            ) : is_Teacher == "true" ? (
              <Redirect to={"teacher/quizes/"}></Redirect>
            ) : is_staff == "true" ? (
              <Redirect to={"teacher/users/"}></Redirect>
            ) : (
              <Redirect to={"student"}></Redirect>
            )}
          </>
        </Container>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.AuthReducer.isAuthenticated,
    isTeacher: state.AuthReducer.isTeacher,
  };
};

export default connect(mapStateToProps)(WelcomePage);
