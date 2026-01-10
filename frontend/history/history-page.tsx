import { Center, Loader, Stack, Switch, Table, Text } from "@mantine/core";
import useAxios from "axios-hooks";
import type { Reminder, ReminderHistory } from "../../prisma/generated/browser";
import ResendReminderButton from "./resend-button";
import { useState } from "react";

export default function HistoryPage() {
  const [onlyFailure, setOnlyFailure] = useState<boolean>();
  const [{ data, loading }, refetch] = useAxios<
    Array<ReminderHistory & { reminder: Reminder }>
  >(
    {
      url: "/api/reminder-history",
      params: { success: onlyFailure ? "false" : undefined },
    },
    { useCache: false }
  );

  if (loading) {
    return <Loader size="xl" />;
  }

  return (
    <Stack>
      <Switch
        checked={onlyFailure}
        onChange={(event) => setOnlyFailure(event.currentTarget.checked)}
        label="Only failures"
      />
      <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
        <Table.Thead>
          <Table.Th>Title</Table.Th>
          <Table.Th>Sent</Table.Th>
          <Table.Th>Content</Table.Th>
          <Table.Th>Successful</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Thead>

        <Table.Tbody>
          {data!.map((item) => (
            <Table.Tr>
              <Table.Td width="fit-content">{item.reminder.title}</Table.Td>
              <Table.Td>
                {new Date(item.createdAt).toLocaleDateString()}{" "}
                {new Date(item.createdAt).toLocaleTimeString()}
              </Table.Td>

              <Table.Td style={{ maxWidth: 50 }}>
                <Text truncate="end">{item.reminder.content}</Text>
              </Table.Td>
              <Table.Td>{item.successful.toString()}</Table.Td>
              <Table.Td>
                <ResendReminderButton
                  reminderId={item.reminderId}
                  onSuccess={refetch}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
