import { Text, Stack, Card, Group, Menu, ActionIcon } from "@mantine/core";
import { IconDots, IconFileZip, IconEye, IconTrash } from "@tabler/icons-react";
import type { Reminder } from "../../prisma/generated/browser";
import useAxios from "axios-hooks";

interface Props {
  reminder: Reminder;
  onDelete: () => void;
}

export default function Reminder({ reminder, onDelete }: Props) {
  const [{ response, loading, error }, sendDeleteRequest] = useAxios(
    { url: `/api/reminders/${reminder.id}`, method: "DELETE" },
    { manual: true }
  );

  if (response && !error && !loading) {
    setTimeout(() => onDelete(), 0);
    return null;
  }

  return (
    <Card radius="md" padding="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Stack>
            <Text fw={500}>{reminder.title}</Text>
            <Text size="xs" c="dimmed">
              {reminder.cronExplanation}
            </Text>
          </Stack>
          <Menu position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown onChange={(e) => console.log(e)}>
              <Menu.Item leftSection={<IconFileZip size={14} />}>
                Download zip
              </Menu.Item>
              <Menu.Item leftSection={<IconEye size={14} />}>
                Preview all
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={() => sendDeleteRequest()}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Text size="sm" mt="sm">
        {reminder.content}
      </Text>
    </Card>
  );
}
