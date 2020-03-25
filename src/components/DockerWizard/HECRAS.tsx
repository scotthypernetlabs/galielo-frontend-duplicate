import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Icon
} from "@material-ui/core";
import { Dispatch } from "redux";
import { IDockerInput } from "../../business/objects/dockerWizard";
import {
  IReceiveDockerInput,
  receiveDockerInput
} from "../../actions/dockerActions";
import { IStore } from "../../business/objects/store";
import { connect } from "react-redux";
import ButtonGroup from "../Jobs/ButtonGroup";
import HecResModal from "../Modals/HecResModal/hecresModalView"
import React from "react";
import Select from "react-select";

var path = require('path');

type Props = {
  receiveDockerInput: (object: any) => IReceiveDockerInput;
  state: IDockerInput;
  targetFiles:Array<string>;
};

type State = {
  networkFileSystem: boolean;
  volumeLocation: string;
  volumeString: string;
  experimentName: string;
  experimentString: string;
  endingString: string;
  fileSystemMount: string;
  fileSystemString: string;
  frameworkText: string;
  selectedRAS: any;
  selectedPlan: any;
  rasText: string;
  planText: string;
  manualFiles: string;
  checked: boolean;
  mode: string;
  fileList: any;
  isManuallySelectedModalOpen: boolean;
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

const theme = {
  spacing: [0, 2, 3, 5, 8]
};
class HecrasWizard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      networkFileSystem: false,
      volumeLocation: "C:\\Users\\Public\\Output",
      volumeString: `#This is where you will set your Galileo volume to be located\n\nENV OUTPUT_DIRECTORY="C:\\Users\\Public\\Output"\n\n`,
      experimentName: "",
      experimentString: "",
      endingString:
        "#Be sure to place this Dockerfile in the directory containing your .prj file\n\nCOPY . ${RAS_BASE_DIR}\\\\${RAS_EXPERIMENT}",
      fileSystemMount: "",
      fileSystemString: "",
      frameworkText: "",
      selectedRAS: { value: "5.0.7", label: "5.0.7" },
      selectedPlan: { value: "Current", label: "Current" },
      rasText: "",
      planText: "",
      manualFiles: "",
      mode: "",
      checked: false,
      fileList: {},
      isManuallySelectedModalOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.handleRasSelect = this.handleRasSelect.bind(this);
    this.toggleNetworkFileSystem = this.toggleNetworkFileSystem.bind(this);
    this.closeManuallySelectedModal = this.closeManuallySelectedModal.bind(this);
    this.openManuallySelectedModal = this.openManuallySelectedModal.bind(this);
  }
  customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: "white",
      opacity: 1,
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      borderColor: "grey",
      boxShadow: state.isFocused ? null : null
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      background: "white",
      opacity: 1,
      zIndex: 100
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
      background: "white",
      opacity: 1
    })
  };
  componentDidMount() {
    this.props.receiveDockerInput({
      target: "",
      dependencyText: "",
      dependencyInput: "",
      dockerTextFile: "",
      frameworkText: "",
      entrypoint: ""
    });
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    let explanation;
    const frameworkText =
      "#The line below determines the build image to use\n\n" +
      `FROM hyperdyne/simulator:hecras\n\n`;
    let volumeString = this.state.volumeString;
    let experimentString = this.state.experimentString;
    let rasText = this.state.rasText;
    let planText = this.state.planText;
    let fileSystemString = this.state.fileSystemString;
    let change = false;
    if (this.state.manualFiles !== prevState.manualFiles) {
      change = true;
      planText = `ENV RAS_PLANS="${this.state.manualFiles}"\n\n`;
    }
    if (this.state.networkFileSystem !== prevState.networkFileSystem) {
      change = true;
    }
    if (this.state.frameworkText !== frameworkText) {
      change = true;
    }
    if (prevState.volumeLocation !== this.state.volumeLocation) {
      explanation = `#This is where you will set your Galileo volume to be located\n\n`;
      volumeString = `ENV OUTPUT_DIRECTORY="${this.state.volumeLocation}"\n\n`;
      change = true;
    }
    if (prevState.experimentName !== this.state.experimentName) {
      explanation = `#This will be the name of the folder created in the volume for your experiment\n\n`;
      experimentString = `ENV RAS_EXPERIMENT="${this.state.experimentName}"\n\n`;
      change = true;
    }
    if (prevState.fileSystemMount !== this.state.fileSystemMount) {
      if (this.state.fileSystemMount.length === 0) {
        fileSystemString = "";
      } else {
        explanation = `# If you are running a model from a local filesystem mounted as a volume, give the container path here, leave empty if not using\n\n`;
        fileSystemString = `ENV READ_ONLY_MODEL_PATH="${this.state.fileSystemMount}"\n\n`;
      }
      change = true;
    }
    if (prevState.selectedRAS !== this.state.selectedRAS) {
      rasText = `ENV RAS_VERSION=${this.state.selectedRAS.value}\n\n`;
      change = true;
    }
    if (prevState.selectedPlan.value !== this.state.selectedPlan.value) {
      if (this.state.selectedPlan.value === "All") {
        planText = `ENV RUN_ALL_PLANS=1\n\n`;
      } else if (this.state.selectedPlan.value === "Current") {
        planText = "";
      }
      change = true;
    }
    if (change) {
      this.setState({
        fileSystemString: fileSystemString,
        experimentString: experimentString,
        volumeString: volumeString,
        frameworkText: frameworkText,
        rasText: rasText,
        planText: planText
      });
      let finalizedDockerFile = frameworkText + volumeString;
      if (this.state.selectedPlan.value === "All" || "Manually Select") {
        finalizedDockerFile += planText;
      }
      if (this.state.experimentName.length > 0) {
        finalizedDockerFile += experimentString;
      }
      if (this.state.selectedRAS.value !== "5.0.7") {
        finalizedDockerFile += rasText;
      }
      finalizedDockerFile += fileSystemString;
      finalizedDockerFile += this.state.endingString;
      const entrypoint = "HECRAS";
      this.props.receiveDockerInput({
        dockerTextFile: finalizedDockerFile,
        entrypoint: entrypoint
      });
    }
    if (
      this.props.state.entrypoint !== "set" &&
      !this.state.networkFileSystem
    ) {
      this.props.receiveDockerInput({
        entrypoint: "set"
      });
    }
  }
  closeManuallySelectedModal() {
    this.setState({isManuallySelectedModalOpen: false})
  }
  openManuallySelectedModal() {
    this.setState({isManuallySelectedModalOpen: true})
  }
  handleRasSelect(selectedRAS: any) {
    this.setState({
      selectedRAS
    });
  }
  handleSelectPlan(selectedPlan: any) {
    this.setState(prevState => ({
      selectedPlan: {                  
          ...prevState.selectedPlan,    
          value: selectedPlan,
          label: selectedPlan     
      }
  }))
  console.log(selectedPlan);
  }
  handleChange(type: keyof State) {
    return (e: any) => {
      const value = e.target.value;
      this.setState(updateState(type, value));
    };
  }
  toggleNetworkFileSystem() {
    return (e: any) => {
      this.setState({
        networkFileSystem: !this.state.networkFileSystem,
        checked: !this.state.checked
      });
    };
  }
  handleFiles(fileList: FileList) {
    this.setState({fileList: fileList})
    const extensionList: string[] = [];
    Array.from(fileList).forEach(fileObj => {
      const ext = fileObj.name.split(".").pop();
      if (extensionList.indexOf(ext) === -1) {
        extensionList.push(ext);
      }
    });
    const string = extensionList.join(" ");
    this.setState({
      manualFiles: string
    });
  }
  changeSelectedButton(newButton: string) {
    this.setState({ mode: newButton });
  }

  handleFileClear(index: number) {
    console.log(index);
    console.log(this.state.manualFiles)
    let list = {...this.state.fileList}
    list[index] = null;
    this.setState({ fileList: list });
    let extensionList: string[] = this.state.manualFiles.split(" ");
    extensionList[index] = null;
    const string = extensionList.join(" ");
    this.setState({
    manualFiles: string
    });

  }

  handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ checked: event.target.checked });
  }
  render() {
    const { selectedRAS, selectedPlan } = this.state;
    const rasOptions = [
      { value: "5.0.5", label: "5.0.5" },
      { value: "5.0.7", label: "5.0.7" }
    ];
    const planOptions = [
      { value: "Current", label: "Current" },
      { value: "All", label: "All" },
      { value: "Manually Select", label: "Manually Select" }
    ];
    let yesToggle = "white";
    let noToggle = "black";
    if (this.state.networkFileSystem) {
      yesToggle = "black";
      noToggle = "white;";
    }
    return (
      <div className="hecras-wizard">
        <div className="select-framework">
          <Box mt={1}>
            <div className="label">RAS Version</div>
            <Select
              value={selectedRAS}
              onChange={this.handleRasSelect}
              options={rasOptions}
              styles={this.customStyles}
              placeholder="Select ras version..."
              theme={theme => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "#4dc1ab",
                  primary: "#83f4dd"
                }
              })}
            />
          </Box>
        </div>
        <div className="label">Plan to Run</div>
        <Box mt={1}>
          <Select
            value={selectedPlan}
            onChange={this.handleSelectPlan}
            options={planOptions}
            styles={this.customStyles}
          />
        </Box>
        <Box mt={1}>
          <ButtonGroup
            toggleMode = {this.openManuallySelectedModal}
            changeSelectedButton={this.handleSelectPlan}
            mode={"mode"}
            buttons={["Current", "All", "Manually Selected"]}
          />
        </Box>
        <Box
          display="flex"
          justifyContent
          flexDirection="row"
          p={1}
          m={1}
          bgcolor="background.paper"
        >
          {/* {this.state.selectedPlan.value === "Manually Selected" && (
            <Box mt={1}>
              <input
                accept=""
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                onChange={e => this.handleFiles(e.target.files)}
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" color="primary" component="span">
                  Select
                </Button>
              </label>
            </Box>
          )}
           */}

          <Box mt={1} ml={3}>
            <FormControlLabel
              label="Project is in my Network File System."
              control={
                <Switch
                  checked={this.state.checked}
                  onChange={this.toggleNetworkFileSystem()}
                  value="checkedA"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              }
            />
          </Box>
        </Box>
        <HecResModal 
        isOpen = {this.state.selectedPlan.value === "Manually Selected" && this.state.isManuallySelectedModalOpen}
        targetFiles = {this.props.targetFiles}
        handleClose = {this.closeManuallySelectedModal}

        />
   
        {this.state.networkFileSystem && (
          <>
            <Box mt={1}>
              <TextField
                id="outlined-basic"
                label="RAS Model Path"
                variant="outlined"
                type="text"
                value={this.state.fileSystemMount}
                onMouseDown={e => e.stopPropagation()}
                onChange={this.handleChange("fileSystemMount")}
              />
            </Box>
            <Box mt={1}>
              <TextField
                id="outlined-basic"
                label="RAS Output Location (Galileo Volume)"
                variant="outlined"
                type="text"
                value={this.state.volumeLocation}
                onMouseDown={e => e.stopPropagation()}
                onChange={this.handleChange("volumeLocation")}
              />
            </Box>
            <Box mt={1}>
              <TextField
                id="outlined-basic"
                label="Experiment Name"
                variant="outlined"
                type="text"
                value={this.state.experimentName}
                onMouseDown={e => e.stopPropagation()}
                onChange={this.handleChange("experimentName")}
              />
            </Box>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveDockerInput: (object: any) => dispatch(receiveDockerInput(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(HecrasWizard);
