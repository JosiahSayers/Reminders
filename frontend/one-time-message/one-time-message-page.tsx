import {
  Alert,
  Box,
  Button,
  Fieldset,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import z from "zod";
import type { Message } from "../../prisma/generated/browser";
import useAxios from "axios-hooks";
import { IconInfoCircle } from "@tabler/icons-react";

const formSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(3, { error: "Message is required" }),
});

export default function OneTimeMessagePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [{ data, loading, error }, resubmit] = useAxios<Message>(
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

  const { error: formError, success: formIsValid } = formSchema.safeParse({
    title,
    content,
  });
  const getError = (property: string) =>
    formError?.issues.find((issue) => issue.path[0] === property)?.message;

  const safeResubmit = async () => {
    try {
      await resubmit();
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
              console.log("Send it!");
            }
          }}
          loading={loading}
        >
          Send
        </Button>

        {error ? (
          <Alert
            variant="light"
            color="red"
            title="Something went wrong"
            icon={<IconInfoCircle />}
            mt="xl"
          >
            <Stack>
              There was a problem on our end.{" "}
              <Button
                onClick={() => safeResubmit()}
                variant="outline"
                w="fit-content"
              >
                Try again
              </Button>
            </Stack>
          </Alert>
        ) : null}
      </Fieldset>
    </Box>
  );
}
