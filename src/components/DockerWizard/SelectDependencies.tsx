import React, { useState } from "react"; // we need this to make JSX compile
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
  {
    title: "tidyr",
    description:
      "As the name suggests, we use tidyr to make the data ‘tidy’. It works well with dplyr. "
  },
  {
    title: "ggplot2",
    description:
      "With ggplot2, you can create graphics declaratively. ggplot2 is famous for its elegant and quality graphs that sets it apart from other visualization packages."
  },
  {
    title: "ggraph",
    description:
      "We use this library for performing data wrangling and data analysis. "
  },
  {
    title: "dplyr",
    description:
      "tidyquant is a financial package that is used for carrying out quantitative financial analysis. "
  },
  {
    title: "tidyquant",
    description:
      "The dygraphs package in R provides an interface to the main JavaScript library that we can use for charting."
  },
  {
    title: "dygraphs",
    description:
      "The leaflet is an open-source JavaScript library for creating interactive visualizations. "
  },
  {
    title: "glue",
    description:
      "This is a mapping package that is used for delineating spatial visualizations. "
  },
  {
    title: "leaflet",
    description:
      "The developers made this package for performing the operation of data wrangling."
  },
  {
    title: "shiny",
    description:
      "With the help of shiny, you can develop interactive and aesthetically pleasing web apps using R."
  }
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
  const [dependenciesList, setDependenciesList] = useState([]);
  const removeDependency = (index: number) => {
    const temp = [...dependenciesList];
    if (index > -1) {
      temp.splice(index, 1);
      setDependenciesList(temp);
      dependencies.splice(index, 1);
    }
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
  let options = [];
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
              <Field
                component={Autocomplete}
                options={listOfDependencies}
                getOptionLabel={(option: any) => option.title}
                name="dependency"
                variant="outlined"
                placeholder="Select Dependency"
                onInputChange={addDependency}
                style={{ width: 300 }}
                renderInput={(params: any) => (
                  <TextField {...params} label="Combo box" variant="outlined" />
                )}
              />

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
                    item={item}
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
