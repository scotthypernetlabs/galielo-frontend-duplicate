import { Dispatch } from "redux";
import { IStore } from "../../business/objects/store";
import { Slider } from "antd";
import { connect } from "react-redux";
import { logService } from "../Logger";
import { modifyFilter } from "../../actions/filterActions";
import Filter from "./Filters";
import React from "react";

type Props = {};

type State = {
  filterOn: boolean;
  filterMode: boolean;
};

class OfferFilter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filterOn: false,
      filterMode: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
  }
  public handleChange() {
    this.setState(prevState => ({
      filterOn: !prevState.filterOn
    }));
  }
  public handleModeChange(type: string) {
    return (e: any) => {
      if (type === "Filters") {
        this.setState({
          filterMode: true
        });
      } else {
        this.setState({
          filterMode: false
        });
      }
    };
  }
  public render() {
    return (
      <div className="filter-container" onClick={this.handleChange}>
        <i className="fas fa-filter"></i>
        {this.state.filterOn && (
          <div className="filter-dropdown" onClick={e => e.stopPropagation()}>
            <div className="tabs">
              <div className="tab" onClick={this.handleModeChange("Filters")}>
                Filters
              </div>
            </div>
            {this.state.filterMode ? <Filter /> : <div> WIP </div>}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: IStore) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OfferFilter);
