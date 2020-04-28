import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { ProjectTypesReceived } from "../../business/objects/projectType";
import {
  Select,
  TextField,
  TextFieldProps,
  fieldToTextField
} from "formik-material-ui";
import MuiTextField from "@material-ui/core/TextField";
import React from "react";
// const options = [
//   {
//     value: "Hec-Ras",
//     label: "Hec-Ras"
//   },
//   {
//     value: "Julia",
//     label: "Julia"
//   },
//   {
//     value: "Python",
//     label: "Python"
//   },
//   {
//     value: "R",
//     label: "R"
//   },
//   {
//     value: "Stata",
//     label: "Stata"
//   }
// ];

interface SelectProjectProps {
  props?: any;
  incrementStep: any;
  projectTypes: ProjectTypesReceived[];
}
function checkExtensionTextField(props: TextFieldProps) {
  const {
    form: { resetForm, setFieldValue, values },
    field: { name }
  } = props;
  const onChange = React.useCallback(
    event => {
      const { value } = event.target;

      resetForm({ ...values, projectVersion: "", projectFile: "" });

      setFieldValue("projectType", value, true);
    },
    [resetForm, "projectType"]
  );
  return (
    <>
      <MuiTextField {...fieldToTextField(props)} onChange={onChange} required />
    </>
  );
}
const SelectProject: React.SFC<SelectProjectProps> = (
  props: SelectProjectProps
) => {
  const { incrementStep, projectTypes } = props;
  const projectTypeFiltered: string[] = projectTypes.map(
    (projectType: ProjectTypesReceived) => {
      return projectType.name;
    }
  );

  projectTypeFiltered.filter((v, i) => projectTypeFiltered.indexOf(v) === i);

  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box fontSize="h2.fontSize" mb={1}>
          {"Let's configure your project"}
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box mb={7}>
          {"We need to know your project's enviroment to run it in Galileo "}
        </Box>
      </Typography>
      <Field
        className="center-vertically"
        component={checkExtensionTextField}
        name="projectType"
        select
        label="Please select the type of your project"
        required
        onChange={incrementStep}
        style={{ width: 500 }}
        value={projectTypeFiltered[0]}
        defaultValue={projectTypeFiltered[0]}
        variant="outlined"
        placeholder="Select a project type"
        inputProps={{
          id: "framework"
        }}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          }
        }}
      >
        {projectTypeFiltered.map((projectType: string) => (
          <MenuItem key={projectType} value={projectType}>
            {projectType}
          </MenuItem>
        ))}
      </Field>
    </>
  );
};

export default SelectProject;
