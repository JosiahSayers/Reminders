import {
  Box,
  Button,
  Fieldset,
  FileInput,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import z from "zod";
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
  const [image, setImage] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [{ data, loading, error }, submit] = useAxios(
    {
      url: "/api/messages",
      method: "post",
      data: {
        title,
        content,
        image,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    { manual: true }
  );

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setFormSubmitted(false);
  };

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
      resetForm();
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
        <Stack>
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={formSubmitted && getError("content")}
          />

          <FileInput
            label="Image"
            description="An image to be printed with your message. This is optional."
            value={image}
            onChange={setImage}
            accept="image/png,image/jpeg"
            clearable
          />

          <Button
            onClick={() => {
              setFormSubmitted(true);
              if (formIsValid) {
                safeSubmit();
              }
            }}
            loading={loading}
            mt="md"
            w="fit-content"
          >
            Send
          </Button>
        </Stack>
      </Fieldset>
    </Box>
  );
}
