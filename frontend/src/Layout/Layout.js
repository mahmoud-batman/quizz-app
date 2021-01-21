import React, { Component } from "react";

import { Button, Container, Grid, Icon, Menu, Image } from "semantic-ui-react";
import { Detector } from "react-detect-offline";

import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout, checkAuth } from "../store/actions/auth";
import { quizurl, localhost } from "../constants";

class Layout extends Component {
  state = {
    online: false,
    dropdownMenuStyle: {
      display: "none",
    },
  };

  componentDidMount() {
    this.props.checkauth();
    // console.log(window);
  }

  handleToggleDropdownMenu = () => {
    let newState = Object.assign({}, this.state);
    if (newState.dropdownMenuStyle.display === "none") {
      newState.dropdownMenuStyle = { display: "flex" };
    } else {
      newState.dropdownMenuStyle = { display: "none" };
    }

    this.setState(newState);
  };

  logout = () => {
    this.setState({
      dropdownMenuStyle: {
        display: "none",
      },
    });
    this.props.logout();
    this.props.history.push("/");
  };

  render() {
    const { isAuthenticated } = this.props;
    const full_name = localStorage.getItem("name");

    return (
      <>
        {console.log(localhost)}
        <Detector
          onChange={(_) => {
            fetch(
              `${quizurl}`,
              {
                headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`,
                },
              },
              {
                mode: "no-cors",
              }
            )
              .then(() => {
                console.log("CONNECTED TO INTERNET");
              })
              .catch((err) => {
                // finish quiz
                this.props.logout();
                this.props.history.push("/");
              });
          }}
          render={({ online }) => <></>}
        />
        <Grid padded className="tablet computer only">
          <Menu borderless fluid inverted size="huge">
            <Container>
              <Link as="a" to="/">
                <Menu.Item header>
                  <img alt="logo" src="/assets/imgs/adc-gold.png" /> &nbsp; Quiz
                  App
                </Menu.Item>
              </Link>

              {isAuthenticated && (
                <>
                  {/* {this.state.online && this.logout()} */}
                  <Menu.Item position="right">
                    <div>
                      <Image src="/assets/imgs/avatar.jpg" avatar />
                      <span> {full_name}</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    {/* <Detector
                      onChange={(_) =>
                        // this.setState({ online: !this.state.online })
                        fetch("https://www.google.com/", {
                          // Check for internet connectivity
                          mode: "no-cors",
                        })
                          .then(() => {
                            console.log("CONNECTED TO INTERNET");
                            this.props.logout();
                            this.setState({
                              online: true,
                            });
                          })
                          .catch(() => {
                            console.log("INTERNET CONNECTIVITY ISSUE");
                            this.setState({
                              online: false,
                            });
                          })
                      }
                      render={({ online }) => (
                        <>
                          <Label color={this.state.online ? "green" : "red"}>
                            {this.state.online ? "Online" : "Offline"}
                          </Label>
                        </>
                      )}
                    /> */}
                  </Menu.Item>
                  <Menu.Item as="a">
                    <Icon
                      name="sign-out"
                      color="grey"
                      inverted
                      size="large"
                      onClick={(_) => this.logout()}
                    />
                  </Menu.Item>
                </>
              )}
            </Container>
          </Menu>
        </Grid>
        <Grid padded className="mobile only">
          <Menu borderless fluid inverted size="huge">
            {/* <Link as="a" > */}
            <Menu.Item header>
              <img alt="logo" src="/assets/imgs/adc-gold.png" /> &nbsp; Quiz App
            </Menu.Item>{" "}
            {/* </Link> */}
            <Menu.Item></Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  icon
                  inverted
                  basic
                  toggle
                  onClick={this.handleToggleDropdownMenu}
                >
                  <Icon name="content" />
                </Button>
              </Menu.Item>
            </Menu.Menu>
            <Menu
              borderless
              fluid
              inverted
              vertical
              style={this.state.dropdownMenuStyle}
            >
              {isAuthenticated && (
                <>
                  <Menu.Item>
                    <div>
                      <Image src="/assets/imgs/avatar.jpg" avatar />
                      <span> {full_name}</span>
                    </div>
                  </Menu.Item>
                </>
              )}
              {/* <Menu.Item active as="a" href="#root">
                Home
              </Menu.Item>
              <Menu.Item as="a" href="#root">
                About
              </Menu.Item>
              <Menu.Item as="a" href="#root">
                Contact
              </Menu.Item> */}
              {isAuthenticated && (
                <>
                  <Menu.Item>
                    <Button
                      inverted
                      content="Signout"
                      icon="sign-out"
                      labelPosition="right"
                      onClick={(_) => this.logout()}
                    />
                  </Menu.Item>
                </>
              )}
            </Menu>
          </Menu>
        </Grid>

        {this.props.children}
      </>
      // </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.AuthReducer.isAuthenticated,
    full_name: state.AuthReducer.full_name,
    // email: state.AuthReducer.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout());
    },
    onLine: (online) => {
      dispatch(online(online));
    },
    checkauth: () => dispatch(checkAuth()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
