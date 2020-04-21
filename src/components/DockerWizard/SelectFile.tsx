import { Field } from "formik"; // we need this to make JSX compile
import { TextFieldProps, fieldToTextField } from "formik-material-ui";
import MuiTextField from "@material-ui/core/TextField";
import React from "react";
import { format } from "path";
import InputAdornment from '@material-ui/core/InputAdornment';


interface SelectFileProps {
  projectFile: any;
  // handleBlur?: any;
  values: any;
  props: any;
}
function checkExtensionTextField(props: TextFieldProps) {
  let extension: string;
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
  const {
    field,
    form: { setFieldValue, values },
    field: { name }
  } = props;
  const onChange = React.useCallback(
    event => {
      let { value } = event.target;
      if (!value.includes(extension) && value !== "") {
        value = value + extension;
      }

      setFieldValue(name, value ? value : "");
    },
    [setFieldValue, name]
  );
  return (
    <>
    <MuiTextField
    value = {values.selectFile}
      label={`Name of your ${extension} file eg. project ${extension}`}
      {...fieldToTextField(props)}
      onBlur={onChange}
      required
    />
    </>
  );
}

const SelectFile: React.SFC<SelectFileProps> = (props: SelectFileProps) => {
  let extension: string;
  switch (props.props.values.projectType) {
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
      <Field
        required
        InputProps={{
          endAdornment: <InputAdornment position="end">{extension}</InputAdornment>,
          }}
        component={checkExtensionTextField}
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
