import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, MenuItem, InputLabel, FormControl } from '@material-ui/core'
import Select from 'react-select';
// import Button from '../../css/modules/Button';
import PythonWizard from './Python';
import HecrasWizard from './HECRAS';
import JuliaWizard from './Julia';
import BlenderWizard from './Blender';
import RWizard from './R';
import SRH2DWizard from './SRH2D';
// import { ipcRenderer } from 'electron';
import { openNotificationModal, closeModal, IOpenNotificationModal, ICloseModal } from '../../actions/modalActions';
import { IStore } from '../../business/objects/store';
import { Dispatch } from 'redux';
import { receiveDockerInput, IReceiveDockerInput } from '../../actions/dockerActions';
import { IDockerInput, DockerInputState } from '../../business/objects/dockerWizard';
import SimpleModal from './SimpleModal'
import { makeStyles } from '@material-ui/core/styles';


type Props = {
  state: DockerInputState;
  openNotificationModal: (modal_name:string, text: string) => IOpenNotificationModal;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  closeModal: () => ICloseModal;
  filePath: string;
}

type State = {
  showDisplayTemplate: boolean;
  useDockerWizard: boolean;
}



const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

class DockerWizard extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      showDisplayTemplate: false,
      useDockerWizard: false,

    };
    this.generateDisplayTemplate = this.generateDisplayTemplate.bind(this);
    this.generateDockerForm = this.generateDockerForm.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.createDockerFile = this.createDockerFile.bind(this);
    this.toggleDisplayTemplate = this.toggleDisplayTemplate.bind(this);
  }

  getModalStyle = ()=> {
    const top = 50;
    const left = 50;
    return {
      paddingTop: 50,
      paddingLeft: 50,
      paddingRight: 50,
      position: 'absolute' as 'absolute',
      width: 800,
      height:800,
      backgroundColor: 'white',
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      width: 800,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  componentDidUpdate(){
    var tx = document.getElementsByTagName('textarea');
    for (var i = 0; i < tx.length; i++) {
      tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    }
  }

  createDockerFile(e:any){
    e.preventDefault();
    const { dockerTextFile } = this.props.state;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(this.props.state.dockerTextFile));
    element.setAttribute('download', 'Dockerfile');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    this.props.openNotificationModal("Notifications", "Docker file has been created! Please move the Dockerfile to your project folder and reupload the folder.");
  }

  handleSelect(selectedFramework:any){
    if(selectedFramework.label === "Not Listed"){
      this.props.receiveDockerInput({
        selectedFramework,
        dockerTextFile: '#Unfortunately we have yet to setup a semi-automated process for your framework. You can use this editor to create your own Dockerfile.'
      })
      this.setState({
        showDisplayTemplate: true
      })
    }else{
      this.props.receiveDockerInput({selectedFramework});
    }
  }

  handleInput(type:any){
    return(e:any) => {
      const { value } = e.target;
      this.props.receiveDockerInput({
        [type]: value
      })
    }
  }

  generateDisplayTemplate(){
    const { dockerTextFile } = this.props.state
    if(!this.state.showDisplayTemplate){
      return(
        <> </>
      )
    }
      return(
        <>
          <header className="docker-wizard-header"> Docker File Wizard </header>
          <div className="template-container">
            <textarea cols={72}
              value={dockerTextFile}
              className="docker-command"
              onChange={this.handleInput('dockerTextFile')}>
            </textarea>
          </div>
        </>
      )
  }

  generateDockerForm(){
    const { selectedFramework } = this.props.state;
    const options = [
      { value: 'python:3.7', label: 'Python 3.7'},
      { value: 'python:2.7', label: 'Python 2.7'},
      { value: 'tensorflow/tensorflow:latest-py3', label: 'Tensorflow'},
      { value: 'r-base', label: 'R'},
      { value: '1.1', label: 'Julia 1.1'},
      { value: '1.0', label: 'Julia 1.0'},
      { value: 'hecras', label: 'HEC-RAS'},
      { value: 'srh2d', label: 'SRH-2D'},
      // { value: 'Blender', label: 'Blender'},
      { value: 'Not Listed', label: 'Not Listed'}
    ];
    let component = null;
    if(selectedFramework){
      if(selectedFramework.label.includes('Python') || selectedFramework.label.includes('Tensorflow')){
        component = <PythonWizard />;
      }
      if(selectedFramework.label.includes('HEC-RAS')){
        component = <HecrasWizard />;
      }
      if(selectedFramework.label.includes('SRH-2D')){
        component = <SRH2DWizard />;
      }
      if(selectedFramework.label.includes('Julia')){
        component = <JuliaWizard />;
      }
      if(selectedFramework.label === 'R'){
        component = <RWizard />;
      }
      if(selectedFramework.label === "Blender"){
        component = <BlenderWizard />;
      }
    }
    return(
      <div className="docker-form-container">
        <div className="select-framework">
          <Select
            value={selectedFramework}
            onChange={this.handleSelect}
            options={options}
            placeholder="Select Framework..."
          />
        </div>
        { component }
        <div className="submit-docker-form">
          {this.generateSubmitForm()}
        </div>
      </div>
    )
  }

  toggleDisplayTemplate(e:any){
    e.preventDefault();
    this.setState(prevState => ({
      showDisplayTemplate: !prevState.showDisplayTemplate
    }));
  }

  generateSubmitForm(){
    const { entrypoint } = this.props.state;
    console.log(this.props);
    if(entrypoint.length > 0 || this.props.state.dockerTextFile.includes('ENTRYPOINT')){
      return(
        <>
          <form className="submit-docker-form" onSubmit={this.createDockerFile}>
            <button className="primary-btn">Create Dockerfile</button>
          </form>
        </>
      )
    }
  }

  dockerWizardUi(){
    return(

        <Card>
           <div style={this.getModalStyle()}>
        <div className="docker-wizard-container">
          <div className="docker-wizard-form">
            {this.generateDockerForm()}
          </div>
          <div className="docker-wizard-template">
          <button type="button" onClick={this.toggleDisplayTemplate}>
            Display Dockerfile
          </button>
            {this.generateDisplayTemplate()}
          </div>
        </div>
        <div className="bottom-left-button">
          <Button onClick={this.props.closeModal} className="styled-button">
          Quit
          </Button>
        </div>
        </div>
        </Card>
    )
  }

  queryModal(){
    return(
        <div>
          <SimpleModal 
            buttonMethod = {this.queryButton}
            hasTitle = {true}
            titleText = {"The folder does not contain a DockerFile. Would you like to use the Docker Wizard to create one?"}
            bodyText = {"You can alsoadd a DockerFile on your own and try again."} 
            button2Text = {"Use Docker Wizard"}
            button1Text = {"Cancel"}
            secondButton = {true}
          />
        </div>
    )
  }

  queryButton = (bool: boolean)=>{
    return (e:any) => {
      if(bool){
        this.setState({
          useDockerWizard: true
        })
      }else{
        this.props.openNotificationModal('Notifications', "The job was cancelled due to lacking a Dockerfile.");
      }
    }
  }

  render(){
    return(
      <>
        {
          this.state.useDockerWizard ? this.dockerWizardUi() : this.queryModal()
        }
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState,
  filePath: state.modal.modal_text
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  openNotificationModal: (modal_name: string, text: string) => dispatch(openNotificationModal(modal_name, text)),
  receiveDockerInput: (object:IDockerInput) => dispatch(receiveDockerInput(object)),
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(DockerWizard);
