import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Hidden,
  IconButton,
  Switch,
  Tooltip,
  Fade
} from "@material-ui/core";
import { Dispatch } from "redux";
import {
  DockerInputState,
  DockerWizardOptions,
  IDockerInput
} from "../../business/objects/dockerWizard";
import {
  ICloseModal,
  IOpenNotificationModal,
  closeModal,
  openNotificationModal
} from "../../actions/modalActions";
import {
  IReceiveDockerInput,
  receiveDockerInput
} from "../../actions/dockerActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { connect } from "react-redux";
import { context } from "../../context";
import Draggable from "react-draggable";
import HecrasWizard from "./HECRAS";
import ProgressBar from "../ProgressBar";
import React from "react";
// import Select from "react-select";

import * as Yup from "yup";
import { Formik } from "formik";
import CloseIcon from "@material-ui/icons/Close";
import HecRasFileSystem from "./HecRasFileSystem";
import HelpIcon from "@material-ui/icons/Help";

import { ProjectType } from "../../business/interfaces/IProjectService";
import SelectAdvancedSettings from "./SelectAdvancedSettings";
import SelectDependencies from "./SelectDependencies";
import SelectFile from "./SelectFile";
import SelectProject from "./SelectProject";
import SelectVersion from "./SelectVersion";
import SimpleModal from "./SimpleModal";
import Zoom from "@material-ui/core/Zoom";

const HecResToolTipText =
  "If your Network File System is connected with Galileo, you will be able to set your project path next. \n If you are not sure what this is, it is likely does not aply to you.";
const path = require("path");
// frameworks will be replaced witht eh server
const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

interface Values {
  framework: string;
}

let targetFiles: Array<string> = [];
type Props = {
  state: DockerInputState;
  openNotificationModal: (
    modal_name: string,
    text: string
  ) => IOpenNotificationModal;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  closeModal: () => ICloseModal;
  filePath: string;
  options: DockerWizardOptions;
};

type State = {
  showDisplayTemplate: boolean;
  useDockerWizard: boolean;
  disabled: boolean;
  modalWidth: number;
  uploading: boolean;
  activeDrags: number;
  deltaPosition: any;
  dependenciesSelected: boolean;
  hecResFiles: Array<string>;
  step: number;
  hecRasNetworkFileSystem: boolean;
  fade: boolean;
};

interface FormDependencies {
  name: string;
  version: string;
}

interface FormSubmitValues {
  projectType: string;
  projectVersion: string;
  projectFile: string;
  dependencies: FormDependencies[];
  dependency: string;
  version: string;
  projectArguments: string;
  cpuUsage: number;
  enteredDependencies: string;

}

class DockerWizard extends React.Component<Props, State> {
  context!: MyContext;
  public readonly state = {
    showDisplayTemplate: false,
    useDockerWizard: false,
    disabled: true,
    modalWidth: 500,
    dependenciesSelected: false,
    uploading: false,
    activeDrags: 0,
    deltaPosition: {
      x: 0,
      y: 0
    },
    hecResFiles: [""],
    step: 1,
    hecRasNetworkFileSystem: false,
    fade: false
  };
  constructor(props: Props) {
    super(props);
    this.generateDisplayTemplate = this.generateDisplayTemplate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.runJobWithDockerFile = this.runJobWithDockerFile.bind(this);
    this.downloadDockerFile = this.downloadDockerFile.bind(this);
    this.toggleDisplayTemplate = this.toggleDisplayTemplate.bind(this);
    this.queryButton = this.queryButton.bind(this);
    this.uploadButton = this.uploadButton.bind(this);
    this.decrementStep = this.decrementStep.bind(this);
    this.incrementStep = this.incrementStep.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    // The  folowing methods are used by drag and drop
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.toggleHecRasNetworkFileSystem = this.toggleHecRasNetworkFileSystem.bind(
      this
    );
    this.toggleDependenciesSelected = this.toggleDependenciesSelected.bind(this);
    this.machineCores = this.machineCores.bind(this);
    this.pageOneValidation = this.pageOneValidation.bind(this);
  }
  machineCores() {
    if (this.props.options.target ==="machine"){
      return parseInt(this.props.options.machineCores)
    } else {
      return 96;
    }
  }
  public dockerWizardSchema = Yup.object().shape({
    projectVersion: Yup.string().required("required"),
    projectArguments: Yup.string().matches(/^[^\,]*$/, "Please enter arguments seperated by single space"),
    projectFile: Yup.string().matches(/^[^\.]*$/, "Please do not enter the file extension").required("required"),
    projectType: Yup.string().required("required"),
    sourcePath: Yup.string().matches(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, 'Must be a path. Eg. "C:\\User\\Public\\Output').required(),
    destinationPath: Yup.string().matches(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, 'Must be a path. Eg. "C:\\User\\Public\\Output').required(),
    enteredDependencies: Yup.string().required("required"),
    cpuCount:Yup.number()
    .integer()
    .min(1)
    .max(this.machineCores())
    .default(1)
  });
  // TODO  remove styles form the component
  getModalStyle = () => {
    return {
      left:0,
      position: "absolute" as "absolute",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#fff"
    };
  };

  customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: "#fff",
      opacity: 1,
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      borderColor: "grey",
      boxShadow: state.isFocused ? null : null
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      background: "#fff",
      opacity: 1,
      zIndex: 100
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
      background: "#fff",
      opacity: 1
    })
  };
  componentDidMount() {
    document.body.classList.add("no-sroll");
    console.log(this.props.options);
    // get the uploaded files.
    const files: Array<string> = [];
    for (let i = 0, len = this.props.options.fileList.length; i < len; i++) {
      files.push(this.props.options.fileList[i].name);
    }
    // check if the file is a .p# file
    const EXTENSION = "p";
    targetFiles = files.filter(function(file) {
      return (
        path.extname(file).toLowerCase()[1] === EXTENSION &&
        !isNaN(path.extname(file).toLowerCase()[2])
      );
    });
  }
  componentDidUpdate() {
    // const tx = document.getElementsByTagName("textarea");
    // for (let i = 0; i < tx.length; i++) {
    //   tx[i].setAttribute(
    //     "style",
    //     "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
    //   );
    //   tx[i].addEventListener("input", OnInput, false);
    // }
    // function OnInput() {
    //   this.style.height = "auto";
    //   this.style.height = this.scrollHeight + "px";
    // }
  }
  componentWillUnmount() {
    document.body.classList.remove("no-sroll");
  }

  toggleDependenciesSelected() {
    this.setState({ dependenciesSelected: true });
  }
  runJobWithDockerFile(projectType: ProjectType) {
    console.log(projectType);
    const { dockerTextFile } = this.props.state;
    // What are these options
    const { options } = this.props;
    const dockerFileContents: BlobPart[] = [new Blob([dockerTextFile])];
    const file = new File(dockerFileContents, "Dockerfile", {
      type: "application/octet-stream"
    });
    if (!options) {
      return;
    }
    const files = [...options.fileList];
    const packagedFile = {
      fileObject: file,
      fullPath: "Dockerfile",
      lastModified: file.lastModified,
      name: "Dockerfile",
      size: file.size,
      type: file.type
    };
    files.push(packagedFile);
    if (options.target === "machine") {
      const sendJobFunction = async () => {
        await this.context.jobService.sendJob(
          options.mid,
          files,
          options.directoryName,
          options.stationid,
          projectType,
          options.machineCores
        );
      };
      this.context.uploadQueue.addToQueue(sendJobFunction);
      this.context.uploadQueue.startQueue();
      this.setState({
        uploading: true
      });
    } else if (options.target === "station") {
      const sendJobFunction = async () => {
        await this.context.jobService.sendStationJob(
          options.stationid,
          files,
          options.directoryName,
          projectType
        );
      };
      this.context.uploadQueue.addToQueue(sendJobFunction);
      this.context.uploadQueue.startQueue();
      this.setState({
        uploading: true
      });
    }
    this.props.closeModal();
  }
  downloadDockerFile() {
    const { dockerTextFile } = this.props.state;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/octet-stream," +
        encodeURIComponent(this.props.state.dockerTextFile)
    );
    element.setAttribute("download", "Dockerfile");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  onStart() {
    this.setState(prevState => {
      activeDrags: prevState.activeDrags + 1;
    });
  }

  onStop() {
    this.setState(prevState => {
      activeDrags: prevState.activeDrags - 1;
    });
  }
  pageOneValidation(props:any){
    if (props.values.projectType === ""){
      return true;
    }
    if (props.values.projectType === "Python" ||
    props.values.projectType === "Julia")
    {return props.errors.projectType !== undefined || props.errors.projectVersion !== undefined || props.errors.projectFile !== undefined}
    if (props.values.projectType === "R" || props.values.projectType === "Stata")
    {return props.errors.projectType !== undefined || props.errors.projectFile !== undefined}
    if (props.values.projectType === "Hec-Ras")
    {return props.errors.projectType !== undefined || props.errors.projectVersion !== undefined}
  } 
  handleSelect(selectedFramework: any) {
    if (selectedFramework.label === "Not Listed") {
      this.props.receiveDockerInput({
        selectedFramework,
        dockerTextFile:
          "#Unfortunately we have yet to setup a semi-automated process for your framework. You can use this editor to create your own Dockerfile."
      });
      this.setState({
        showDisplayTemplate: true,
        disabled: false
      });
    } else {
      // a framework is selected
      // fetch the selected framewotk info
      this.props.receiveDockerInput({ selectedFramework });
      this.setState({
        disabled: false
      });
    }
  }
  toggleHecRasNetworkFileSystem() {
    this.setState({
      hecRasNetworkFileSystem: !this.state.hecRasNetworkFileSystem
    });
  }
  incrementStep() {
     this.setState({ step: this.state.step + 1 });
  }
  decrementStep() {
    if (this.state.step >= 1) {
      this.setState({ step: this.state.step - 1 });
    }
  }
  handleInput(type: any) {
    return (e: any) => {
      const { value } = e.target;
      this.props.receiveDockerInput({
        [type]: value
      });
    };
  }
  generateDisplayTemplate() {
    const { dockerTextFile } = this.props.state;
    if (!this.state.showDisplayTemplate) {
      return <> </>;
    }
   
    return (
      <>
        <header className="docker-wizard-header"> Dockerfile </header>
        <div className="template-container">
          <textarea
            cols={72}
            value={dockerTextFile}
            className="docker-command"
            onChange={this.handleInput("dockerTextFile")}
          />
        </div>
      </>
    );
  }
  toggleDisplayTemplate(e: any) {
    e.preventDefault();
    this.setState(prevState => ({
      showDisplayTemplate: !prevState.showDisplayTemplate
    }));
  }
  generateSubmitForm() {
    const { entrypoint } = this.props.state;
    if (
      entrypoint.length > 0 ||
      this.props.state.dockerTextFile.includes("ENTRYPOINT")
    ) {
      return <></>;
    }
  }
  updateHacRasPlan(plan: string) {}
  handleErrors(errors:any){
    console.log("errors.sourcePath", errors.sourcePath)
    console.log("errors.destinationPath", errors.destinationPath)
    return (errors.sourcePath !== undefined || errors.destinationPath !== undefined)
  }
  setDefaultProjectVersion(projectType:string) {
    
  }
  dockerWizardUi() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    // const initialValues: FormSubmitValues = {
    //   projectType: "",
    //   projectVersion: "",
    //   projectFile: "",
    //   dependencies: [],
    //   dependency: "",
    //   version: "",
    //   projectArguments: "",
    //   cpuUsage: 1
    // };

    return (
      <Fade in={true}>
      <Draggable
        handle="strong"
        bounds={{ top: -40, left: -20, right: 200, bottom: 100 }}
        {...dragHandlers}
      >
        <Formik
          validationSchema={this.dockerWizardSchema}
          initialValues={{
            projectType: "",
            projectVersion: "",
            projectFile: "",
            dependencies: [],
            dependency: "",
            version: "",
            projectArguments: "",
            cpuCount: "",
            destinationPath: "C:\\Users\\Public\\Output",
            enteredDependencies: "",
            hecRas: {
              name: "Name of project",
              description: "Description of your HECRAS project",
              sourceStorageId: null,
              sourcePath: "",
              destinationStorageId: null,
              destinationPath: "C:\/Users\/Public\/Output",
              projectTypeId: "",
              plan: "",
              filesToRun: []
            }
          }}
          onSubmit={(values, actions) => {
            console.log("values", values);
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                p={1}
                m={1}
                style={this.getModalStyle()}
              >
                <strong className="cursor-move">
                  <div></div>
                </strong>
                <div className="docker-wizard-container">
                  <Box className="docker-wizard-form">
                    <div className="select-framework">
                      <Hidden smDown>
                        <IconButton
                          onClick={this.props.closeModal}
                          aria-label="Close"
                          className="closeButton"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Hidden>

                      <>
                        {this.state.step === 1 && (
                          <>
                            <Box mb={2}>
                              <SelectProject
                               props = {props}
                                incrementStep={this.incrementStep}
                              />
                            </Box>
                          </>
                        )}
                        {this.state.step === 1 &&
                          props.values.projectType !== "" && (
                            <>
                              {(props.values.projectType === "Python" ||
                                props.values.projectType === "Hec-Ras" ||
                                props.values.projectType === "Julia") && (
                                <Box mb={2}>
                                  <SelectVersion
                                    projectType={props.values.projectType}
                                  />
                                </Box>
                              )}
                              {props.values.projectType !== "Hec-Ras" ? (
                                <SelectFile
                                  // handleBlur = {props.handleBlur}
                                  projectFile={props.values.projectFile}
                                  values={props.values}
                                  props= {props}
                                />
                              ) : (
                                <Box display="flex">
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={
                                            this.state.hecRasNetworkFileSystem
                                          }
                                          onChange={() =>
                                            this.toggleHecRasNetworkFileSystem()
                                          }
                                        />
                                      }
                                      label="Project is in my Network File System"
                                    />
                                  </FormGroup>
                                  <Tooltip
                                    title={HecResToolTipText}
                                    arrow
                                    placement="right-start"
                                    TransitionComponent={Zoom}
                                  >
                                    <IconButton aria-label="help" size="small">
                                      <HelpIcon fontSize="inherit" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                            </>
                          )}
                        {this.state.step === 2 &&
                          (props.values.projectType === "Hec-Ras" ? (
                            this.state.hecRasNetworkFileSystem ? (
                              <HecRasFileSystem />
                            ) : (
                              <HecrasWizard
                                selectedPlan={(plan: string) => {
                                  props.values.hecRas.plan = plan;
                                }}
                                selectedFiles={(list: Array<string>) => {
                                  props.values.hecRas.filesToRun = list;
                                }}
                                targetFiles={targetFiles}
                              />
                            )
                          ) : (
                            <SelectDependencies
                              toggleDependenciesSelected={
                                this.toggleDependenciesSelected
                              }
                              initialValues={props.values}
                              props= {props}
                              dependency={props.values.dependency}
                              dependencies={props.values.dependencies}
                            />
                          ))}

                        {this.state.step === 3 &&
                          (this.state.hecRasNetworkFileSystem ? (
                            <HecrasWizard
                              selectedPlan={(plan: string) => {
                                props.values.hecRas.plan = plan;
                              }}
                              selectedFiles={(list: Array<string>) => {
                                props.values.hecRas.filesToRun = list;
                              }}
                              targetFiles={targetFiles}
                            />
                          ) : (
                            <SelectAdvancedSettings errors = {props.errors} touched = {props.touched} options = {this.props.options} />
                          ))}

                        {props.errors.projectType && (
                          <div id="feedback">{props.values.projectType}</div>
                        )}
                      </>
                    </div>

                    <div className="submit-docker-form">
                      {this.generateSubmitForm()}
                    </div>
                  </Box>
                  <Box className="docker-wizard-template">
                    {this.generateDisplayTemplate()}
                  </Box>
                </div>
                {/* <Box display="flex" justifyContent="center">
            <Button color="primary" onClick={this.toggleDisplayTemplate}>
              See Dockerfile
            </Button>
          </Box> */}
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  mb={1}
                >
                  {this.state.step === 1 && (
                    <Button
                      style={{ width: 200 }}
                      variant="outlined"
                      size="large"
                      onClick={this.props.closeModal}
                    >
                      Cancel
                    </Button>
                  )}
                  {this.state.step != 1 && (
                    <Button
                    style={{ width: 200 }}
                      variant="outlined"
                      size="large"
                      onClick={this.decrementStep}
                    >
                      Back
                    </Button>
                  )}

                  {/* { !(props.values.projectType === "Hec-Ras") &&  (
                    <Button
                    disabled={props.values.projectVersion === ""}
                      color="primary"
                      variant="contained"
                      size="large"
                      onClick={this.incrementStep}
                    >
                      Next
                    </Button>
                  )} */}

                  {/* Step 1  */}
                  {this.state.step === 1   &&  (
                    <Button
                    disabled= {this.pageOneValidation(props)}
                      color="primary"
                      variant="contained"
                      size="large"
                      style={{ width: 200 }}
                      onClick={this.incrementStep}
                    >
                      Next
                    </Button>
                  )}
                  {/* Step 2 */}

                  { (this.state.step === 2 && props.values.projectType === "Hec-Ras" && !this.state.hecRasNetworkFileSystem) && 
                  <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{ width: 200 }}
                      onClick={() => {
                        this.runJobWithDockerFile;
                        this.props.closeModal;
                      }}
                    >
                      Run Project
                    </Button> }
                    { (this.state.step === 2 && props.values.projectType === "Hec-Ras" &&  this.state.hecRasNetworkFileSystem) && 
                   <>
                   <Button
                   color="primary"
                   disabled = {this.handleErrors(props.errors)}
                   style={{ width: 200 }}
                   variant="contained"
                   size="large"
                   onClick={()=>{ this.setState({step: 3}) }}
                 >
                  Next
                 </Button>
                 </>
                } 
                  { (this.state.step === 2 && props.values.projectType !== "Hec-Ras" && !this.state.hecRasNetworkFileSystem) && 
                   <Button
                   color="primary"
                   variant="contained"
                   style={{ width: 200 }}
                   size="large"
                   onClick={this.incrementStep}
                 >
                  {props.values.dependencies.length === 0 ? "Skip" : "Next" }
                 </Button>
                } 
                    
          

                  {/* {(this.state.step === 1 ||
                    (this.state.step === 2 &&
                      props.values.projectType !== "Hec-Ras") ||
                    (this.state.step === 2 &&
                      this.state.hecRasNetworkFileSystem)) && (
                    <Button
                      disabled={
                        props.values.projectType === "" ||
                        props.values.projectVersion === "" ||
                        props.values.projectFile.length < 4
                      }
                      color="primary"
                      variant="contained"
                      size="large"
                      onClick={this.incrementStep}
                    >
                      {(this.state.step === 1 || this.state.step === 2) &&
                      ((props.values.projectType !== "Hec-Ras" &&
                      props.values.dependencies.length === 0)
                        ? "Skip"
                        : "Next")}
                    </Button>
                  )}
*/}
                  {(this.state.step === 3 &&
                    <Button
                      variant="contained"
                      disabled = {props.errors.projectArguments !== undefined || props.errors.cpuCount !== undefined }
                      color="primary"
                      size="large"
                      style={{ width: 200 }}
                      onClick={() => {
                        this.runJobWithDockerFile;
                        this.props.closeModal;
                      }}
                    >
                      Run Project
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Draggable>
      </Fade>
    );
  }
// Query Modal use to be part of the app bedfore v.1.227
  // queryModal() {
  //   return (
  //     <div>
  //       <SimpleModal
  //         buttonMethod={this.queryButton}
  //         hasTitle={true}
  //         titleText={
  //           "The folder does not contain a DockerFile. Would you like to use the Docker Wizard to create one?"
  //         }
  //         bodyText={"You can also add a Dockerfile on your own and try again."}
  //         button2Text={"Use Docker Wizard"}
  //         button1Text={"Cancel"}
  //         secondButton={this.state.disabled}
  //       />
  //     </div>
  //   );
  // }

  queryButton(bool: boolean) {
    return (e: any) => {
      if (bool) {
        this.setState({
          useDockerWizard: true
        });
      } else {
        this.props.openNotificationModal(
          "Notifications",
          "The job was cancelled due to lacking a Dockerfile."
        );
      }
    };
  }

  uploadButton(bool: boolean) {
    return (e: any) => {
      if (bool) {
        this.downloadDockerFile();
      } else {
        this.props.closeModal();
      }
    };
  }

  uploadingModal() {
    return (
      <div>
        <SimpleModal
          buttonMethod={this.uploadButton}
          hasTitle={true}
          titleText={`Uploading ${this.props.options.directoryName} with newly generated Dockerfile.`}
          bodyText={
            "You can download the Dockerfile and add to your project folder for future usage."
          }
          button2Text={"Download Dockerfile"}
          button1Text={"Close"}
          secondButton={true}
        >
          <ProgressBar
            type={this.props.options.target}
            id={
              this.props.options.target === "machine"
                ? this.props.options.mid
                : this.props.options.stationid
            }
          />
        </SimpleModal>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.dockerWizardUi()}
      </>
    );
  }
}

DockerWizard.contextType = context;

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState,
  filePath: state.modal.modal_text,
  options: state.modal.modal_query
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (modal_name: string, text: string) =>
    dispatch(openNotificationModal(modal_name, text)),
  receiveDockerInput: (object: IDockerInput) =>
    dispatch(receiveDockerInput(object)),
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DockerWizard);
