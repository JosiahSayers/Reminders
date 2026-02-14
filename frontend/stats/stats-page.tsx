import useAxios from "axios-hooks";
import { filesize } from "filesize";
import type { getStorageStatistics } from "../../app/utils/image-processor";
import { List, Stack, Title, Text } from "@mantine/core";
import StatsListItem from "./stats-list-item";

type Stats = {
  storage: Awaited<ReturnType<typeof getStorageStatistics>>;
  activeReminders: number;
  deletedReminders: number;
  remindersSent: number;
  oneTimeMessages: number;
};

export default function StatsPage() {
  const [{ data }] = useAxios<Stats>("/api/admin/stats");
  if (!data) return null;

  return (
    <Stack>
      <Title order={1}>Statistics</Title>
      <List>
        <List.Item>
          <Text fw={700}>Reminders</Text>
          <List withPadding>
            <StatsListItem title="Active" data={data.activeReminders} />

            <StatsListItem title="Deleted" data={data.deletedReminders} />

            <StatsListItem title="Total Printed" data={data.remindersSent} />
          </List>
        </List.Item>

        <List.Item>
          <Text fw={700}>One Time Messages</Text>
          <List withPadding>
            <StatsListItem title="Sent" data={data.oneTimeMessages} />
          </List>
        </List.Item>

        <List.Item>
          <Text fw={700}>Image Uploads</Text>
          <List withPadding>
            <StatsListItem
              title="Original Copy"
              data={filesize(data.storage.originalsSize)}
            />

            <StatsListItem
              title="Compressed Copy"
              data={filesize(data.storage.compressedSize)}
            />

            <StatsListItem
              title="Total Upload Folder"
              data={filesize(data.storage.totalUploadsSize)}
            />
          </List>
        </List.Item>
      </List>
    </Stack>
  );
}
