import { Box, Stepper as MuiStepper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

export interface IActiveStep {
  label: string;
  backButtonText: string;
  nextButtonText: string;
  onClickBack: (e: any) => void;
  onClickNext: (e: any) => void;
}

interface StepperProps {
  activeStep: number;
  steps: IActiveStep[];
}

const Stepper: React.SFC<StepperProps> = (props: StepperProps) => {
  const { activeStep, steps } = props;

  return (
    <div>
      <MuiStepper activeStep={activeStep} alternativeLabel>
        {steps.map((step: IActiveStep) => (
          <Step key={activeStep}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
      <div>
        {activeStep < steps.length && (
          <Box display="flex" justifyContent="center">
            <Button variant="outlined" onClick={steps[activeStep].onClickBack}>
              {steps[activeStep].backButtonText}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={steps[activeStep].onClickNext}
            >
              {steps[activeStep].nextButtonText}
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
};

export default Stepper;
