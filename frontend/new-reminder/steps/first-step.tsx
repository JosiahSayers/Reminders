import { Fieldset, TextInput } from "@mantine/core";
import { useContext } from "react";
import {
  NewReminderContext,
  scheduleFormSchema,
} from "../new-reminder-context";

export default function FirstStep() {
  //   return "Here we will ask for a description and send it to the api to generate a cron string. Then we will set that cron string and explanation to context.";
  const { scheduleForm, setScheduleForm, validationError } =
    useContext(NewReminderContext);
  const { error: zodError } = scheduleFormSchema.safeParse(scheduleForm);
  const getError = (property: string) =>
    zodError?.issues.find((issue) => issue.path[0] === property)?.message;

  return (
    <Fieldset legend="Schedule">
      <TextInput
        label="Describe when this reminder should happen"
        placeholder="Every first Tuesday of the month at 3pm"
        value={scheduleForm.description}
        onChange={(e) => {
          setScheduleForm({ description: e.target.value });
        }}
        error={validationError && getError("description")}
      />
    </Fieldset>
  );
}
