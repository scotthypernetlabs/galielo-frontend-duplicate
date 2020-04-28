import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { ProjectTypesReceived } from "../../business/objects/projectType";
import { Select, TextField } from "formik-material-ui";
import React, { useState } from "react";

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
    <div>
      <Field
        className="center-vertically"
        component={TextField}
        name="projectVersion"
        select
        required
        style={{ width: 500 }}
        selectedValue={versions[0]}
        value="test"
        label="Please Select a version"
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
    </div>
  );
};

export default SelectVersion;
