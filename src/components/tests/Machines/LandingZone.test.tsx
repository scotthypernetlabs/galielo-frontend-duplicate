import { Dictionary } from "../../../business/objects/dictionary";
import { Machine } from "../../../business/objects/machine";
import { Provider } from "react-redux";
import { UploadObjectContainer } from "../../../business/objects/job";
import { shallow } from "enzyme";
import LandingZone from "../../Machines/LandingZone/LandingZone";
import React from "react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("LandingZone outside of station", () => {
  const stationUploads: Dictionary<UploadObjectContainer> = {};
  const machineUploads: Dictionary<UploadObjectContainer> = {};
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({ progress: { stationUploads, machineUploads } });
  const machine = new Machine(
    "test_machine",
    "hypernet",
    "online",
    "test_mid",
    "GPU",
    "1",
    "MacOS",
    "x64",
    "2",
    3,
    1,
    0
  );
  const landingZone = shallow(
    <Provider store={store}>
      <LandingZone
        machine={machine}
        station={false}
        fileUploadText="Testing..."
      />
    </Provider>
  );

  it("matches snapshot", () => {
    // Snapshot demo
    expect(landingZone).toMatchSnapshot();
  });
});
