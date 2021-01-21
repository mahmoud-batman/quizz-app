import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import "antd/dist/antd.css";
import Routes from "./routes";
import { checkAuth } from "./store/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class App extends Component {
  componentDidMount() {
    this.props.onCheckAuth();
  }

  render() {
    return (
      <div
        className="App"
        style={{
          background:
            "linear-gradient(rgba(83, 51, 237, 0.8), rgba(0,0,0, 0.8)), url('/assets/imgs/background.jpg')",
          minHeight: "100vh",
          height: "100%",
          width: "100%",
          backgroundPosition: "center",
        }}
      >
        <Routes />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.AuthReducer.user !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckAuth: () => dispatch(checkAuth()),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
