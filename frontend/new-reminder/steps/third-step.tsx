import { Fieldset, Textarea, TextInput } from "@mantine/core";
import { detailsFormSchema, NewReminderContext } from "../new-reminder-context";
import { useContext } from "react";

export default function ThirdStep() {
  const { cron, detailsForm, setDetailsForm, validationError } =
    useContext(NewReminderContext);
  const { error: zodError } = detailsFormSchema.safeParse(detailsForm);
  const getError = (property: string) =>
    zodError?.issues.find((issue) => issue.path[0] === property)?.message;

  //   return "Here we will ask for details about the reminder such as what to title it and what the content should be. Then we will send all of the information to the api to create a new reminder.";
  return (
    <Fieldset legend="Details">
      <TextInput
        label="Title"
        placeholder="Bathe Mooey"
        mb="md"
        value={detailsForm.title}
        onChange={(e) =>
          setDetailsForm({
            ...detailsForm,
            title: e.target.value,
          })
        }
        error={validationError && getError("title")}
      />
      <Textarea
        label="Content"
        placeholder="By now the dog is probably stinky. You should fix that."
        mb="md"
        value={detailsForm.content}
        onChange={(e) =>
          setDetailsForm({
            ...detailsForm,
            content: e.target.value,
          })
        }
        error={validationError && getError("content")}
      />
      <TextInput
        label="Schedule Description"
        value={cron?.explanation}
        disabled
        mb="md"
        description="Return to the first step to change this value"
      />
      <TextInput
        label="Cron"
        value={cron?.cron}
        disabled
        description="Return to the first step to change this value"
      />
    </Fieldset>
  );
}
