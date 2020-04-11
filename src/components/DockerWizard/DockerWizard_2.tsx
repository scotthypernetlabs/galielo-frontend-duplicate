import * as React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem
} from "@material-ui/core";
import { Dispatch } from "redux";
import {
  DockerInputState,
  DockerWizardOptions,
  IDockerInput
} from "../../business/objects/dockerWizard";
import { Field, Form, Formik } from "formik";
import { Framework } from "../../business/interfaces/IProjectService";
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
import { Select, TextField } from "formik-material-ui";
import { connect } from "react-redux";
import { context } from "../../context";
import ProgressBar from "../ProgressBar";
import SimpleModal from "./SimpleModal";

const path = require("path");

export interface IDockerWizardProps {}

export interface IDockerWizardState {}

interface Values {
  framework: string;
}
// frameworks will be replaced witht eh server
const frameworks = [
  {
    value: "Hec-Res",
    label: "Hec-Res"
  },
  {
    value: "Julia",
    label: "Julia"
  },
  {
    value: "Python",
    label: "Python"
  },
  {
    value: "R",
    label: "R"
  },
  {
    value: "Stata",
    label: "Stata"
  }
];

class DockerWizard_2 extends React.Component<
  IDockerWizardProps,
  IDockerWizardState
> {
  constructor(props: IDockerWizardProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <Formik
        initialValues={{
          framework: ""
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log("framework: ", values);
          setSubmitting(false);
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <InputLabel htmlFor="age-simple-empty" shrink>
              Age (Empty)
            </InputLabel>
            <FormControl>
              <InputLabel htmlFor="framework">Age</InputLabel>
              <Field
                component={Select}
                name="framework"
                inputProps={{
                  id: "framework"
                }}
              >
                {frameworks.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
            <br></br>
            <Button variant="contained" color="primary" onClick={submitForm}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}
export default DockerWizard_2;
