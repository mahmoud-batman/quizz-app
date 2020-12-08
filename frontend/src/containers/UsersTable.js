import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import ModalForm from "./Modal";
import { deleteUser } from "../store/actions/teacher";
import { connect } from "react-redux";

class UsersTable extends Component {
  state = {
    activePage: 1,
    user_id: "",
    modal: false,
  };

  handleDelete = (user_id) => {
    this.props.onDeleteUser(user_id);
    this.setState({ modal: false });
  };

  render() {
    const { users, userType } = this.props;
    const { activePage } = this.state;

    return (
      <>
        {users.length != 0 ? (
          <>
            <Table celled color="blue" selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Delete</Table.HeaderCell>
                  {/* <Table.HeaderCell>Questions</Table.HeaderCell>
                  <Table.HeaderCell>Code</Table.HeaderCell>
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                  <Table.HeaderCell>Questions</Table.HeaderCell> */}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.user_id}</Table.Cell>
                    <Table.Cell>{user.fullname}</Table.Cell>
                    {!user.is_staff && (
                      <Table.Cell>
                        {" "}
                        <Button
                          basic
                          color="red"
                          icon="trash alternate"
                          circular
                          onClick={() =>
                            this.setState({
                              user_id: user.id,
                              modal: true,
                            })
                          }
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <ModalForm
              open={this.state.modal}
              onDeny={(_) => this.setState({ modal: false })}
              onAccept={() => this.handleDelete(this.state.user_id)}
              // title="Are you Sure ?!!"
              content="Are you Sure you want to delete this user ? "
            />
          </>
        ) : (
          <>
            <h3>No {userType}</h3>
          </>
        )}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteUser: (user_id) => dispatch(deleteUser(user_id)),
  };
};

export default connect(null, mapDispatchToProps)(UsersTable);
