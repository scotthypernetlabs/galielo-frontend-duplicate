import * as React from "react";
import renderer from "react-test-renderer";

import Machines from "./Machines";

it('renders correctly', () => {
  const tree = renderer.create(<Machines />).toJSON()
  expect(tree).toMatchSnapshot()
})