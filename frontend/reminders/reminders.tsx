import { Center, Loader, Stack } from "@mantine/core";
import useAxios from "axios-hooks";
import type { Reminder } from "../../prisma/generated/browser";
import ReminderComponent from "./reminder";

export default function Reminders() {
  const [{ data: reminders, loading }, refetch] =
    useAxios<Reminder[]>("/api/reminders");

  if (loading) return <Loader />;
  if (!reminders) return null;

  return (
    <Center>
      <Stack w="45%">
        {reminders.map((reminder) => (
          <ReminderComponent
            reminder={reminder}
            onDelete={refetch}
            key={reminder.id}
          />
        ))}
      </Stack>
    </Center>
  );
}
