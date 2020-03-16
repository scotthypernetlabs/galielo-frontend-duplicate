import { Fab, Icon, Tooltip } from "@material-ui/core";
import { linkBlue } from "../../theme";
import { mount } from "enzyme";
import AddCircleOutlineIcon from "@material-ui/core/SvgIcon/SvgIcon";
import JobAction from "../../Jobs/JobAction";
import React from "react";

describe("JobsAction Component", () => {
  const componentProps = {
    id: "Random id",
    action: jest.fn(),
    onMouseUp: jest.fn(),
    toolTipText: "Testing with Add circle",
    icon: <AddCircleOutlineIcon />,
    iconSize: "sm",
    color: linkBlue
  };

  const Wrapper = (props: any) => {
    return <JobAction {...componentProps} />;
  };

  const jobAction = mount(<Wrapper />);

  it("should have all the correct elements", () => {
    expect(jobAction.find(Tooltip).props().title).toBe(
      componentProps.toolTipText
    );
    expect(jobAction.find(Fab).props().style.backgroundColor).toBe(
      componentProps.color.background
    );
    expect(jobAction.find(Icon).props().style.color).toBe(
      componentProps.color.main
    );
  });

  it("button should call action()", () => {
    jobAction.find(Fab).simulate("click");
    expect(jobAction.childAt(0).props().action).toHaveBeenCalled();
  });

  it("button should call mouseUp()", () => {
    jobAction.find(Fab).simulate("mouseup");
    expect(jobAction.childAt(0).props().onMouseUp).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    expect(jobAction).toMatchSnapshot();
  });
});
