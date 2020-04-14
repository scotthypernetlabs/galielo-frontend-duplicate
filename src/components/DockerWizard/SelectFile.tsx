import { Field, Form, Formik } from "formik"; // we need this to make JSX compile
import { MenuItem } from "@material-ui/core";
import { Select, TextField } from "formik-material-ui";
import React from "react";
interface SelectFileProps {
  projectType: any;
}

const SelectFile: React.SFC<SelectFileProps> = (props: SelectFileProps) => {
  const { projectType } = props;
  let extension: string;
  switch (projectType) {
    case "Julia":
      extension = ".JL";
      break;
    case "Python":
      extension = ".py";
      break;
    case "R":
      extension = ".R";
      break;
    case "Stata":
      extension = ".DO";
      break;
    default:
      extension = "";
  }
  return (
    <>
      <label htmlFor="projectVersion">Name of your {extension} file</label>
      <Field
        required
        component={TextField}
        name="destinationPath"
        variant="outlined"
        inputProps={{
          id: "framework"
        }}
      ></Field>
    </>
  );
};

export default SelectFile;
