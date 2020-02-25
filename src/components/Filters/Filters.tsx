import { Dispatch } from "redux";
import { IFilterState, IStore } from "../../business/objects/store";
import { connect } from "react-redux";
import React from "react";
// import { Slider } from 'antd';
import { MyContext } from "../../MyContext";
import { context } from "../../context";
import { logService } from "../Logger";
import { modifyFilter } from "../../actions/filterActions";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

type Props = {
  modifyFilter: Function;
  filter: IFilterState;
};

type State = {};

class SliderObject {
  constructor(
    public label: string,
    public key: string,
    public min: number,
    public max: number,
    public marks: any,
    public steps: number
  ) {}
}

class Filter extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  public handleSliderChange(type: string) {
    return (event: any, newValue: number[]) => {
      this.props.modifyFilter(type, newValue);
    };
  }

  public reset() {
    this.props.modifyFilter("ram", [2, 8]);
    this.props.modifyFilter("gpu", [2, 8]);
    this.props.modifyFilter("processor", [2, 8]);
    this.props.modifyFilter("clockspeed", [1, 2]);
  }
  public handleSubmit() {
    this.context.offerService.updateOffers(this.props.filter);
  }
  public render() {
    const sliders = [
      new SliderObject(
        "GPU",
        "gpu",
        2,
        32,
        [
          { value: 2, label: "2 GB" },
          { value: 32, label: "32 GB" }
        ],
        1
      ),
      new SliderObject(
        "PROCESSOR",
        "processor",
        2,
        32,
        [
          { value: 2, label: "2 Cores" },
          { value: 32, label: "32 Cores" }
        ],
        1
      ),
      new SliderObject(
        "RAM",
        "ram",
        2,
        32,
        [
          { value: 2, label: "2 GB" },
          { value: 32, label: "32 GB" }
        ],
        1
      ),
      new SliderObject(
        "CLOCKSPEED",
        "clockspeed",
        1,
        6,
        [
          { label: 1, value: "1.0 GHZ" },
          { label: 6, value: "6.0" }
        ],
        0.2
      )
    ];
    return (
      <>
        {sliders.map((slider: SliderObject, idx: number) => {
          return (
            <div className="slider-container" key={idx}>
              <Typography id="range-slider" gutterBottom>
                {slider.label}
              </Typography>
              <Slider
                value={this.props.filter[slider.key]}
                onChange={this.handleSliderChange(slider.key)}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                step={slider.steps}
                min={slider.min}
                max={slider.max}
              />
            </div>
          );
        })}
        <div className="button-holders">
          <button className="primary-btn" onClick={this.handleSubmit}>
            Filter
          </button>
          <button className="secondary-btn" onClick={this.reset}>
            Reset
          </button>
        </div>
      </>
    );
  }
}

Filter.contextType = context;

const mapStateToProps = (state: IStore) => ({
  filter: state.filter
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modifyFilter: (name: string, value: number[]) =>
    dispatch(modifyFilter(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
