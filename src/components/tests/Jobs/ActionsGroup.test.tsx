import {mount} from "enzyme";
import ActionsGroup, {ActionDisplay} from "../../Jobs/ActionsGroup";
import JobAction from "../../Jobs/JobAction";
import React from "react";

describe("ActionsGroup Component", () => {
  const componentProps = {
    display: ActionDisplay.downloadResults,
    jobId: "jobid",
    onClickDownload: jest.fn(),
    archiveJob: jest.fn(),
    isArchived: false,

    pauseJob: jest.fn(),
    stopJob: jest.fn(),
    startJob: jest.fn(),
    openProcessLog: jest.fn(),
    openStdoutLog: jest.fn()
  };

  // Create Downloads View
  const WrapperDownload = (props: any) => {
    return <ActionsGroup {...componentProps} />;
  };
  const actionsGroupDownload = mount(<WrapperDownload />);

  // Create Unarchive view
  componentProps.isArchived = true;
  const WrapperArchived = (props: any) => {
    return <ActionsGroup {...componentProps} />;
  };
  const actionsGroupArchived = mount(<WrapperArchived />);

  // Create In Progress View
  componentProps.display = ActionDisplay.inProgress;
  const WrapperInProgress = (props: any) => {
    return <ActionsGroup {...componentProps} />
  };
  const actionsGroupInProgress = mount(<WrapperInProgress />);

  // Create Paused View
  componentProps.display = ActionDisplay.paused;
  const WrapperPaused = (props: any) => {
    return <ActionsGroup {...componentProps} />
  };
  const actionsGroupsPaused = mount(<WrapperPaused />);

  it("Download results display should have the right elements", () => {
    expect(actionsGroupDownload.find(JobAction)).toHaveLength(2);
    expect(actionsGroupDownload.find("button")).toHaveLength(2);
  });

  it("Download results display should call the right functions", () => {
    actionsGroupDownload.find("button").at(0).simulate("click");
    expect(actionsGroupDownload.childAt(0).props().onClickDownload).toHaveBeenCalled();
    actionsGroupDownload.find("button").at(1).simulate("mouseup");
    expect(actionsGroupDownload.childAt(0).props().archiveJob).toHaveBeenCalled();
  });

  it("Download results archived view should have the right elements", () => {
    actionsGroupArchived.find("button").at(1).simulate("mouseup");
    expect(actionsGroupDownload.childAt(0).props().archiveJob).toHaveBeenCalled();
  });

  it("In progress display should have the right elements", () => {
    expect(actionsGroupInProgress.find(JobAction)).toHaveLength(4);
    expect(actionsGroupInProgress.find("button")).toHaveLength(4);
  });

  it("In progress display should call the right functions", () => {
    actionsGroupInProgress.find("button").at(0).simulate("click");
    expect(actionsGroupInProgress.childAt(0).props().pauseJob).toHaveBeenCalled();
    actionsGroupInProgress.find("button").at(1).simulate("click");
    expect(actionsGroupInProgress.childAt(0).props().stopJob).toHaveBeenCalled();
    actionsGroupInProgress.find("button").at(2).simulate("click");
    expect(actionsGroupInProgress.childAt(0).props().openProcessLog).toHaveBeenCalled();
    actionsGroupInProgress.find("button").at(3).simulate("click");
    expect(actionsGroupInProgress.childAt(0).props().openStdoutLog).toHaveBeenCalled();
  });

  it("Paused display should have the right elements", () => {
    expect(actionsGroupsPaused.find(JobAction)).toHaveLength(4);
    expect(actionsGroupsPaused.find("button")).toHaveLength(4);
  });

  it("Paused display should call the right functions", () => {
    actionsGroupsPaused.find("button").at(0).simulate("click");
    expect(actionsGroupsPaused.childAt(0).props().startJob).toHaveBeenCalled();
    actionsGroupsPaused.find("button").at(1).simulate("click");
    expect(actionsGroupsPaused.childAt(0).props().stopJob).toHaveBeenCalled();
    actionsGroupsPaused.find("button").at(2).simulate("click");
    expect(actionsGroupsPaused.childAt(0).props().openProcessLog).toHaveBeenCalled();
    actionsGroupsPaused.find("button").at(3).simulate("click");
    expect(actionsGroupsPaused.childAt(0).props().openStdoutLog).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    expect(actionsGroupDownload).toMatchSnapshot();
    expect(actionsGroupsPaused).toMatchSnapshot();
    expect(actionsGroupInProgress).toMatchSnapshot();
    expect(actionsGroupArchived).toMatchSnapshot();
  });
});
