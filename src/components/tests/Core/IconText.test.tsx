import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@material-ui/core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { galileoTeal } from "../../theme";
import { mount } from "enzyme";
import IconText, { Variant } from "../../Core/IconText";
import React from "react";

describe("IconText Component", () => {
  const variant: Variant = "h4";
  const componentProps = {
    icon: faCheck,
    text: "Testing",
    textColor: galileoTeal.main,
    iconColor: galileoTeal.main,
    textVariant: variant
  };

  const Wrapper = (props: any) => {
    return <IconText {...componentProps} />;
  };

  const iconText = mount(<Wrapper />);

  it("the icon has been rendered", () => {
    expect(iconText.find(FontAwesomeIcon)).toHaveLength(1);
    expect(iconText.find(FontAwesomeIcon).props().icon).toEqual(
      componentProps.icon
    );
    expect(iconText.find(FontAwesomeIcon).props().style).toHaveProperty(
      "color",
      componentProps.iconColor
    );
  });

  it("the text has been rendered", () => {
    expect(iconText.find(Typography)).toHaveLength(1);
    expect(iconText.find(Typography).props().variant).toEqual(
      componentProps.textVariant
    );
    expect(
      iconText
        .find(Typography)
        .childAt(0)
        .text()
    ).toEqual(componentProps.text);
    expect(iconText.find(Typography).props().style).toHaveProperty(
      "color",
      componentProps.textColor
    );
  });

  it("should match snapshot", () => {
    expect(iconText).toMatchSnapshot();
  });
});
