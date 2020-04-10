import React, { useState } from 'react'; // we need this to make JSX compile
import { MenuItem, Button, Typography, Box, IconButton, Chip } from "@material-ui/core";
import { Formik, Form, Field, FieldArray  } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';





interface SelectDependenciesProps {
  dependencies: Array<any>;
  dependency: string;
  initialValues: any;
}

const SelectDependencies: React.SFC<SelectDependenciesProps> = ( props: SelectDependenciesProps) => {
  let { dependencies, dependency, initialValues } = props;
  const [dependenciesList, setDependenciesList] = useState(dependencies);
  const removeDependency = (index: number) =>{
    const temp = [...dependenciesList]
      if (index > -1) {
      temp.splice(index, 1);
    setDependenciesList(temp);
    dependencies.splice(index, 1);
    }
  }
  const addDependency = (dependency: string, version: string) =>{
    setDependenciesList([...dependenciesList, dependency]);
    dependencies.push({name: dependency, version: initialValues.version})
    }
  let options = [];
  return (
    <>
     <Typography color="primary" id="depndencies-header">
            <Box fontSize="h2.fontSize" m={1}>
              Add dependencies for your {initialValues.projectType} project
            </Box>
          </Typography>
          <Typography  id="dependencies-helper-text">
            <Box  m={1}>
              Things you normally need to install for your project via pkg.add()
            </Box>
          </Typography>
    <FieldArray
              name="dependencies"
              render={({ remove }) => (
                
                <div>
                  <Box display ="flex">
                    <Field 
                              component={TextField}
                              name='dependency'
                              variant = "outlined"
                              placeholder="Select Dependency"
                              type="text"
                            />
                            <Field 
                              component={TextField}
                              name='version'
                              variant = "outlined"
                              placeholder="Select Dependency"
                              type="text"
                            />
                             <IconButton 
                                color="primary" 
                                aria-label="add dependency" 
                                onClick={()=>addDependency(dependency, initialValues.version) }
                                component="span">
                                  <AddIcon />
                             </IconButton>
                      {/* <Button
                            variant="outlined"
                            size= "large"
                            color="primary"
                            onClick={() => dependencies.push(dependency)}
                            startIcon={<AddIcon />}
                        >
                      </Button> */}
                      

                  </Box>
                  {dependenciesList.map((item:'srting', index:number) => {
          return (
            <>
              <span>
                <Chip
                  className="margin-bottom"
                  label={item}
                  color="primary"
                  onDelete={() => removeDependency(index)}
                  size="small"
                  variant="outlined"
                />
              </span>
            </>
          );
        })}
                        {/* <Button
                            variant="outlined"
                            size= "large"
                            color="primary"
                            onClick={() => removeDependency(dependencies, dependency)}
                            startIcon={<DeleteIcon />}
                        ></Button> */}
                      </div>
                    )}
            
            />
            </>
  );
};

export default SelectDependencies;
