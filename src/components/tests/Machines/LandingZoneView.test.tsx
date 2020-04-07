import { Dictionary } from "../../../business/objects/dictionary";
import { Provider } from "react-redux";
import { Select } from "@material-ui/core";
import { UploadObjectContainer } from "../../../business/objects/job";
import { shallow } from "enzyme";
import Box from "@material-ui/core/Box";
import LandingZoneView from "../../Machines/LandingZone/LandingZoneView";
import React from "react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("LandingZone outside of station", () => {
  it("does display update running jobs limit if owner", () => {
    const componentProps = {
      machineStatus: "status",
      machineName: "name",
      machineId: "mid",
      memoryText: "memory",
      coresText: "cores",
      uploadText: "upload",
      inStation: true,
      showText: true,
      updateRunningJobLimit: jest.fn(),
      machineOwner: "machineOwner",
      machineCpu: "cpu",
      machineOS: "os",
      machineArch: "arch",
      machineJobsInQueue: 1,
      machineRunningJobsLimit: 1,
      machineRunninJobs: 1,
      currentUser: "machineOwner",
      handleHide: jest.fn()
    };
    const stationUploads: Dictionary<UploadObjectContainer> = {};
    const machineUploads: Dictionary<UploadObjectContainer> = {};
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({ progress: { stationUploads, machineUploads } });

    const landingZone = shallow(
      <Provider store={store}>
        <LandingZoneView {...componentProps} />
      </Provider>
    );
    expect(
      landingZone
        .childAt(0)
        .dive()
        .find(Select)
    ).toHaveLength(1);
  });

  it("does not display update running jobs limit if not owner", () => {
    const componentProps = {
      machineStatus: "status",
      machineName: "name",
      machineId: "mid",
      memoryText: "memory",
      coresText: "cores",
      uploadText: "upload",
      inStation: true,
      showText: true,
      updateRunningJobLimit: jest.fn(),
      machineOwner: "machineOwner",
      machineCpu: "cpu",
      machineOS: "os",
      machineArch: "arch",
      machineJobsInQueue: 1,
      machineRunningJobsLimit: 1,
      machineRunninJobs: 1,
      currentUser: "dummyString",
      handleHide: jest.fn()
    };
    const stationUploads: Dictionary<UploadObjectContainer> = {};
    const machineUploads: Dictionary<UploadObjectContainer> = {};
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({ progress: { stationUploads, machineUploads } });

    const landingZone = shallow(
      <Provider store={store}>
        <LandingZoneView {...componentProps} />
      </Provider>
    );
    expect(
      landingZone
        .childAt(0)
        .dive()
        .find(Select)
    ).toHaveLength(0);
  });
});
