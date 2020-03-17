import { Box, Button, Grid } from "@material-ui/core";
import { mount } from "enzyme";
import BoxHover from "../../Core/BoxHover";
import React from "react";

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

  componentProps.hover = false;

  const WrapperNoHover = (props: any) => {
    return <BoxHover {...componentProps} />;
  };

  const boxNoHover = mount(<WrapperNoHover />);

  it("buttons should have the right text", () => {
    expect(boxHover.find(Button)).toHaveLength(2);
    expect(
      boxHover
        .find(Button)
        .at(0)
        .childAt(0)
        .text()
    ).toBe(componentProps.textButton1);
    expect(
      boxHover
        .find(Button)
        .at(1)
        .childAt(0)
        .text()
    ).toBe(componentProps.textButton2);
  });

  it("first button should call onClickButton1", () => {
    boxHover
      .find(Button)
      .at(0)
      .simulate("click");
    expect(boxHover.childAt(0).props().onClickButton1).toHaveBeenCalled();
  });

  it("second button should call onClickButton2", () => {
    boxHover
      .find(Button)
      .at(1)
      .simulate("click");
    expect(boxHover.childAt(0).props().onClickButton2).toHaveBeenCalled();
  });

  it("no hover should have no buttons", () => {
    expect(
      boxNoHover
        .find(Box)
        .at(0)
        .props().display
    ).toBe("none");
  });

  it("should match snapshot", () => {
    expect(boxHover).toMatchSnapshot();
  });
});
