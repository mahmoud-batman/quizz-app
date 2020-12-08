import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { authLogin } from "../store/actions/auth";

class LoginForm extends React.Component {
  state = {
    email: "",
    password: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.onAuth(email, password);
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
            <Header as="h2" color="blue" textAlign="center">
              Log-in to your account
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
                  color="blue"
                  fluid
                  size="large"
                  type="submit"
                  loading={loading}
                >
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us ? <Link to="/signup">Sign Up</Link>
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
    isAuthenticated: state.AuthReducer.isAuthenticated,
    isTeacher: state.AuthReducer.isTeacher,
    email: state.AuthReducer.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(authLogin(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
