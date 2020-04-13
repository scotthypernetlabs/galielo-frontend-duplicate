import { Field, Form, Formik } from "formik"; // we need this to make JSX compile
import { MenuItem } from "@material-ui/core";
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

interface SelectFileProps {
  projectType: any;
}

const SelectFile: React.SFC<SelectFileProps> = (props: SelectFileProps) => {
  const { projectType } = props;
  let options = [];
  if (projectType === "Python") {
    options = python;
  } else {
    options = julia;
  }
  return (
    <>
      <label htmlFor="projectVersion">Name of your file</label>
      <Field
        required
        component={TextField}
        name="projectFile"
        variant="outlined"
        inputProps={{
          id: "framework"
        }}
      ></Field>
    </>
  );
};

export default SelectFile;
