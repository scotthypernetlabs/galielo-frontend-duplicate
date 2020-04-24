import { IconButton, Select } from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { StationsSortOptions } from "../../../api/objects/station";
import { User } from "../../../business/objects/user";
import { createMemoryHistory } from "history";
import { shallow } from "enzyme";
import React from "react";
import StationsView from "../../Stations/Stations/StationsView";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("Stations View", () => {
  const mockStore = configureMockStore([thunk]);
  const history = createMemoryHistory();
  const stations = [
    new Station(
      "stationid1",
      ["1"],
      ["1"],
      "a",
      "description",
      [],
      [],
      "2020-03-26T17:45:48+0000",
      "2020-03-18T16:45:48+0000",
      ["1", "2", "3"],
      ["mid1"],
      []
    ),
    new Station(
      "stationid2",
      ["2"],
      ["2"],
      "b",
      "description",
      [],
      [],
      "2020-03-25T17:45:48+0000",
      "timestamp2",
      ["2", "1"],
      ["mid1", "mid2", "mid3"],
      []
    ),
    new Station(
      "stationid1",
      ["3"],
      ["3"],
      "c",
      "description",
      [],
      [],
      "2020-03-18T17:45:48+0000",
      "timestamp2",
      ["3"],
      ["mid1"],
      []
    )
  ];

  const currentUser = new User("1", "test", [], []);

  const componentProps = {
    slice: false,
    openCreateStation: jest.fn(),
    history: history,
    stations: stations,
    currentUser: currentUser,
    onSelectChange: jest.fn(),
    setOrder: jest.fn(),
    onInputChange: jest.fn()
  };
  const stationsView = shallow(<StationsView {...componentProps} />);

  it("Changing to sort by last updated", () => {
    expect(stationsView.find(Select)).toHaveLength(1);
    stationsView
      .find(Select)
      .simulate("change", { target: { value: StationsSortOptions.last_used } });
    expect(componentProps.onSelectChange).toHaveBeenCalledWith(
      StationsSortOptions.last_used,
      "desc"
    );
  });

  it("Changing to sort by name", () => {
    stationsView
      .find(Select)
      .simulate("change", { target: { value: StationsSortOptions.name } });
    expect(componentProps.onSelectChange).toHaveBeenCalledWith(
      StationsSortOptions.name,
      "desc"
    );
  });

  it("Changing to sort by created", () => {
    stationsView
      .find(Select)
      .simulate("change", { target: { value: StationsSortOptions.created } });
    expect(componentProps.onSelectChange).toHaveBeenCalledWith(
      StationsSortOptions.created,
      "desc"
    );
  });

  it("Changing to sort by # machines", () => {
    stationsView
      .find(Select)
      .simulate("change", { target: { value: StationsSortOptions.machines } });
    expect(componentProps.onSelectChange).toHaveBeenCalledWith(
      StationsSortOptions.machines,
      "desc"
    );
  });

  it("Changing to sort by # launchers", () => {
    stationsView
      .find(Select)
      .simulate("change", { target: { value: StationsSortOptions.launchers } });
    expect(componentProps.onSelectChange).toHaveBeenCalledWith(
      StationsSortOptions.launchers,
      "desc"
    );
  });

  it("Clicking on asc/desc order button", () => {
    stationsView.find(IconButton).simulate("click");
    expect(componentProps.setOrder).toHaveBeenCalledWith("asc");
    stationsView.find(IconButton).simulate("click");
    expect(componentProps.setOrder).toHaveBeenCalledWith("desc");
  });

  it("matches snapshot", () => {
    // Snapshot demo
    expect(stationsView).toMatchSnapshot();
  });
});
