import { Fieldset, Textarea, TextInput } from "@mantine/core";
import { detailsFormSchema, NewReminderContext } from "../new-reminder-context";
import { useContext, useEffect } from "react";
import cronstrue from "cronstrue";

export default function ThirdStep() {
  const { detailsForm, setDetailsForm, validationError } =
    useContext(NewReminderContext);
  const { error: zodError } = detailsFormSchema.safeParse(detailsForm);
  const getError = (property: string) =>
    zodError?.issues.find((issue) => issue.path[0] === property)?.message;

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
        value={detailsForm.cronExplanation}
        disabled
        mb="md"
        description="Return to the first step to change this value"
        error={getError("cron")}
      />
      <TextInput
        label="Cron"
        value={detailsForm.cron}
        onChange={(e) => {
          const safeCronExplanation = () => {
            try {
              return cronstrue.toString(e.target.value);
            } catch (e: any) {
              return "";
            }
          };

          setDetailsForm({
            ...detailsForm,
            cron: e.target.value,
            cronExplanation: safeCronExplanation(),
          });
        }}
        description="Return to the first step to change this value"
        error={getError("cron")}
      />
    </Fieldset>
  );
}
