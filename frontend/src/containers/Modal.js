import React from "react";
import { Button, Modal } from "semantic-ui-react";

export default function ModalForm({ open, onDeny, onAccept, title, content }) {
  return (
    <Modal
      dimmer="blurring"
      open={open}
      size="mini"
      //   onClose={() => dispatch({ type: "CLOSE_MODAL" })}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>{content}</Modal.Content>
      <Modal.Actions>
        <Button negative onClick={onDeny}>
          Disagree
        </Button>
        <Button positive onClick={onAccept}>
          Agree
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
