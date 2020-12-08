import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Typography } from "antd";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

class CustomLayout extends Component {
  render() {
    const { user, isAuthenticated } = this.props;

    return (
      <div>
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["1"]}
              style={{ lineHeight: "64px" }}
            >
              {isAuthenticated ? (
                <Menu.Item key="2" onClick={this.props.logout}>
                  Logout
                </Menu.Item>
              ) : (
                <Menu.Item key="2">
                  <NavLink to="/login/">Login</NavLink>
                </Menu.Item>
              )}

              <Menu.Item key="1">
                <NavLink to="/">Posts</NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <Text code style={{ color: "lightgrey" }}>
                  {user}
                </Text>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>
                <Link to="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/">List</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.AuthReducer.user,
    isAuthenticated: state.AuthReducer.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomLayout);
