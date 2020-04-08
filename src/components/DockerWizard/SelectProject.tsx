import React from 'react'; // we need this to make JSX compile
import { MenuItem } from "@material-ui/core";
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
const options = [
    {
      value: 'Hec-Res',
      label: 'Hec-Res'
  },
  {
      value: 'Julia',
      label: 'Julia'
  },
  {
      value: 'Python',
      label: 'Python'
  },
  {
      value: 'R',
      label: 'R'
  },
  {
      value: 'Stata',
      label: 'Stata'
  }]

const SelectProject: React.FunctionComponent = () => (
    
<Field
                    component={TextField}
                    name="ProjectType"
                    helperText="Please select the framework of your project"
                    select
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
  );

  export default SelectProject;