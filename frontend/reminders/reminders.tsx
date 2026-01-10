import { Center, Flex, Loader, Stack } from "@mantine/core";
import useAxios from "axios-hooks";
import type { Reminder } from "../../prisma/generated/browser";
import ReminderComponent from "./reminder";
import { useContext } from "react";
import { AppContext } from "../app-context";

export default function Reminders() {
  const [{ data: reminders, loading }, refetch] = useAxios<Reminder[]>(
    "/api/reminders",
    { useCache: false }
  );
  const { fetchCounts } = useContext(AppContext);

  if (loading) return <Loader />;
  if (!reminders) return null;

  return (
    <Center>
      <Flex gap="xl" wrap="wrap" justify="center">
        {reminders.map((reminder) => (
          <ReminderComponent
            reminder={reminder}
            refetchList={() => {
              refetch();
              fetchCounts();
            }}
            key={reminder.id}
          />
        ))}
      </Flex>
    </Center>
  );
}
