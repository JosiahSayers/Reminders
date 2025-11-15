import { Fieldset, TextInput } from "@mantine/core";
import { useContext } from "react";
import { NewReminderContext } from "../new-reminder-context";

export default function FirstStep() {
  //   return "Here we will ask for a description and send it to the api to generate a cron string. Then we will set that cron string and explanation to context.";
  const { firstStepForm, setFirstStepForm } = useContext(NewReminderContext);

  return (
    <Fieldset legend="Schedule">
      <TextInput
        label="Describe when this reminder should happen"
        placeholder="Every first Tuesday of the month at 3pm"
        value={firstStepForm.description}
        onChange={(e) => {
          setFirstStepForm({ description: e.target.value });
        }}
      />
    </Fieldset>
  );
}
