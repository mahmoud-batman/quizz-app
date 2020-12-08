import React from "react";
import { Button, Form } from "semantic-ui-react";

const FormExampleUnstackableGroup = () => (
  <Form style={{ padding: "10px" }}>
    <Form.TextArea label="Question" placeholder="Tell us more about you..." />
    <Form.Group widths={2}>
      <Form.Input label="A." placeholder="" />
      <Form.Field
        label="is correct"
        control="input"
        type="radio"
        name="htmlRadios"
      />
      <Form.Input label="B." placeholder="" />
      <Form.Field
        label="is correct"
        control="input"
        type="radio"
        name="htmlRadios"
      />
    </Form.Group>
    <Form.Group widths={2}>
      <Form.Input label="C." placeholder="" />
      <Form.Field
        label="is correct"
        control="input"
        type="radio"
        name="htmlRadios"
      />
      <Form.Input label="D." placeholder="" />
      <Form.Field
        label="is correct"
        control="input"
        type="radio"
        name="htmlRadios"
      />
    </Form.Group>
    <Button type="submit">Submit</Button>
  </Form>
);

export default FormExampleUnstackableGroup;
