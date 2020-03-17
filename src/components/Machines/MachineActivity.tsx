import { Dispatch } from "redux";
import { IStore } from "../../business/objects/store";
import { connect } from "react-redux";
import React from "react";

class MachineActivity extends React.Component {}

const mapStateToProps = (state: IStore) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MachineActivity);
