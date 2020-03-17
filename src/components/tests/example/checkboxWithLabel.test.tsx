import * as React from "react";
import { CheckboxWithLabel } from "./checkboxWithLabel";
import { shallow } from "enzyme";

test("CheckboxWithLabel changes the text after click", () => {
  const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="Off" />);

  // Interaction demo
  expect(checkbox.text()).toEqual("Off");
  checkbox.find("input").simulate("change");
  expect(checkbox.text()).toEqual("On");

  // Snapshot demo
  expect(shallow).toMatchSnapshot();
});
