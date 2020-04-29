import * as React from "react";
import renderer from "react-test-renderer";

import Station from "./Station";


it('renders correctly', () => {
  const tree = renderer.create(<Station />).toJSON()
  expect(tree).toMatchSnapshot()
})