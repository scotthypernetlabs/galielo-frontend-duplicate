import * as React from "react";
import renderer from "react-test-renderer";

import Stations from "./Stations";

it('renders correctly', () => {
  const tree = renderer.create(<Stations />).toJSON()
  expect(tree).toMatchSnapshot()
})