import { Button, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";

interface SingleTextFieldProps {
  textFieldLabel: string;
  textFieldPlaceholder: string;
  textFieldValue: any;
  onClick: any;
  onChange: any;
  buttonText: string;
  buttonDisabled: boolean;
}
const SingleTextField: React.SFC<SingleTextFieldProps> = (
  props: SingleTextFieldProps
) => {
  const {
    textFieldLabel,
    textFieldPlaceholder,
    textFieldValue,
    onClick,
    onChange,
    buttonText,
    buttonDisabled
  } = props;
  return (
    <Box display="flex" flexDirection="row">
      <Box flexGrow={1}>
        <TextField
          size="small"
          variant="outlined"
          placeholder={textFieldPlaceholder}
          label={textFieldLabel}
          value={textFieldValue}
          onChange={onChange}
        />
      </Box>
      <Box>
        {
          <Button
            variant="contained"
            size="small"
            disabled={buttonDisabled}
            color="primary"
            style={{ width: "80px", height: "50px" }}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        }
      </Box>
    </Box>
  );
};

export default SingleTextField;
