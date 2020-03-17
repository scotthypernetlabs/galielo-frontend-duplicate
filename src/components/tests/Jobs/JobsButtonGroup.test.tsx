import { mount } from "enzyme";
import JobsButtonGroup from "../../Jobs/JobsButtonGroup";
import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";

describe("JobsButtonGroup Component", () => {
  const componentProps = {
    toggleMode: jest.fn(),
    mode: true
  };

  const Wrapper = (props: any) => {
    return <JobsButtonGroup {...componentProps} />;
  };

  const jobsButtonGroup = mount(<Wrapper />);

  it("buttons should have the right text", () => {
    expect(jobsButtonGroup.find(ToggleButton)).toHaveLength(2);
    expect(
      jobsButtonGroup
        .find(ToggleButton)
        .at(0)
        .childAt(0)
        .text()
    ).toBe("Sent");
    expect(
      jobsButtonGroup
        .find(ToggleButton)
        .at(1)
        .childAt(0)
        .text()
    ).toBe("Received");
  });

  it("buttons should call toggleMode", () => {
    jobsButtonGroup
      .find(ToggleButton)
      .at(0)
      .simulate("click");
    expect(jobsButtonGroup.childAt(0).props().toggleMode).toHaveBeenCalled();
    jobsButtonGroup
      .find(ToggleButton)
      .at(1)
      .simulate("click");
    expect(jobsButtonGroup.childAt(0).props().toggleMode).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    expect(jobsButtonGroup).toMatchSnapshot();
  });
});
