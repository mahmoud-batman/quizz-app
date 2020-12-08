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
// import { setUser } from "../store/actions/teacher";
// import { authSignup } from "../store/actions/auth";

class SignupForm extends Component {
  state = {
    userType: "",
    first_name: "",
    second_name: "",
    password: "",
    user_id: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { first_name, second_name, user_id, password, userType } = this.state;
    switch (userType) {
      case "Student":
        this.props.onAuthSignup(
          first_name,
          second_name,
          password,
          user_id,
          false
        );
        this.setState({
          userType: "",
          first_name: "",
          second_name: "",
          password: "",
          user_id: "",
        });
        break;
      case "Teacher":
        this.props.onAuthSignup(
          first_name,
          second_name,
          password,
          user_id,
          true
        );
        this.setState({
          userType: "",
          first_name: "",
          second_name: "",
          password: "",
          user_id: "",
        });
        break;
      default:
        return;
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleDropdownChange = (e) => {
    const value = e.target.innerText;
    this.setState({
      userType: value,
    });
  };

  render() {
    const { error, loading, isAuthenticated } = this.props;
    console.log(error);
    if (isAuthenticated) {
      return <Redirect to={"/"} />;
    }
    const options = [
      {
        key: 1,
        value: "Student",
        text: "Student",
      },
      {
        key: 2,
        text: "Teacher",
        value: "Teacher",
      },
    ];

    return (
      <Grid textAlign="center">
        <Grid.Row>
          <Image src="/assets/imgs/adc-gold.png" size="tiny" circular />
          {/* <Image src="/assets/imgs/adc-gold.jpeg" size="small" circular /> */}
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
              <Segment raised inverted>
                <Form.Input
                  fluid
                  icon="id badge"
                  iconPosition="left"
                  placeholder="ID Number"
                  name="user_id"
                  value={this.state.user_id}
                  onChange={this.handleChange}
                />{" "}
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="First Name"
                    name="first_name"
                    value={this.state.first_name}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Second Name"
                    name="second_name"
                    value={this.state.second_name}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Select
                  fluid
                  // label="User type"
                  options={options}
                  placeholder="user type"
                  value={this.state.userType}
                  onChange={this.handleDropdownChange}
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
    isAuthenticated: state.AuthReducer.isAuthenticated,
  };
};

const mapDistpatchToProps = (dispatch) => {
  return {
    onAuthSignup: (first_name, second_name, password, user_id, is_teacher) =>
      dispatch(
        authSignup(first_name, second_name, password, user_id, is_teacher)
      ),
  };
};

export default connect(mapStateToProps, mapDistpatchToProps)(SignupForm);
