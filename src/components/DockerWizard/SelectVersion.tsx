import React from 'react'; // we need this to make JSX compile
import { MenuItem, Typography, Box } from "@material-ui/core";
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';

const python = [
    {
      value: '2.7',
      label: '2.7'
  },
  {
      value: '3.6',
      label: '3.6'
  },
  {
      value: 'TensorFlow',
      label: 'TensorFlow'
  }]
  const julia= [
    {
      value: '1.0',
      label: '1.0'
  },
  {
    value: '1.1',
    label: '1.1'
}
]



interface SelectVersionProps {
  projectType: any;
}

const SelectVersion: React.SFC<SelectVersionProps> = (
  props: SelectVersionProps
) => {
  const { projectType } = props;
  let options = [];
  if (projectType === "Python"){
    options = python;
} else {
    options = julia;
}
  return (
    <>
    <label htmlFor="projectVersion">
     Version
    </label>
    <Field
        component={TextField}
        name="projectVersion"
        select
        required 
        variant = "outlined"
        inputProps={{
            id: 'framework',
            }}
    >
    {options.map(option =>(
        <MenuItem key = {option.value} value= {option.value}>
            {option.value}
        </MenuItem>
    ))}
</Field>
</>
  );
};

export default SelectVersion;
