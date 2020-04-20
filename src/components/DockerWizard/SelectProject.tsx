import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
import { TextFieldProps, fieldToTextField } from "formik-material-ui";
import MuiTextField from "@material-ui/core/TextField";
import React from "react";
const options = [
  {
    value: "Hec-Ras",
    label: "Hec-Ras"
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

interface SelectProjectProps {
  props?: any;
  incrementStep: any;
}
function checkExtensionTextField(props: TextFieldProps) {  
  const {
    form: { resetForm, setFieldValue, values },
    field: { name }
  } = props;
  const onChange = React.useCallback(
    event => {
      let { value } = event.target;
      console.log(value);
      resetForm({...values,  "projectVersion": '', "profectFile": ''})
      console.log(values)
      setFieldValue("projectType",value , true);
    },
    [resetForm, "projectType"]
  );
  return (
    <>
    <MuiTextField
      {...fieldToTextField(props)}
      onChange={onChange}
      required
    />
    </>
  );
}
const SelectProject: React.SFC<SelectProjectProps> = (
  props: SelectProjectProps
) => {
  const { incrementStep} = props;
  
  const test = ()=> {props.props.setFieldValue("projectFile", "lalala", true)

  props.props.values.projectFile === "";}
  console.log(props.props.values);
  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box fontSize="h2.fontSize" mb={1}>
          {"Let's configure your project"}
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box mb={3}>
          {"We need to know your project's enviroment to run it in Galileo "}
        </Box>
      </Typography>

      <Field
        component={checkExtensionTextField}
        name="projectType"
        select
        label="Please select the type of your project"
        required
        variant="outlined"
        placeholder="Select a project type"
        inputProps={{
          id: "framework"
        }}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          }
        }}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.value}
          </MenuItem>
        ))}
      </Field>
    </>
  );
};

export default SelectProject;
