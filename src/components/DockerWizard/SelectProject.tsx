import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
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

const SelectProject: React.SFC<SelectProjectProps> = (
  props: SelectProjectProps
) => {
  const { incrementStep} = props;
  console.log(props)
  const test = ()=> {props.props.setFieldValue("projectFile", "", true)}
  console.log(props.props)
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
        component={TextField}
        name="projectType"
        select
        label="Please select the type of your project"
        required
        onBlur={test}
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
