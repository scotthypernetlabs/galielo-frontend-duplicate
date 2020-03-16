import { mount } from "enzyme";
import React from "react";
import SingleTextField from "../../Core/SingleTextField";

describe("DoubleInputForm Component", () => {
  const componentProps = {
    textFieldValue: "Text1",
    onChange: jest.fn((e: any) => {
      componentProps.textFieldValue = e.target.value;
    }),
    textFieldPlaceholder: "Placeholder1",
    textFieldLabel: "Label1",
    onClick: jest.fn(),
    buttonText: "ButtonText",
    buttonDisabled: false
  };

  const Wrapper = (props: any) => {
    return <SingleTextField {...componentProps} />;
  };

  const singleTextField = mount(<Wrapper />);

  it("should have the right labels and placeholders", () => {
    expect(singleTextField.childAt(0).props().textFieldPlaceholder).toEqual(
      componentProps.textFieldPlaceholder
    );
    expect(singleTextField.childAt(0).props().textFieldLabel).toEqual(
      componentProps.textFieldLabel
    );
    expect(singleTextField.childAt(0).props().buttonText).toEqual(
      componentProps.buttonText
    );
  });

  it("text field should call onChange", () => {
    const newText = "NewRandomText";
    expect(singleTextField.childAt(0).props().textFieldValue).toEqual(
      componentProps.textFieldValue
    );
    singleTextField
      .find("input")
      .simulate("change", { target: { value: newText } });
    expect(componentProps.onChange).toHaveBeenCalled();
    expect(componentProps.textFieldValue).toEqual(newText);
  });

  it("button should call onClick", () => {
    singleTextField.find("button").simulate("click");
    expect(componentProps.onClick).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    expect(singleTextField).toMatchSnapshot();
  });
});
