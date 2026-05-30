import {
  Button,
  Fieldset,
  Group,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import z from "zod";

const formSchema = z.object({
  quote: z.string().trim().min(1, { message: "Quote is required" }),
  author: z.string().trim().min(1, { message: "Author is required" }),
});

interface Props {
  onSuccess: () => void;
}

export default function CreateQuoteModal({ onSuccess }: Props) {
  const [form, setForm] = useState({
    quote: "",
    author: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [{ loading, response, error }, createQuote] = useAxios(
    { url: "/api/quotes", method: "POST" },
    { manual: true, useCache: false },
  );
  const { error: zodError } = formSchema.safeParse(form);
  const getError = (property: string) =>
    zodError?.issues.find((issue) => issue.path[0] === property)?.message;

  const sendQuote = async () => {
    setSubmitted(true);
    createQuote({
      data: {
        quote: form.quote,
        author: form.author,
      },
    });
  };

  useEffect(() => {
    if (loading) return;

    if (error) {
      notifications.show({
        title: "Something went wrong",
        message: "There was a problem on our end. You can try again.",
        color: "red",
        icon: <IconX />,
      });
    } else if (response) {
      notifications.show({
        message: "Quote Created!",
        color: "green",
        icon: <IconCheck />,
      });
      onSuccess();
    }
  }, [loading, response, error]);

  return (
    <Stack>
      <Fieldset legend="Details">
        <Textarea
          label="Quote"
          mb="md"
          value={form.quote}
          onChange={(e) =>
            setForm({
              ...form,
              quote: e.target.value,
            })
          }
          error={submitted && getError("quote")}
        />

        <TextInput
          label="Author"
          mb="md"
          value={form.author}
          onChange={(e) =>
            setForm({
              ...form,
              author: e.target.value,
            })
          }
          error={submitted && getError("author")}
        />
      </Fieldset>

      <Group justify="fex-end" mt="lg">
        <Button loading={loading} onClick={sendQuote}>
          Create
        </Button>
      </Group>
    </Stack>
  );
}
