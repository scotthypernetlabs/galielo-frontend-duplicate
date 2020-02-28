import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import React from "react";

interface DoubleInputFormProps {
  textFieldValue1: string;
  onChange1: any;
  textFieldPlaceholder1: string;
  textFieldLabel1: string;
  textFieldValue2: string;
  textFieldPlaceholder2: string;
  textFieldLabel2: string;
  onChange2: any;
  checkBoxLabel: string;
  checkBoxChecked: boolean;
  checkBoxOnChange: any;
}

const DoubleInputForm: React.SFC<DoubleInputFormProps> = (
  props: DoubleInputFormProps
) => {
  const {
    textFieldValue1,
    textFieldPlaceholder1,
    textFieldLabel1,
    textFieldValue2,
    textFieldPlaceholder2,
    textFieldLabel2,
    onChange1,
    onChange2,
    checkBoxLabel,
    checkBoxChecked,
    checkBoxOnChange
  } = props;
  return (
    <div>
      <TextField
        value={textFieldValue1}
        placeholder={textFieldPlaceholder1}
        label={textFieldLabel1}
        variant="outlined"
        size="small"
        onChange={onChange1}
      />
      <TextField
        value={textFieldValue2}
        placeholder={textFieldPlaceholder2}
        label={textFieldLabel2}
        variant="outlined"
        size="small"
        onChange={onChange2}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="writePermissions"
            onChange={checkBoxOnChange}
            checked={checkBoxChecked}
          />
        }
        label={checkBoxLabel}
      />
    </div>
  );
};

export default DoubleInputForm;
