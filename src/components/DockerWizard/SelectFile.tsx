import { Field, Form, Formik } from "formik"; // we need this to make JSX compile
import { MenuItem } from "@material-ui/core";
import {
  Select,
  Switch,
  TextField,
  TextFieldProps,
  fieldToTextField
} from "formik-material-ui";
import MuiTextField from "@material-ui/core/TextField";
import React from "react";

interface SelectFileProps {
  projectFile: any;
  // handleBlur?: any;
  values: any;
}
function UpperCasingTextField(props: TextFieldProps) {
  const {
    form: { setFieldValue },
    field: { name }
  } = props;
  const onChange = React.useCallback(
    event => {
      let extension: string;
      console.log(props.form.values.projectType);
      switch (props.form.values.projectType) {
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
      console.log(props.form.values.projectType);

      let { value } = event.target;
      if (!value.includes(extension)) {
        value = value + extension;
      }

      setFieldValue(name, value ? value : "");
    },
    [setFieldValue, name]
  );
  return (
    <MuiTextField
      label={"eg. project"}
      {...fieldToTextField(props)}
      onBlur={onChange}
    />
  );
}

const SelectFile: React.SFC<SelectFileProps> = (props: SelectFileProps) => {
  const { projectFile, values } = props;

  return (
    <>
      {/* <label htmlFor="projectFile">Name of your {extension} file</label> */}
      <Field
        required
        component={UpperCasingTextField}
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
