import { Box, Stepper as MuiStepper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

interface StepperProps {
  steps: string[];
  onClickFinish: any;
  onClickCancel: any;
  stepContent: JSX.Element[];
}

const Stepper: React.SFC<StepperProps> = (props: StepperProps) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { steps, onClickFinish, onClickCancel, stepContent } = props;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <div>
      {stepContent[activeStep]}
      <MuiStepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
      <div>
        {activeStep < steps.length && (
          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={activeStep == 0 ? onClickCancel : handleBack}
            >
              {activeStep == 0 ? "Cancel" : "Back"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                activeStep === steps.length - 1 ? onClickFinish : handleNext
              }
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
};

export default Stepper;
