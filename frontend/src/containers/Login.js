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
    user_id: "",
    password: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { user_id, password } = this.state;
    this.props.onAuth(user_id, password);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { error, loading, isAuthenticated } = this.props;

    if (isAuthenticated) {
      return <Redirect to={"/"} />;
    }

    return (
      <Grid textAlign="center">
        <Grid.Row>
          <Image src="/assets/imgs/adc-gold.png" size="small" circular />
          {/* <Image src="/assets/imgs/adc-gold.jpeg" size="small" circular /> */}
        </Grid.Row>

        {error ? (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>Enter correct user_id and password</p>
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
              <Segment raised inverted>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="ID Number"
                  name="user_id"
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
    user_id: state.AuthReducer.user_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (user_id, password) => dispatch(authLogin(user_id, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
