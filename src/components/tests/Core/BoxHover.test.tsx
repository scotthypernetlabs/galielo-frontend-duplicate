import {Button} from "@material-ui/core";
import React from "react";
import { mount } from "enzyme";
import BoxHover from "../../Core/BoxHover";

describe("BoxHover Component", () => {
  const componentProps = {
    hover: true,
    onClickButton1: jest.fn(),
    onClickButton2: jest.fn(),
    textButton1: "Button1 Text",
    textButton2: "Button2 Text"
  };

  const Wrapper = (props: any) => {
    return <BoxHover {...componentProps} />;
  };

  const boxHover = mount(<Wrapper />);

  it("buttons should have the right text", () => {
    expect(boxHover.find(Button)).toHaveLength(2);
    expect(boxHover.find(Button).at(0).childAt(0).text()).toBe(componentProps.textButton1);
    expect(boxHover.find(Button).at(1).childAt(0).text()).toBe(componentProps.textButton2);
  });

  it("first button should call onClickButton1", () => {
    boxHover.find(Button).at(0).simulate("click");
    expect(boxHover.childAt(0).props().onClickButton1).toHaveBeenCalled()
  });

  it("second button should call onClickButton2", () => {
    boxHover.find(Button).at(1).simulate("click");
    expect(boxHover.childAt(0).props().onClickButton2).toHaveBeenCalled()
  });

  it("should match snapshot", () => {
    expect(boxHover).toMatchSnapshot();
  });
});
