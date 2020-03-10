import { Dictionary } from "../../../business/objects/dictionary";
import { Job as JobModel } from "../../../business/objects/job";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { User, Wallet } from "../../../business/objects/user";
import { shallow } from "enzyme";
import Jobs from "../../Jobs/Jobs";
import React, { createContext } from "react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {MyContext} from "../../../MyContext";
import {context} from "../../../context";

describe("Jobs Component", () => {
  const sentJobs: Dictionary<JobModel> = {};
  const receivedJobs: Dictionary<JobModel> = {};
  const currentUser: User = {
    user_id: "1",
    username: "testing",
    mids: ["123"],
    wallets: [new Wallet("1", "1", "1")]
  };
  const componentProps = {
    showButtonGroup: false
  };

  const Wrapper = (props: any) => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({
      jobs: { sentJobs, receivedJobs },
      users: { currentUser }
    });
    store.dispatch = jest.fn();
    const Context = createContext(new MyContext());
    const { children } = props;
    return (
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
    );
  };

  const jobs = shallow(<Jobs {...componentProps} />, {
    wrappingComponent: Wrapper
  });

  it("should match snapshot", () => {
    expect(jobs).toMatchSnapshot();
  });
});
