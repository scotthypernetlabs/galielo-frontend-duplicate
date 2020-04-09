import React from 'react'; // we need this to make JSX compile
import { MenuItem, Button } from "@material-ui/core";
import { Formik, Form, Field, FieldArray  } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';





interface SelectDependenciesProps {
  dependencies: Array<string>;
  dependency: string
}

const SelectDependencies: React.SFC<SelectDependenciesProps> = ( props: SelectDependenciesProps) => {
  const { dependencies, dependency } = props;
  const removeDependency = (dependencies: Array<string>,dependency: string) =>{
    const index = dependencies.indexOf(dependency);
    if (index !== -1) dependencies.splice(index, 1);
  }
  let options = [];
  return (
    <FieldArray
              name="dependencies"
              render={({ remove }) => (
                  
                <div>
                     <Button
                                variant="outlined"
                                size= "large"
                                color="primary"
                                onClick={() => dependencies.push(dependency)}
                                startIcon={<AddIcon />}
                            >
                                Add Dependency
                            </Button>
       
                          <Field
                            component={TextField}
                            name='dependency'
                            Variant = "outlined"
                            placeholder="Select Dependency"
                            type="text"
                          />
                           <Button
                                variant="outlined"
                                size= "large"
                                color="primary"
                                onClick={() => removeDependency(dependencies, dependency)}
                                startIcon={<DeleteIcon />}
                            >
                            </Button>
                      </div>
                    )}
            
            />
  );
};

export default SelectDependencies;
