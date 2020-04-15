import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { ProjectTypesReceived } from "../../business/objects/projectType";
import { Select, TextField } from "formik-material-ui";
import React from "react";

interface SelectVersionProps {
  projectType: any;
  projectTypes: ProjectTypesReceived[];
  setSelectedProjectType: (projectType: string, version: string) => void;
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
      <label htmlFor="projectVersion">Please Select a version</label>

      <Field
        component={Select}
        name="projectVersion"
        required
        value="test"
        label="Select a version"
        variant="outlined"
        inputProps={{
          id: "framework",
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedProjectType(projectType, e.target.value);
          }
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
