import { Dictionary } from "../../../business/objects/dictionary";
import { Route } from "react-router-dom";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import { createLocation, createMemoryHistory } from "history";
import { match } from "react-router";
import { shallow } from "enzyme";
import React from "react";
import Stations from "../../Stations/Stations/Stations";

describe("Stations View", () => {
  const stations: Station[] = [
    new Station(
      "stationid1",
      ["1"],
      ["1"],
      ["1", "2", "3"],
      "a",
      "description",
      ["mid1"],
      [],
      [],
      [],
      "2020-03-26T17:45:48+0000",
      "2020-03-18T16:45:48+0000"
    ),
    new Station(
      "stationid2",
      ["2"],
      ["2"],
      ["2", "1"],
      "b",
      "description",
      ["mid1", "mid2", "mid3"],
      [],
      [],
      [],
      "2020-03-25T17:45:48+0000",
      "timestamp2"
    ),
    new Station(
      "stationid1",
      ["3"],
      ["3"],
      ["3"],
      "c",
      "description",
      ["mid1"],
      [],
      [],
      [],
      "2020-03-18T17:45:48+0000",
      "timestamp2"
    )
  ];

  const stationDictionary: Dictionary<Station> = {};
  stations.forEach((station: Station) => {
    stationDictionary[station.id] = station;
  });

  const history = createMemoryHistory();
  const path = `/route/:id`;

  const match: match<{ id: string }> = {
    isExact: false,
    path,
    url: path.replace(":id", "1"),
    params: { id: "1" }
  };

  const location = createLocation(match.url);
  const componentProps = {
    slice: false,
    numberOfStations: stations.length,
    stations: stationDictionary,
    currentUser: User,
    openCreateStation: jest.fn(),
    receiveSelectedStation: jest.fn(),
    history,
    match,
    location
  };

  const stationsComponent = shallow(
    <Route>
      <Stations {...componentProps} />
    </Route>
  );

  it("matches snapshot", () => {
    // Snapshot demo
    expect(stationsComponent).toMatchSnapshot();
  });
});
