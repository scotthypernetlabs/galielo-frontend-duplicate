import { TextField } from "@material-ui/core";
import { mount } from "enzyme";
import DoubleInputForm from "../../Core/DoubleInputForm";
import React from "react";

describe("DoubleInputForm Component", () => {
  const componentProps = {
    textFieldValue1: "Text1",
    onChange1: jest.fn((e: any) => {
      componentProps.textFieldValue1 = e.target.value;
    }),
    textFieldPlaceholder1: "Placeholder1",
    textFieldLabel1: "Label1",
    textFieldValue2: "Text2",
    onChange2: jest.fn((e: any) => {
      componentProps.textFieldValue2 = e.target.value;
    }),
    textFieldPlaceholder2: "Placeholder2",
    textFieldLabel2: "Label2",
    checkBoxLabel: "Checkbox",
    checkBoxChecked: false,
    checkBoxOnChange: jest.fn(() => {
      componentProps.checkBoxChecked = !componentProps.checkBoxChecked;
    })
  };

  const Wrapper = (props: any) => {
    return <DoubleInputForm {...componentProps} />;
  };

  const doubleInputForm = mount(<Wrapper />);

  it("should have the right labels and placeholders", () => {
    expect(doubleInputForm.childAt(0).props().textFieldPlaceholder1).toEqual(
      componentProps.textFieldPlaceholder1
    );
    expect(doubleInputForm.childAt(0).props().textFieldLabel1).toEqual(
      componentProps.textFieldLabel1
    );
    expect(doubleInputForm.childAt(0).props().textFieldPlaceholder2).toEqual(
      componentProps.textFieldPlaceholder2
    );
    expect(doubleInputForm.childAt(0).props().textFieldLabel2).toEqual(
      componentProps.textFieldLabel2
    );
    expect(doubleInputForm.childAt(0).props().checkBoxLabel).toEqual(
      componentProps.checkBoxLabel
    );
  });

  it("text field 1 should call onChange1", () => {
    const newText = "ChangedText1";
    expect(doubleInputForm.childAt(0).props().textFieldValue1).toEqual(
      componentProps.textFieldValue1
    );
    expect(doubleInputForm.find(TextField)).toHaveLength(2);
    doubleInputForm
      .find("input")
      .at(0)
      .simulate("change", { target: { value: newText } });
    expect(componentProps.onChange1).toHaveBeenCalled();
    expect(componentProps.textFieldValue1).toEqual(newText);
  });

  it("text field 2 should call onChange2", () => {
    const newText = "ChangedText2";
    expect(doubleInputForm.childAt(0).props().textFieldValue2).toEqual(
      componentProps.textFieldValue2
    );
    doubleInputForm
      .find("input")
      .at(1)
      .simulate("change", { target: { value: newText } });
    expect(componentProps.onChange2).toHaveBeenCalled();
    expect(componentProps.textFieldValue2).toEqual(newText);
  });

  it("checkbox should call checkBoxOnChange", () => {
    const checkBoxBefore = componentProps.checkBoxChecked;
    expect(doubleInputForm.childAt(0).props().checkBoxChecked).toEqual(
      componentProps.checkBoxChecked
    );
    doubleInputForm
      .find("input")
      .at(2)
      .simulate("change");
    expect(componentProps.checkBoxOnChange).toHaveBeenCalled();
    expect(componentProps.checkBoxChecked).toEqual(!checkBoxBefore);
  });

  it("should match snapshot", () => {
    expect(doubleInputForm).toMatchSnapshot();
  });
});
