import { Box, Button, Group, Stepper } from "@mantine/core";
import { useContext, useEffect, type PropsWithChildren } from "react";
import { NewReminderContext } from "./new-reminder-context";
import { useLocation } from "wouter";
import FirstStep from "./steps/first-step";
import SecondStep from "./steps/second-step";
import ThirdStep from "./steps/third-step";
import CompletedStep from "./steps/completed-step";
import { AppContext } from "../app-context";

const StepWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Box
      p={{
        base: "xs",
        md: "xl",
      }}
    >
      {children}
    </Box>
  );
};

export default function Steps() {
  const { step, setStep, previousStep, nextStep, completed, lastStep } =
    useContext(NewReminderContext);
  const [location, navigate] = useLocation();
  const { aiEnabled } = useContext(AppContext);

  useEffect(() => {
    if (!aiEnabled) {
      setStep(2);
    }
  }, [aiEnabled]);

  const getStepText = () => {
    if (completed) {
      return "Done";
    }

    if (lastStep) {
      return "Create";
    }

    return "Next Step";
  };

  return (
    <>
      <Stepper active={step} onStepClick={setStep}>
        <Stepper.Step label="Schedule" description="When to send">
          <StepWrapper>
            <FirstStep />
          </StepWrapper>
        </Stepper.Step>
        <Stepper.Step label="Confirm Schedule">
          <StepWrapper>
            <SecondStep />
          </StepWrapper>
        </Stepper.Step>
        <Stepper.Step label="Details" description="What to send">
          <StepWrapper>
            <ThirdStep />
          </StepWrapper>
        </Stepper.Step>
        <Stepper.Completed>
          <StepWrapper>
            <CompletedStep />
          </StepWrapper>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={previousStep} disabled={completed}>
          Back
        </Button>
        <Button onClick={() => (completed ? navigate("/") : nextStep())}>
          {getStepText()}
        </Button>
      </Group>
    </>
  );
}
