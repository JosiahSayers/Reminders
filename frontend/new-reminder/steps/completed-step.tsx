import useAxios from "axios-hooks";
import type { Reminder } from "../../../prisma/generated/browser";
import { useContext } from "react";
import { NewReminderContext } from "../new-reminder-context";
import { Alert, Button, Center, Loader, Stack } from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";

export default function CompletedStep() {
  const { cron, detailsForm } = useContext(NewReminderContext);
  const [{ data, loading, error }, resubmit] = useAxios<Reminder>({
    url: "/api/reminders",
    method: "post",
    data: {
      title: detailsForm.title,
      content: detailsForm.content,
      cron: cron?.cron,
    },
  });

  const safeResubmit = async () => {
    try {
      await resubmit();
    } catch {
      // do nothing, error state is already defined in the UI
    }
  };

  if (loading) {
    return (
      <Center>
        <Loader type="bars" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        variant="light"
        color="red"
        title="Something went wrong"
        icon={<IconInfoCircle />}
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
    );
  }

  if (data) {
    return (
      <Alert
        icon={<IconCheck />}
        variant="outline"
        color="green"
        title="Reminder created"
      />
    );
  }

  return null;
}
