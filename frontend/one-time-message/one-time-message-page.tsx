import { Box, Button, Fieldset, Textarea, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import z from "zod";
import type { Message } from "../../prisma/generated/browser";
import useAxios from "axios-hooks";
import { IconReceipt, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const formSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(3, { error: "Message is required" }),
});

export default function OneTimeMessagePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [{ data, loading, error }, submit] = useAxios<Message>(
    {
      url: "/api/messages",
      method: "post",
      data: {
        title,
        content,
      },
    },
    { manual: true }
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      notifications.show({
        autoClose: 5000,
        title: "Something went wrong",
        message:
          "There was a problem on our end. You can try and send the message again.",
        color: "red",
        icon: <IconX />,
      });
    } else if (data) {
      notifications.show({
        autoClose: 5000,
        title: "Message sent!",
        message: "It should be on the printer now.",
        color: "green",
        icon: <IconReceipt />,
      });
    }
  }, [data, error, loading]);

  const { error: formError, success: formIsValid } = formSchema.safeParse({
    title,
    content,
  });
  const getError = (property: string) =>
    formError?.issues.find((issue) => issue.path[0] === property)?.message;

  const safeSubmit = async () => {
    try {
      await submit();
    } catch {
      // do nothing, error state is already defined in the UI
    }
  };

  return (
    <Box px={{ base: "xs", md: "xl" }}>
      <Fieldset legend="Send a one time message">
        <TextInput
          label="Title"
          description="A title is optional and can be left blank"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <Textarea
          label="Message"
          mb="md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={formSubmitted && getError("content")}
        />

        <Button
          onClick={(e) => {
            setFormSubmitted(true);
            if (formIsValid) {
              safeSubmit();
            }
          }}
          loading={loading}
        >
          Send
        </Button>
      </Fieldset>
    </Box>
  );
}
