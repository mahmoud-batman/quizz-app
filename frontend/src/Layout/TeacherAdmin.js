import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
// import TableExamplePadded from "./QuizesTable";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
// import SiderDemo from "./containers/TeacherAdmin";
// import QuizCodeForm from "./containers/QuizCodeForm";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class TeacherAdmin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { isTeacher, isAuthenticated } = this.props;
    const path = this.props.match.path;

    const is_Teacher = localStorage.getItem("is_teacher");
    const is_staff = localStorage.getItem("is_staff");

    if (!is_Teacher || !isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{ backgroundColor: "black" }}
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            {is_Teacher == "true" && (
              <>
                <Menu.Item key="1" icon={<FileOutlined />}>
                  <Link to={`${path}/quizes/`}>Quizes</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<TeamOutlined />}>
                  <Link to={`${path}/quiztaker/`}>Quiz Taker</Link>
                </Menu.Item>
              </>
            )}
            <Menu.Item key="3" icon={<TeamOutlined />}>
              <Link to={`${path}/users/`}>Users</Link>
            </Menu.Item>
            {/* <SubMenu key="sub1" icon={<TeamOutlined />} title="Users">
              <Menu.Item key="3">
                {" "}
                <Link to={`${path}/users/students`}>Students</Link>
              </Menu.Item>
              {is_staff == "true" && (
                <>
                  <Menu.Item key="4">
                    <Link to={`${path}/users/teachers`}>Teachers</Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to={`${path}/users/staff`}>Staff</Link>
                  </Menu.Item>
                </>
              )}
            </SubMenu> */}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            ©2020 Created by Mahmoud Mostafa
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.AuthReducer.loading,
    error: state.AuthReducer.error,
    isAuthenticated: state.AuthReducer.isAuthenticated,
    isTeacher: state.AuthReducer.isTeacher,
    // email: state.AuthReducer.email,
  };
};

export default withRouter(connect(mapStateToProps, null)(TeacherAdmin));
