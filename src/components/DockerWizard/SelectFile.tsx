import { Field } from "formik"; // we need this to make JSX compile
import { TextFieldProps, fieldToTextField } from "formik-material-ui";
import MuiTextField from "@material-ui/core/TextField";
import React from "react";

interface SelectFileProps {
  projectFile: any;
  values: any;
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
    form: { setFieldValue },
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
        value={"test" + extension}
        label={`Name of your ${extension} file eg. project ${extension}`}
        {...fieldToTextField(props)}
        onBlur={onChange}
        required
      />
    </>
  );
}

const SelectFile: React.SFC<SelectFileProps> = (props: SelectFileProps) => {
  return (
    <>
      <Field
        required
        component={checkExtensionTextField}
        name="projectFile"
        variant="outlined"
        inputProps={{
          id: "framework"
        }}
      />
    </>
  );
};

export default SelectFile;
