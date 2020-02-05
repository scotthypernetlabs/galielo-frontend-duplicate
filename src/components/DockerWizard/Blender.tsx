import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import fs from 'fs';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { IDockerInput, DockerInputState } from '../../business/objects/dockerWizard';
import { receiveDockerInput, IReceiveDockerInput } from '../../actions/dockerActions';

type Props = {
  state: DockerInputState;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
}

type State = {
  frameRange: string;
  selectedFormat: any;
  outputTo: string;
  blendFileList: any[];
  blendFile: any;
  mode: string;
}

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
})


class BlenderWizard extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      frameRange: '',
      selectedFormat: null,
      outputTo: '',
      blendFileList: [],
      blendFile: null,
      mode: '--render-frame'
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleBlendSelect = this.handleBlendSelect.bind(this);
    this.toggleFrameRange = this.toggleFrameRange.bind(this);
  }

  componentDidMount(){
    const frameworkExplanation = '#The line below determines the build image to use\n\n';
    let fileString = frameworkExplanation + `FROM hyperdyne/blender:2.79\n\nCOPY . /media\n\n`;
    this.props.receiveDockerInput({
      entrypoint: '',
      target: '',
      dependencyText: '',
      dependencyInput: '',
      dockerTextFile: fileString,
      frameworkText: fileString
    });
    // let filesToBlend:any[] = [];
    // fs.readdir(this.props.filePath, (err,files) => {
    //   files.forEach(file => {
    //     let splitFile = file.split('.');
    //     if(splitFile.length === 2 && splitFile[1] === "blend"){
    //       filesToBlend.push({label: file, value: file});
    //     }
    //   })
    // })
    // this.setState({
    //   blendFile: filesToBlend[0],
    //   blendFileList: filesToBlend
    // })
  }

  componentDidUpdate(prevProps:Props, prevState:State){
    if(prevState !== this.state){
      if(this.state.outputTo.length > 0 && this.state.selectedFormat){
        const entrypoint1 = `ENTRYPOINT ["/usr/local/blender/blender","--threads","0","--background","/media/${this.state.blendFile.value}","-F","${this.state.selectedFormat.value}","--render-output","/media/${this.state.outputTo}",`;
        const entrypoint2 = (this.state.mode === '--render-frame' ? `"${this.state.mode}", "${this.generateFrameRange(this.state.frameRange)}"]` : `"${this.state.mode}", "${this.state.frameRange}", "-a"]`);
        const entrypoint = entrypoint1 + entrypoint2
        const { frameworkText } = this.props.state;
        const newDockerTextFile = frameworkText + entrypoint;
        this.props.receiveDockerInput({
          entrypoint: "set",
          dockerTextFile: newDockerTextFile
        })
      }
    }
  }

  generateFrameRange(frameRange: string){
    return frameRange.replace(/-/g, '..');
  }

  toggleFrameRange(){
    this.setState(prevState => ({
      mode: (prevState.mode === '--render-frame' ? '--scene' : '--render-frame')
    }))
  }

  handleInput(type:keyof State){
    return(e:any) => {
      const { value } = e.target;
      this.setState(updateState(type, value));
    }
  }
  handleSelect(selectedFormat:any){
    this.setState({
      selectedFormat
    })
  }
  handleBlendSelect(blendFile:any){
    this.setState({
      blendFile
    })
  }
  render(){
    const options = [
      { value: 'PNG', label: 'PNG' },
      { value: 'TGA', label: 'TGA' },
      { value: 'RAWTGA', label: 'RAWTGA'},
      { value: 'JPEG', label: 'JPEG' },
      { value: 'IRIS', label: 'IRIS' },
      { value: 'IRIZ', label: 'IRIZ' },
      { value: 'AVIRAW', label: 'AVIRAW' },
      { value: 'AVIJPEG', label: 'AVIJPEG' },
      { value: 'BMP', label: 'BMP' }
    ]
    return(
      <>
        <div className="blender-grid">
          <div>Blend File</div>
          <Select
            value={this.state.blendFile}
            onChange={this.handleBlendSelect}
            options={this.state.blendFileList}
            />
          <button onClick={this.toggleFrameRange} className="frame-range-toggle">{this.state.mode === '--render-frame' ? 'Frame Range' : 'Scene'}</button>
          <input
            placeholder={this.state.mode === '--render-frame' ? `e.g. 1..7 or 1,2,5 or 1-7` : `e.g Scene1`}
            value={this.state.frameRange}
            onChange={this.handleInput('frameRange')}
            type="text"
          />
          <div>Format</div>
          <Select
            value={this.state.selectedFormat}
            onChange={this.handleSelect}
            options={options}
            placeholder="Select format..."
            />
          <div>Output to</div>
          <input
            placeholder={`ex. frame_###`}
            value={this.state.outputTo}
            onChange={this.handleInput('outputTo')}
            type="text"
            />
        </div>

      </>
    )
  }
}

const mapStateToProps = (state:IStore) => ({
  state: state.docker.inputState,
  // filePath: state.ui.modal.text
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  receiveDockerInput: (object:IDockerInput) => dispatch(receiveDockerInput(object))
})

export default connect(mapStateToProps, mapDispatchToProps)(BlenderWizard);
