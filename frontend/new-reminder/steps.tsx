import { Box, Button, Group, Stepper } from "@mantine/core";
import { useContext } from "react";
import { NewReminderContext } from "./new-reminder-context";
import { useLocation } from "wouter";
import FirstStep from "./steps/first-step";
import SecondStep from "./steps/second-step";
import ThirdStep from "./steps/third-step";
import CompletedStep from "./steps/completed-step";

export default function Steps() {
  const { step, setStep, previousStep, nextStep, completed } =
    useContext(NewReminderContext);
  const [location, navigate] = useLocation();

  return (
    <>
      <Stepper active={step} onStepClick={setStep}>
        <Stepper.Step label="Schedule" description="When to send">
          <Box p="xl">
            <FirstStep />
          </Box>
        </Stepper.Step>
        <Stepper.Step label="Confirm Schedule">
          <Box p="xl">
            <SecondStep />
          </Box>
        </Stepper.Step>
        <Stepper.Step label="Details" description="What to send">
          <Box p="xl">
            <ThirdStep />
          </Box>
        </Stepper.Step>
        <Stepper.Completed>
          <Box p="xl">
            <CompletedStep />
          </Box>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={previousStep} disabled={completed}>
          Back
        </Button>
        <Button onClick={() => (completed ? navigate("/") : nextStep())}>
          {completed ? "Done" : "Next step"}
        </Button>
      </Group>
    </>
  );
}
