import { Field } from "formik"; // we need this to make JSX compile
import { TextField, fieldToTextField } from "formik-material-ui";
import MuiTextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { format } from "path";
import InputAdornment from '@material-ui/core/InputAdornment';


interface SelectFileProps {
  projectFile: any;
  // handleBlur?: any;
  values: any;
  props: any;
}
// function checkExtensionTextField(props: TextFieldProps) {
//   let extension: string;
//   switch (props.form.values.projectType) {
//     case "Julia":
//       extension = ".JL";
//       break;
//     case "Python":
//       extension = ".py";
//       break;
//     case "R":
//       extension = ".R";
//       break;
//     case "Stata":
//       extension = ".DO";
//       break;
//     default:
//       extension = "";
//   }
//   const {
//     field,
//     form: { setFieldValue, values },
//     field: { name }
//   } = props;
//   const onChange = React.useCallback(
//     event => {
//       let { value } = event.target;
//       if (!value.includes(extension) && value !== "") {
//         value = value + extension;
//       }

//       setFieldValue(name, value ? value : "");
//     },
//     [setFieldValue, name]
//   );
//   return (
//     <> 
//     <MuiTextField
//     value = {values.selectFile}
//       label={`Name of your ${extension} file eg. project ${extension}`}
//       {...fieldToTextField(props)}
//       onBlur={onChange}
//       required
//     />
//     </>
//   );
// }

const SelectFile: React.SFC<SelectFileProps> = (props: SelectFileProps) => {
  let extension: string;
  const [file, setFile] = useState("");
  
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
      const {
            field,
            form: { setFieldValue, values },
            field: { name }
          } = props.props;
          const onChange = (
            event:any )=> {
              let { value } = event.target;
              if (!value.includes(extension) && value !== "") {
                 value = value + extension;
               }
        
               setFieldValue(name, value ? value : "");
            // },
            // [setFieldValue, name]
            };
  }
  const hadleChange = (target:any) =>{
    
    let { value } = target;
    console.log(value)
    value = value + "test"
    // setFile(value);
    // props.props.setFieldValue("projectFile", value );
    // [props.props.setFieldValue, "projectFile"]

  }

  return (
    <>
      <Field
        required
        InputProps={{
          endAdornment: <InputAdornment position="end">{extension}</InputAdornment>,
          }}
        component={TextField}
        style={{ width: 500 }}
        onChange={ hadleChange(event.target as HTMLInputElement)}
        label={`Name of your ${extension} file eg. project for project ${extension} file`}
        name="projectFile"
        variant="outlined"
        // value = {}
        inputProps={{
          id: "framework"
        }}
      ></Field>
    </>
  );
};

export default SelectFile;
