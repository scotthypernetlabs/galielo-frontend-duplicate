import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { ProjectTypesReceived } from "../../business/objects/projectType";
import { Select, TextField } from "formik-material-ui";
import React from "react";

interface SelectVersionProps {
  projectType: any;
  projectTypes: ProjectTypesReceived[];
  setSelectedProjectType: any;
}

const SelectVersion: React.SFC<SelectVersionProps> = (
  props: SelectVersionProps
) => {
  const { projectType, projectTypes, setSelectedProjectType } = props;
  const versions: string[] = projectTypes.map(
    (project: ProjectTypesReceived) => {
      if (project.name == projectType) {
        return project.version;
      }
    }
  );
  return (
    <>
      <label htmlFor="projectVersion">Version</label>
      <Field
        component={TextField}
        name="projectVersion"
        select
        required
        variant="outlined"
        inputProps={{
          id: "framework"
        }}
      >
        {versions.map(version => (
          <MenuItem key={version} value={version}>
            {version}
          </MenuItem>
        ))}
      </Field>
    </>
  );
};

export default SelectVersion;
