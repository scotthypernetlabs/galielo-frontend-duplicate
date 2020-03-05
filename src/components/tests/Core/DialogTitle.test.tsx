import { IconButton, Typography } from "@material-ui/core";
import { mount } from "enzyme";
import DialogTitle from "../../Core/DialogTitle/DialogTitle";
import React from "react";

describe("DialogTitle Component", () => {
  const componentProps = {
    title: "Testing Title",
    handleClose: jest.fn()
  };

  const Wrapper = (props: any) => {
    return <DialogTitle {...componentProps} />;
  };

  const dialogTitle = mount(<Wrapper />);

  it("should display title", () => {
    expect(dialogTitle.find(Typography)).toHaveLength(1);
    expect(
      dialogTitle
        .find(Typography)
        .childAt(0)
        .text()
    ).toEqual(componentProps.title);
  });

  it("icon should call on click", () => {
    expect(dialogTitle.find(IconButton)).toHaveLength(1);
    dialogTitle.find(IconButton).simulate("click");
    expect(dialogTitle.childAt(0).props().handleClose).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    expect(dialogTitle).toMatchSnapshot();
  });
});
