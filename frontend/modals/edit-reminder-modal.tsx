import { useEffect, useState } from "react";
import type { Reminder } from "../../prisma/generated/browser";
import EditReminder from "../shared/edit-reminder";
import { Button, Group, Stack } from "@mantine/core";
import useAxios from "axios-hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconReceipt, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

interface Props {
  reminder: Reminder;
  onSuccess: () => void;
}

export default function EditReminderModal({ reminder, onSuccess }: Props) {
  const [form, setForm] = useState({
    title: reminder.title,
    content: reminder.content,
    cronExplanation: reminder.cronExplanation,
    cron: reminder.cron,
  });
  const [submitted, setSubmitted] = useState(false);

  const [{ loading, response, error }, updateReminder] = useAxios(
    {
      url: `/api/reminders/${reminder.id}`,
      method: "PATCH",
    },
    { manual: true, useCache: false }
  );

  const sendUpdate = async () => {
    setSubmitted(true);
    updateReminder({
      data: {
        title: form.title,
        content: form.content,
        cron: form.cron,
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
        message: "Reminder updated!",
        color: "green",
        icon: <IconCheck />,
      });
      onSuccess();
    }
  }, [loading, response, error]);

  return (
    <>
      <Stack>
        <EditReminder
          form={form}
          onChange={setForm}
          displayErrors={submitted}
        />
        <Group justify="flex-end" mt="lg">
          <Button loading={loading} onClick={sendUpdate}>
            Update
          </Button>
        </Group>
      </Stack>
    </>
  );
}
