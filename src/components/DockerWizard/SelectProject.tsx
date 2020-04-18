import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { ProjectTypesReceived } from "../../business/objects/projectType";
import { Select, TextField } from "formik-material-ui";
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
  incrementStep: any;
  projectTypes: ProjectTypesReceived[];
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
        <Box mb={3}>
          {"We need to know your project's environment to run it in Galileo"}
        </Box>
      </Typography>
      <Field
        component={TextField}
        name="projectType"
        select
        label="Please select the type of your project"
        required
        onChange={incrementStep}
        variant="outlined"
        placeholder="Select a project type"
        inputProps={{
          id: "framework"
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
