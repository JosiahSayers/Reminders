import { Card, Loader, Stack, Text } from "@mantine/core";
import useAxios from "axios-hooks";
import type { Reminder } from "../prisma/generated/browser";

export default function Reminders() {
  const [{ data: reminders, loading }] = useAxios<Reminder[]>("/api/reminders");

  if (loading) return <Loader />;
  if (!reminders) return null;

  return (
    <Stack w="25%">
      {reminders.map((reminder) => (
        <Card radius="md" withBorder>
          <Text fw={500}>{reminder.title}</Text>
          <Text size="sm" c="dimmed">
            {reminder.content}
          </Text>
        </Card>
      ))}
    </Stack>
  );
}
