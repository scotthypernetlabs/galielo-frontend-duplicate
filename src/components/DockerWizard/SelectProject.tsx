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
  incrementStep: any;
}

const SelectProject: React.SFC<SelectProjectProps> = (
  props: SelectProjectProps
) => {
  const { incrementStep } = props;
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
        onChange={props.incrementStep}
        variant="outlined"
        placeholder="Select a project type"
        inputProps={{
          id: "framework"
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
