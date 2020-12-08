import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { authSignup, resetError } from "../store/actions";

import { Form, Input, Icon, Button, Spin } from "antd";
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class RegistrationForm extends Component {
  state = {
    confirmDirty: false,
  };

  componentDidMount() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.props.history.push("/");
    }
    this.props.onResetError();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user !== "") {
      this.props.history.push("/");
    }
  }

  errorMessage = (error) => {
    const { status, data } = error.response;
    const emailError = data.email;
    if (status >= 400 && status < 500) {
      return <h3 style={{ color: "red" }}>{emailError}</h3>;
    } else if (status >= 500) {
      return <h3 style={{ color: "red" }}>Server Error</h3>;
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSignup(values.email, values.password, values.confirm);
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { error } = this.props;
    return (
      <>
        {" "}
        {error && this.errorMessage(error)}
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator("email", {
              rules: [
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email"
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>

          <FormItem>
            {this.props.loading ? (
              <Spin indicator={antIcon} />
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "10px" }}
              >
                Signup
              </Button>
            )}{" "}
            Or
            <NavLink style={{ marginRight: "10px" }} to="/login/">
              {" "}
              login
            </NavLink>
          </FormItem>
        </Form>{" "}
      </>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
  RegistrationForm
);

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
    onResetError: (_) => dispatch(resetError()),
  };
};

export default connect(
  mapStateToProps,
  mapDistpatchToProps
)(WrappedRegistrationForm);
