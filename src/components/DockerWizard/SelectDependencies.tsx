import React, { useState, useCallback } from "react"; // we need this to make JSX compile
import {
  MenuItem,
  Button,
  Typography,
  Box,
  IconButton,
  Chip
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray } from "formik";
import { Select } from "formik-material-ui";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import Dependency from "./Dependency";

const listOfDependencies = [
 "tidyr", "ggplot2", "ggraph","dplyr", "tidyquant", "dygraphs", "glue", "leaflet",
 "shiny"
];

interface SelectDependenciesProps {
  dependencies: Array<any>;
  dependency: string;
  initialValues: any;
}

const SelectDependencies: React.SFC<SelectDependenciesProps> = (
  props: SelectDependenciesProps
) => {
  let { dependencies, dependency, initialValues } = props;
  const [value, setValue] = useState(null);

  const [dependenciesList, setDependenciesList] = useState([]);
  const removeDependency = (index: number) => {
    const temp = [...dependenciesList];
    if (index > -1) {
      temp.splice(index, 1);
      setDependenciesList(temp);
      dependencies.splice(index, 1);
    }
  };
  const updateDependency = (index: number, value: string) => {
    let tempList = [...dependenciesList];
    tempList[index].version = value;
    setDependenciesList(tempList);
    dependencies = tempList;
  };

  // const addDependency = (dependency: string, version: string) =>{
  //   console.log(dependency)
  //   setDependenciesList([...dependenciesList, dependency]);
  //   console.log(dependenciesList)
  //   dependencies.push({name: dependency, version: initialValues.version})
  //   }
  
  const addDependency = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    console.log(value);
    setDependenciesList([
      ...dependenciesList,
      { name: value, version: "latest version" }
    ]);
    dependencies.push({ name: value, version: "latest version" });
  };
  // const updateDependency = (index: number) => {
  //   const temp = [...dependenciesList];
  //   if (index > -1) {
  //     temp.splice(index, 1);
  //     setDependenciesList(temp);
  //     dependencies.splice(index, 1);
  //   }
  // };
  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box fontSize="h2.fontSize" m={1}>
          Add dependencies for your {initialValues.projectType} project
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box m={1}>
          Things you normally need to install for your project via pkg.add()
        </Box>
      </Typography>
      <FieldArray
        name="dependencies"
        render={({ remove }) => (
          <div>
            <Box display="flex">
              {/* <Field
                component={Autocomplete}
                options={listOfDependencies}
                freeSolo
                getOptionLabel={(option: any) => option.title}
                name="dependency"
                variant="outlined"
                placeholder="Select Dependency"
                onBlur={addDependency}
                style={{ width: 300 }}
                renderInput={(params: any) => (
                  <TextField {...params} label="Combo box" variant="outlined" />
                )}
              /> */}
              <Box my={1}>
          <Autocomplete
            options={listOfDependencies}
            freeSolo
            value={value}
            style={{ width: 300 }}
            onChange={addDependency}
            onKeyPress={(event: React.KeyboardEvent) => {
              if (event.key == "Enter") event.preventDefault();
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Select dependency"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Box>

              {/* <Button
                            variant="outlined"
                            size= "large"
                            color="primary"
                            onClick={() => dependencies.push(dependency)}
                            startIcon={<AddIcon />}
                        >
                      </Button> */}
            </Box>
            <Box className = "dependency-list" display="flex" flexDirection="row" flexWrap="wrap">
              {dependenciesList.map((item: "srting", index: number) => {
                return (
                  <Dependency
                    updateDependency = {updateDependency}
                    item={item}
                    index = {index}
                     onDelete={() => removeDependency(index)}
                    // <Chip
                    //   className="margin-bottom"
                    //   label={item}
                    //   color="primary"
                    //   onDelete={() => removeDependency(index)}
                    //   size="small"
                    //   variant="outlined"
                  />
                );
              })}
            </Box>
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
