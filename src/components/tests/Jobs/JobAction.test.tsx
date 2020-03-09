import {mount} from "enzyme";
import React from "react";
import JobAction from "../../Jobs/JobAction";
import {linkBlue} from "../../theme";
import {Fab, Tooltip} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";

describe("JobsAction Component", () => {
  const componentProps = {
    id: "Random id",
    action: jest.fn(),
    onMouseUp: jest.fn(),
    toolTipText: "Testing with Add circle",
    icon: faCircle,
    iconSize: "sm",
    color: linkBlue
  };

  const Wrapper = (props: any) => {
    return <JobAction {...componentProps} />;
  };

  const jobAction = mount(<Wrapper />);

  it("should have all the correct elements", () => {
    expect(jobAction.find(Tooltip).props().title).toBe(componentProps.toolTipText);
    expect(jobAction.find(Fab).props().style.backgroundColor).toBe(componentProps.color.background);
    expect(jobAction.find(FontAwesomeIcon).props().icon).toBe(componentProps.icon);
    expect(jobAction.find(FontAwesomeIcon).props().style.color).toBe(componentProps.color.main);
    expect(jobAction.find(FontAwesomeIcon).props().size).toBe(componentProps.iconSize);
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
