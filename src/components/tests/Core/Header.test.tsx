import { Variant } from "../../Core/IconText";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { galileoDarkBlue } from "../../theme";
import { mount } from "enzyme";
import AddCircleOutlineIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Header from "../../Core/Header";
import React from "react";
import { Typography } from "@material-ui/core";
import EditTextForm from "../../Core/EditTextForm";

describe("Header Component", () => {
  const variant: Variant = "h4";
  const componentProps = {
    icon: faCheck,
    title: "Testing Title",
    titleVariant: variant,
    textColor: galileoDarkBlue.main,
    iconColor: galileoDarkBlue.main,
    showSecondaryIcon: true,
    secondaryIcon: <AddCircleOutlineIcon />,
    onClickSecondaryIcon: jest.fn(),
    showButton: true,
    onClickButton: jest.fn(),
    buttonText: "Button Text",
    handleEditTitle: jest.fn(),
    submitEditTitle: jest.fn(),
    toggleEditTitle: jest.fn(),
    editTitle: true
  };

  const Wrapper = (props: any) => {
    return <Header {...componentProps} />;
  };

  const header = mount(<Wrapper />);

  componentProps.icon = undefined;
  const WrapperNoIcon = (props: any) => {
    return <Header {...componentProps} />;
  };
  const headerNoIcon = mount(<WrapperNoIcon />);

  componentProps.editTitle = false;
  const WrapperNoEdit = (props: any) => {
    return <Header {...componentProps} />;
  };
  const headerNoEdit = mount(<WrapperNoEdit />);

  it("should call onClickButton", () => {
    header.find("button").at(1).simulate("click");
    expect(componentProps.onClickButton).toHaveBeenCalled();
  });

  it("should call onClickSecondaryIcon", () => {
    header.find("button").at(0).simulate("click");
    expect(componentProps.onClickSecondaryIcon).toHaveBeenCalled();
  });

  it("should trigger the onEditText form", () => {
    headerNoIcon.find(Typography).at(0).simulate("click");
    expect(componentProps.toggleEditTitle).toHaveBeenCalled();
  });

  it("onEditText form should be present", () => {
    expect(headerNoIcon.find(EditTextForm)).toHaveLength(1);
    expect(headerNoIcon.find(EditTextForm).props().handleChange).toBe(componentProps.handleEditTitle);
    expect(headerNoIcon.find(EditTextForm).props().handleEditText).toBe(componentProps.submitEditTitle(true));
    expect(headerNoIcon.find(EditTextForm).props().handleDiscardText).toBe(componentProps.submitEditTitle(false));
  });

  it("title should be present if not editing", () => {
    headerNoEdit.find(Typography).at(0).simulate("click");
    expect(headerNoEdit.find(EditTextForm)).toHaveLength(0);
    expect(headerNoEdit.find(Typography).childAt(0).text()).toBe(componentProps.title);
  });

  it("should match snapshot", () => {
    expect(header).toMatchSnapshot();
  });
});
