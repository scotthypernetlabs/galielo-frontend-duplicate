import { Redirect } from "react-router";
import { connect } from "react-redux";
import React from "react";
import path from "path";

type Props = {};

type State = {};

class Onboarding extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return <Redirect to="/stations" />;
  }
}

export default Onboarding;
