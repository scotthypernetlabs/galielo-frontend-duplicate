import { Variant } from "../../Core/IconText";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { galileoDarkBlue } from "../../theme";
import { mount } from "enzyme";
import AddCircleOutlineIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Header from "../../Core/Header/Header";
import React from "react";

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
    buttonText: "Button Text"
  };

  const Wrapper = (props: any) => {
    return <Header {...componentProps} />;
  };

  const header = mount(<Wrapper />);

  it("should call onClickButton", () => {
    header.find("button").at(1).simulate("click");
    expect(componentProps.onClickButton).toHaveBeenCalled();
  });

  it("should call onClickSecondaryIcon", () => {
    header.find("button").at(0).simulate("click");
    expect(componentProps.onClickSecondaryIcon).toHaveBeenCalled();
  });


  it("should match snapshot", () => {
    expect(header).toMatchSnapshot();
  });
});
