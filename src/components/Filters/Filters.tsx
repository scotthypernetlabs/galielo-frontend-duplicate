import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { IFilterState } from '../../business/objects/filter';
import { Slider } from 'antd';
import { modifyFilter } from '../../actions/filterActions';
import { logService } from '../Logger';

type Props = {
  modifyFilter: Function;
  filter: IFilterState;
}

type State = {

}

class SliderObject {
  constructor(
    public label: string,
    public key: string,
    public min: number,
    public max: number,
    public marks: any,
    public steps: number
  ){

  }
}

class Filter extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.reset = this.reset.bind(this);
  }
  public handleSliderChange(type: string){
    return(value: any) => {
      this.props.modifyFilter(type, value);
    }
  }

  public reset(){
    this.props.modifyFilter('ram', 2);
  }
  public render(){
    let sliders = [
      new SliderObject('GPU', 'gpu', 2, 32, {2: '2 GB', 32: '32'}, 1),
      new SliderObject('PROCESSOR', 'processor', 2, 32, {2: {style: { left: '4%' }, label: '2 Cores'}, 32: '32'}, 1),
      new SliderObject('RAM', 'ram', 2, 32, {2:'2 GB', 32: '32'}, 1),
      new SliderObject('CLOCKSPEED', 'clockspeed', 1, 6, {1: {style: { left: '4%' }, label: '1.0 GHZ'}, 6: '6.0'}, 0.2)
    ]
    return(
        <>
          {
            sliders.map( (slider:SliderObject, idx: number) => {
              return(
                  <div className="slider-container" key={idx}>
                    <label>{slider.label}</label>
                    <Slider
                      onChange={this.handleSliderChange(slider.key)}
                      min={slider.min}
                      max={slider.max}
                      value={this.props.filter[slider.key]}
                      marks={slider.marks}
                      step={slider.steps}
                      />
                  </div>
                )
            })
          }
          <div className="button-holders">
            <button className="secondary-btn" onClick={this.reset}>
            Reset
            </button>
          </div>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  filter: state.filter
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modifyFilter: (name: string, value: number) => dispatch(modifyFilter(name, value))
})

export default connect(mapStateToProps,mapDispatchToProps)(Filter);
