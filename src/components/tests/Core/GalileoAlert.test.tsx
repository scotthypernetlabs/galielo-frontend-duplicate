import { Alert } from "@material-ui/lab";
import { Link } from "@material-ui/core";
import { mount } from "enzyme";
import GalileoAlert from "../../Core/GalileoAlert";
import React from "react";

describe("DialogTitle Component", () => {
  const componentProps = {
    message: "MockInvitation",
    onClickAccept: jest.fn(),
    onClickDecline: jest.fn()
  };

  const Wrapper = (props: any) => {
    return <GalileoAlert {...componentProps} />;
  };

  const galileoAlert = mount(<Wrapper />);

  it("should have the right alert", () => {
    expect(
      galileoAlert
        .find(Alert)
        .childAt(0)
        .childAt(0)
        .text()
    ).toEqual(`${componentProps.message}AcceptDecline`);
  });
  it("should call onClickAccept", () => {
    expect(
      galileoAlert
        .find(Link)
        .at(0)
        .text()
    ).toEqual("Accept");

    galileoAlert
      .find(Link)
      .at(0)
      .simulate("click");

    expect(galileoAlert.childAt(0).props().onClickAccept).toHaveBeenCalled();
  });
  it("should call onClickDecline", () => {
    expect(
      galileoAlert
        .find(Link)
        .at(1)
        .text()
    ).toEqual("Decline");
    galileoAlert
      .find(Link)
      .at(1)
      .simulate("click");
    expect(galileoAlert.childAt(0).props().onClickDecline).toHaveBeenCalled();
  });
});
