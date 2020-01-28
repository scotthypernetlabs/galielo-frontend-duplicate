// import React from 'react';
// import { connect } from 'react-redux';
// // import Select from 'react-select';
// // import Button from '../../css/modules/Button';
// // import PythonWizard from './Python';
// // import HecrasWizard from './HECRAS';
// // import JuliaWizard from './Julia';
// // import BlenderWizard from './Blender';
// // import RWizard from './R';
// // import SRH2DWizard from './SRH2D';
// // import { ipcRenderer } from 'electron';
// import fs from 'fs';
// import { openNotificationModal, closeModal } from '../../actions/ModalActions';
// // import { receiveDockerInput } from '../../actions/dockerWizardActions';
// 
// type Props = {
//   state: any;
//   openNotificationModal: (modal_name:string, text: string) => IOpenNotificationModal
// }
//
// type State = {
//
// }
//
// class DockerWizard extends React.Component<Props, State> {
//   constructor(props: Props){
//     super(props);
//     this.state = {
//       showDisplayTemplate: false,
//       useDockerWizard: false,
//     };
//     this.generateDisplayTemplate = this.generateDisplayTemplate.bind(this);
//     this.generateDockerForm = this.generateDockerForm.bind(this);
//     this.handleSelect = this.handleSelect.bind(this);
//     this.handleInput = this.handleInput.bind(this);
//     this.createDockerFile = this.createDockerFile.bind(this);
//     this.toggleDisplayTemplate = this.toggleDisplayTemplate.bind(this);
//   }
//
//   componentDidUpdate(){
//     var tx = document.getElementsByTagName('textarea');
//     for (var i = 0; i < tx.length; i++) {
//       tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
//       tx[i].addEventListener("input", OnInput, false);
//     }
//
//     function OnInput() {
//       this.style.height = 'auto';
//       this.style.height = (this.scrollHeight) + 'px';
//     }
//   }
//
//   createDockerFile(e:any){
//     e.preventDefault();
//     const { dockerTextFile, filePath } = this.props.state;
//     fs.writeFile(`${filePath}/Dockerfile`, dockerTextFile, (err) => {
//       this.props.openNotificationModal("Docker file has been created! Please reupload your project folder.");
//     })
//   }
//
//   handleSelect(selectedFramework){
//     if(selectedFramework.label === "Not Listed"){
//       this.props.receiveDockerInput({
//         selectedFramework,
//         dockerTextFile: '#Unfortunately we have yet to setup a semi-automated process for your framework. You can use this editor to create your own Dockerfile.'
//       })
//       this.setState({
//         showDisplayTemplate: true
//       })
//     }else{
//       this.props.receiveDockerInput({selectedFramework});
//     }
//   }
//
//   handleInput(type){
//     return(e) => {
//       const { value } = e.target;
//       this.props.receiveDockerInput({
//         [type]: value
//       })
//     }
//   }
//
//   generateDisplayTemplate(){
//     const { dockerTextFile } = this.props.state
//     if(!this.state.showDisplayTemplate){
//       return(
//         <> </>
//       )
//     }
//       return(
//         <>
//           <header className="docker-wizard-header"> Docker File Wizard </header>
//           <div className="template-container">
//             <textarea cols="72"
//               value={dockerTextFile}
//               className="docker-command"
//               onChange={this.handleInput('dockerTextFile')}>
//             </textarea>
//           </div>
//         </>
//       )
//   }
//
//   generateDockerForm(){
//     const { selectedFramework } = this.props.state;
//     const options = [
//       { value: 'python:3.7', label: 'Python 3.7'},
//       { value: 'python:2.7', label: 'Python 2.7'},
//       { value: 'tensorflow/tensorflow:latest-py3', label: 'Tensorflow'},
//       { value: 'r-base', label: 'R'},
//       { value: '1.1', label: 'Julia 1.1'},
//       { value: '1.0', label: 'Julia 1.0'},
//       { value: 'hecras', label: 'HEC-RAS'},
//       { value: 'srh2d', label: 'SRH-2D'},
//       { value: 'Blender', label: 'Blender'},
//       { value: 'Not Listed', label: 'Not Listed'}
//     ];
//     let component = null;
//     if(selectedFramework){
//       if(selectedFramework.label.includes('Python') || selectedFramework.label.includes('Tensorflow')){
//         component = <PythonWizard />;
//       }
//       if(selectedFramework.label.includes('HEC-RAS')){
//         component = <HecrasWizard />;
//       }
//       if(selectedFramework.label.includes('SRH-2D')){
//         component = <SRH2DWizard />;
//       }
//       if(selectedFramework.label.includes('Julia')){
//         component = <JuliaWizard />;
//       }
//       if(selectedFramework.label === 'R'){
//         component = <RWizard />;
//       }
//       if(selectedFramework.label === "Blender"){
//         component = <BlenderWizard />;
//       }
//     }
//
//     return(
//       <div className="docker-form-container">
//         <div className="select-framework">
//           <Select
//             value={selectedFramework}
//             onChange={this.handleSelect}
//             options={options}
//             placeholder="Select Framework..."
//             />
//         </div>
//         { component }
//         <div className="submit-docker-form">
//           {this.generateSubmitForm()}
//         </div>
//       </div>
//     )
//   }
//
//   toggleDisplayTemplate(e){
//     e.preventDefault();
//     this.setState(prevState => ({
//       showDisplayTemplate: !prevState.showDisplayTemplate
//     }));
//   }
//
//   generateSubmitForm(){
//     const { entrypoint } = this.props.state;
//
//     if(entrypoint.length > 0 || this.props.state.dockerTextFile.includes('ENTRYPOINT')){
//       return(
//         <>
//           <form className="submit-docker-form" onSubmit={this.createDockerFile}>
//             <Button type="submit" value="Create Dockerfile" />
//           </form>
//         </>
//       )
//     }
//   }
//
//   dockerWizardUi(){
//     // <div className="bottom-left-button">
//     //   <button type="button" onClick={this.props.closeModal} className="styled-button">
//     //     Quit
//     //   </button>
//     // </div>
//     return(
//       <div className="docker-wizard-style" onClick={(e) => e.stopPropagation()}>
//         <div className="docker-wizard-container">
//           <div className="docker-wizard-form">
//             {this.generateDockerForm()}
//           </div>
//           <div className="docker-wizard-template">
//           <button type="button" onClick={this.toggleDisplayTemplate}>
//             Display Dockerfile
//           </button>
//             {this.generateDisplayTemplate()}
//           </div>
//         </div>
//
//       </div>
//     )
//   }
//
//   queryModal(){
//     return(
//       <div className="coming-soon-modal" onClick={this.props.closeModal}>
//         <div className="coming-soon-modal-inner" onClick={e => e.stopPropagation()}>
//           <p> Docker Wizard </p>
//           <h2> This folder does not contain a Dockerfile. Would you like to use the Docker Wizard? </h2>
//           <div className="query-button-container">
//             <button type="button" onClick={this.queryButton(true)} className="styled-button">
//               Yes
//             </button>
//             <button type="button" onClick={this.queryButton(false)} className="styled-button">
//               No
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }
//
//   queryButton(bool){
//     return (e) => {
//       if(bool){
//         this.setState({
//           useDockerWizard: true
//         })
//       }else{
//         this.props.closeModal();
//       }
//     }
//   }
//
//   render(){
//     return(
//       <>
//         {
//           this.state.useDockerWizard ? this.dockerWizardUi() : this.queryModal()
//         }
//       </>
//     )
//   }
// }
//
// const mapStateToProps = state => ({
//   state: state.docker.inputState,
//   filePath: state.ui.modal.text
// })
//
// const mapDispatchToProps = dispatch => ({
//   displayNotification: (text) => dispatch(openNotificationModal(text)),
//   receiveDockerInput: (object) => dispatch(receiveDockerInput(object)),
//   closeModal: () => dispatch(closeModal())
// })
//
// export default connect(mapStateToProps, mapDispatchToProps)(DockerWizard);
