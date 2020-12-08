import React from "react";
import { Layout, Menu, Row, Col } from "antd";
// import QuestionLayout from "./QuestionLayout";
import QuizCodeForm from "./QuizCodeForm";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { Label, Icon } from "semantic-ui-react";
const { Header, Content, Footer } = Layout;

class FixedMenuLayout extends React.Component {
  render() {
    // console.log(this.props.match.params.id);
    const { isAuthenticated, email } = this.props;

    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            {isAuthenticated ? (
              <>
                <Menu.Item style={{ float: "right" }}>
                  <Link to="/login" onClick={(_) => this.props.logout()}>
                    <Icon name="sign-out" color="grey" inverted size="large" />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Label as="a" basic image>
                    <img src="/assets/imgs/avatar.jpg" />
                    {email}
                  </Label>
                </Menu.Item>
              </>
            ) : (
              <Menu.Item style={{ float: "right" }}>
                <Link to="/login">Login</Link>
              </Menu.Item>
            )}
          </Menu>
        </Header>
        <Content>{this.props.children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.AuthReducer.isAuthenticated,
    email: state.AuthReducer.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FixedMenuLayout);
