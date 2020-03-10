import {Dictionary} from "../../../business/objects/dictionary";
import {EJobRunningStatus, EJobStatus, EPaymentStatus, Job as JobModel} from "../../../business/objects/job";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {User, Wallet} from "../../../business/objects/user";
import {mount, shallow} from "enzyme";
import Jobs from "../../Jobs/Jobs";
import React from "react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

describe("Jobs Component", () => {
  const sentJobs: Dictionary<JobModel> = {
    job: new JobModel(
      "container",
      "id",
      0,
      "name",
      "oaid",
      0,
      EPaymentStatus.current,
      "landing_zone",
      "launch_pad",
      EJobRunningStatus.not_running,
      "station_id",
      EJobStatus.completed,
      [],
      0,
      2,
      true
    )
  };
  const receivedJobs: Dictionary<JobModel> = {
    job: new JobModel(
      "container",
      "id",
      0,
      "name",
      "oaid",
      0,
      EPaymentStatus.current,
      "landing_zone",
      "launch_pad",
      EJobRunningStatus.not_running,
      "station_id",
      EJobStatus.completed,
      [],
      0,
      2,
      true
    )
  };
  const currentUser: User = {
    user_id: "1",
    username: "testing",
    mids: ["123"],
    wallets: [new Wallet("1", "1", "1")]
  };

  const componentProps = {
    showButtonGroup: true
  };

  const Wrapper = (props: any) => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({ sentJobs, receivedJobs, currentUser });
    store.dispatch = jest.fn();
    return (
      <Provider store={store}>
        <Router>
          <Jobs {...componentProps} />
        </Router>
      </Provider>
    );
  };

  const jobs = mount(<Wrapper />);

  it("should change the state componentState when componentDidMount is invoked", () => {
  });

  it("should match snapshot", () => {
    expect(jobs).toMatchSnapshot();
  });
});
