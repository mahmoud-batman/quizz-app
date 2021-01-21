import React, { Component } from "react";
import { Container, Segment } from "semantic-ui-react";

class StudentLayout extends Component {
  render() {
    return (
      <Segment
        raised
        compact
        color="black"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10%",
          marginLeft: "5%",
          marginRight: "5%",
          // height: "100%",
        }}
      >
        <Container>{this.props.children}</Container>
      </Segment>
    );
  }
}
export default StudentLayout;
