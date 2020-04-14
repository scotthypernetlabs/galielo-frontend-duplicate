import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
import React from "react";

const python = [
  {
    value: "2.7",
    label: "2.7"
  },
  {
    value: "3.6",
    label: "3.6"
  },
  {
    value: "TensorFlow",
    label: "TensorFlow"
  }
];
const julia = [
  {
    value: "1.0",
    label: "1.0"
  },
  {
    value: "1.1",
    label: "1.1"
  }
];
const hecRas = [
  {
    value: "5.0.5",
    label: "5.0.5"
  },
  {
    value: "5.0.7",
    label: "5.07"
  }
];

interface SelectVersionProps {
  projectType: any;
}

const SelectVersion: React.SFC<SelectVersionProps> = (
  props: SelectVersionProps
) => {
  const { projectType } = props;
  let options: Array<any> = [];
  if (projectType === "Python") {
    options = python;
  }
  if (projectType == "Julia") {
    options = julia;
  }
  if (projectType === "Hec-Ras") options = hecRas;
  return (
    <>
      <label htmlFor="projectVersion">Please Select a version</label>
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
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.value}
          </MenuItem>
        ))}
      </Field>
    </>
  );
};

export default SelectVersion;
