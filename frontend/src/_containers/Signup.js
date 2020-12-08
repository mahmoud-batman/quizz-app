import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { authSignup, resetError } from "../store/actions";

class SignupForm extends Component {
  state = {
    email: "",
    password: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.onSignup(email, password);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { error, loading } = this.props;
    const token = localStorage.getItem("token");

    if (token) {
      return <Redirect to={"/"} />;
    }

    return (
      <Grid textAlign="center">
        <Grid.Row>
          <Image src="/assets/imgs/adc-gold.jpeg" size="small" circular />
        </Grid.Row>

        {error ? (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>Enter correct email and password</p>
          </Message>
        ) : (
          ""
        )}
        <Grid.Row>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Create your account
            </Header>

            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="email"
                  value={this.state.name}
                  onChange={this.handleChange}
                />

                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  type="submit"
                  loading={loading}
                >
                  Sign Up
                </Button>
              </Segment>
            </Form>
            <Message>
              already have account ? <Link to="/login">Login</Link>
            </Message>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.AuthReducer.loading,
    error: state.AuthReducer.error,
    user: state.AuthReducer.user,
  };
};

const mapDistpatchToProps = (dispatch) => {
  return {
    onSignup: (email, password1, password2) =>
      dispatch(authSignup(email, password1, password2)),
  };
};

export default connect(mapStateToProps, mapDistpatchToProps)(SignupForm);
