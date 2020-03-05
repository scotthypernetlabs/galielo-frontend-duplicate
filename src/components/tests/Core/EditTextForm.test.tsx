import { Button, TextField } from "@material-ui/core";
import { mount } from "enzyme";
import EditTextForm from "../../Core/EditTextForm";
import React from "react";

describe("Edit text form", () => {
  const componentProps = {
    name: "Testing",
    handleChange: jest.fn((e: any) => {
      componentProps.name = e.target.value;
    }),
    handleEditName: jest.fn()
  };

  const Wrapper = (props: any) => {
    return <EditTextForm {...componentProps} />;
  };

  const editTextForm = mount(<Wrapper />);

  it("text field should call handleChange upon change", () => {
    const newText = "RandomString";
    expect(editTextForm.childAt(0).props().name).toEqual(componentProps.name);
    expect(editTextForm.find(TextField)).toHaveLength(1);
    editTextForm
      .find("input")
      .simulate("change", { target: { value: newText } });
    expect(componentProps.handleChange).toHaveBeenCalled();
    expect(componentProps.name).toEqual(newText);
  });

  it("button 1 should call handleClick", () => {
    expect(editTextForm.find(Button)).toHaveLength(2);
    editTextForm
      .find("button")
      .at(0)
      .simulate("click");
    expect(componentProps.handleEditName).toHaveBeenCalled();
  });

  it("button 2 should call handleClick", () => {
    editTextForm
      .find("button")
      .at(1)
      .simulate("click");
    expect(componentProps.handleEditName).toHaveBeenCalled();
  });
});
