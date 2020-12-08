import React, { Component } from "react";
import {
  Icon,
  Image,
  Menu,
  Form,
  Label,
  Button,
  // Dropdown,
  Divider,
  Grid,
  // Pagination,
  Segment,
  // Input,
  Header,
  Sidebar,
  Tab,
  Pagination,
} from "semantic-ui-react";

import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getUsers, setUser } from "../store/actions/teacher";
import _ from "lodash";
import UsersTable from "./UsersTable";

class Users extends Component {
  state = {
    name: "",
    visible: false,
    activePage: 1,
    is_teacher: false,
    is_staff: false,
    userType: "",
    first_name: "",
    second_name: "",
    password: "",
    user_id: "",
  };

  componentDidMount() {
    this.props.onGetUsers();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { first_name, second_name, user_id, password, userType } = this.state;
    switch (userType) {
      case "Student":
        this.props.onSetUser(first_name, second_name, password, user_id, false);
        this.setState({
          userType: "",
          first_name: "",
          second_name: "",
          password: "",
          user_id: "",
        });
        break;
      case "Teacher":
        this.props.onSetUser(first_name, second_name, password, user_id, true);
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
    // console.log(first_name, second_name, userType);
    // this.props.onSetQuiz(name, subject);
    // this.setState({
    //   name: "",
    //   subject: "",
    // });
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

  handleTabChange = (e) => {
    console.log("e");
  };

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

  render() {
    const { users, isAuthenticated } = this.props;
    const is_staff = localStorage.getItem("is_staff");

    const panes = [
      {
        menuItem: (
          <Menu.Item key="Students">
            Students
            <Label>
              {
                users.filter(
                  (user) => user.is_teacher === false && user.is_staff === false
                ).length
              }
            </Label>
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <UsersTable
              userType="Students"
              users={users.filter(
                (user) => user.is_teacher === false && user.is_staff === false
              )}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key="Teachers">
            Teachers
            <Label>
              {users.filter((user) => user.is_teacher === true).length}
            </Label>
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false}>
            <UsersTable
              userType="Teachers"
              users={users.filter((user) => user.is_teacher === true)}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key="Staff">
            Staff
            <Label>
              {users.filter((user) => user.is_staff === true).length}
            </Label>
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false}>
            <UsersTable
              userType="Staff"
              users={users.filter((user) => user.is_staff === true)}
            />
          </Tab.Pane>
        ),
      },
    ];

    const { activePage } = this.state;

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

    if (!isAuthenticated) {
      return <Redirect to={"/"} />;
    }

    return (
      <>
        {is_staff == "true" && (
          <Button
            basic
            color="green"
            icon="add"
            content="Add new user"
            onClick={(_) => this.setState({ visible: !this.state.visible })}
          />
        )}

        <Sidebar.Pushable as={Segment} style={{ overflow: "hidden" }}>
          <Sidebar
            as={Segment}
            width="wide"
            animation="slide along"
            direction="left"
            visible={this.state.visible}
          >
            {" "}
            <Segment inverted>
              <Form onSubmit={this.handleSubmit} inverted>
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    label="First name"
                    placeholder="First name"
                    name="first_name"
                    value={this.state.first_name}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    fluid
                    label="Last name"
                    placeholder="Last name"
                    name="second_name"
                    value={this.state.second_name}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    type="password"
                    label="Password"
                    placeholder="8-digits"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  <Form.Select
                    fluid
                    label="User type"
                    options={options}
                    placeholder="user type"
                    value={this.state.userType}
                    onChange={this.handleDropdownChange}
                  />
                </Form.Group>
                <Form.Input
                  fluid
                  label="Optional User ID"
                  placeholder="Optional User ID"
                  name="user_id"
                  value={this.state.user_id}
                  onChange={this.handleChange}
                />
                <Form.Field>
                  <Button animated="vertical" type="submit">
                    <Button.Content hidden>
                      <Icon name="add" />
                    </Button.Content>
                    <Button.Content visible>Add New User</Button.Content>
                  </Button>
                </Form.Field>
              </Form>
            </Segment>
          </Sidebar>
          <Sidebar.Pusher onClick={(_) => this.setState({ visible: false })}>
            {" "}
            <Tab
              // menu={{ pointing: true }}
              style={{ minHeight: "60vh" }}
              menu={{
                color: "black",
                inverted: true,
                attached: false,
                tabular: false,
                pointing: true,
              }}
              panes={is_staff == "false" ? [panes[0]] : panes}
            />
          </Sidebar.Pusher>
          {/* <Grid verticalAlign="middle">
            <Grid.Column>
              <Pagination
                activePage={activePage}
                onPageChange={this.handlePaginationChange}
                totalPages={5}
              />
            </Grid.Column>
          </Grid> */}
        </Sidebar.Pushable>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.TeacherReducer.users,
    subjects: state.TeacherReducer.subjects,
    isAuthenticated: state.AuthReducer.isAuthenticated,
    token: state.AuthReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetUsers: () => dispatch(getUsers()),
    onSetUser: (first_name, second_name, password, user_id, is_teacher) =>
      dispatch(setUser(first_name, second_name, password, user_id, is_teacher)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
