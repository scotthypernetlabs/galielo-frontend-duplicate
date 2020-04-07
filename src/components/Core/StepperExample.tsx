import { Card } from "@material-ui/core";
import React from "react";
import Stepper, { IActiveStep } from "./Stepper";

interface IProps {}

const StepperExample: React.SFC<IProps> = (props: IProps) => {
  const [step, setStep] = React.useState(0);
  const onClickBack = () => {
    setStep(step - 1);
  };
  const onClickNext = () => {
    setStep(step + 1);
  };
  const step1: IActiveStep = {
    label: "step 1",
    backButtonText: "Cancel",
    nextButtonText: "Next",
    onClickBack,
    onClickNext
  };
  const step2: IActiveStep = {
    label: "step 2",
    backButtonText: "Back",
    nextButtonText: "Run",
    onClickBack,
    onClickNext
  };

  const steps = [step1, step2];

  return <Stepper activeStep={step} steps={steps} />;
};

export default StepperExample;
