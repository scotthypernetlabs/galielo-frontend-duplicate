import { mount } from "enzyme";
import ButtonGroup from "../../Jobs/ButtonGroup";
import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";

describe("ButtonGroup Component", () => {
  const componentProps = {
    toggleMode: jest.fn(),
    mode: true
  };

  const Wrapper = (props: any) => {
    return <ButtonGroup {...componentProps} />;
  };

  const ButtonGroup = mount(<Wrapper />);

  it("buttons should have the right text", () => {
    expect(ButtonGroup.find(ToggleButton)).toHaveLength(2);
    expect(
      ButtonGroup.find(ToggleButton)
        .at(0)
        .childAt(0)
        .text()
    ).toBe("Sent");
    expect(
      ButtonGroup.find(ToggleButton)
        .at(1)
        .childAt(0)
        .text()
    ).toBe("Received");
  });

  it("buttons should call toggleMode", () => {
    ButtonGroup.find(ToggleButton)
      .at(0)
      .simulate("click");
    expect(ButtonGroup.childAt(0).props().toggleMode).toHaveBeenCalled();
    ButtonGroup.find(ToggleButton)
      .at(1)
      .simulate("click");
    expect(ButtonGroup.childAt(0).props().toggleMode).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    expect(ButtonGroup).toMatchSnapshot();
  });
});
