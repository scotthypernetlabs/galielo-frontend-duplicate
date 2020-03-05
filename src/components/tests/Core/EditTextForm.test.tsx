import { Button, TextField } from "@material-ui/core";
import { mount, shallow } from "enzyme";
import EditTextForm from "../../Core/EditTextForm";
import React from "react";

describe("EditTextForm Component", () => {
  const componentProps = {
    name: "Testing",
    handleChange: jest.fn((e: any) => {
      componentProps.name = e.target.value;
    }),
    handleEditText: jest.fn(),
    handleDiscardText: jest.fn()
  };

  const Wrapper = (props: any) => {
    return <EditTextForm {...componentProps} />;
  };

  const editTextForm = mount(<Wrapper />);

  it("text field should call handleChange", () => {
    const newText = "RandomString";
    expect(editTextForm.childAt(0).props().name).toEqual(componentProps.name);
    expect(editTextForm.find(TextField)).toHaveLength(1);
    editTextForm
      .find("input")
      .simulate("change", { target: { value: newText } });
    expect(componentProps.handleChange).toHaveBeenCalled();
    expect(componentProps.name).toEqual(newText);
  });

  it("button 1 should call handleEditText", () => {
    expect(editTextForm.find(Button)).toHaveLength(2);
    editTextForm
      .find("button")
      .at(0)
      .simulate("click");
    expect(componentProps.handleEditText).toHaveBeenCalled();
  });

  it("button 2 should call handleDiscardText", () => {
    editTextForm
      .find("button")
      .at(1)
      .simulate("click");
    expect(componentProps.handleDiscardText).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    expect(editTextForm).toMatchSnapshot();
  });
});
