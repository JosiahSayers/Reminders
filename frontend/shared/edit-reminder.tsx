import { Fieldset, Textarea, TextInput } from "@mantine/core";
import { detailsFormSchema } from "../new-reminder/new-reminder-context";
import cronstrue from "cronstrue";
import HowToCron from "../new-reminder/how-to-cron";

interface Form {
  title: string;
  content: string;
  cronExplanation: string;
  cron: string;
}

interface Props {
  form: Form;
  onChange: (form: Form) => void;
  displayErrors?: boolean;
}

export default function EditReminder({ form, onChange, displayErrors }: Props) {
  const { error: zodError } = detailsFormSchema.safeParse(form);
  const getError = (property: string) =>
    zodError?.issues.find((issue) => issue.path[0] === property)?.message;

  return (
    <Fieldset legend="Details">
      <TextInput
        label="Title"
        placeholder="Bathe Mooey"
        mb="md"
        value={form.title}
        onChange={(e) =>
          onChange({
            ...form,
            title: e.target.value,
          })
        }
        error={displayErrors && getError("title")}
      />
      <Textarea
        label="Content"
        placeholder="By now the dog is probably stinky. You should fix that."
        mb="md"
        value={form.content}
        onChange={(e) =>
          onChange({
            ...form,
            content: e.target.value,
          })
        }
        error={displayErrors && getError("content")}
      />
      <TextInput
        label="Schedule Description"
        value={form.cronExplanation}
        disabled
        mb="md"
        description="Return to the first step to change this value"
        error={getError("cron")}
      />
      <TextInput
        label="Cron"
        value={form.cron}
        onChange={(e) => {
          const safeCronExplanation = () => {
            try {
              return cronstrue.toString(e.target.value);
            } catch (e: any) {
              return "";
            }
          };

          onChange({
            ...form,
            cron: e.target.value,
            cronExplanation: safeCronExplanation(),
          });
        }}
        description="Return to the first step to change this value"
        error={getError("cron")}
        mb="xl"
      />

      <HowToCron />
    </Fieldset>
  );
}
