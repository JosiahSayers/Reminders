import { Text, Stack, Card, Group, Menu, ActionIcon } from "@mantine/core";
import { IconDots, IconFileZip, IconEye, IconTrash } from "@tabler/icons-react";
import type { Reminder } from "../../prisma/generated/browser";
import useAxios from "axios-hooks";
import { modals } from "@mantine/modals";
import EditReminderModal from "../modals/edit-reminder-modal";

interface Props {
  reminder: Reminder;
  refetchList: () => void;
}

export default function Reminder({ reminder, refetchList }: Props) {
  const [{ response, loading, error }, sendDeleteRequest] = useAxios(
    { url: `/api/reminders/${reminder.id}`, method: "DELETE" },
    { manual: true }
  );

  if (response && !error && !loading) {
    setTimeout(() => refetchList(), 0);
    return null;
  }

  const openEditModal = () => {
    const modalId = modals.open({
      title: "Edit Reminder",
    });

    modals.updateModal({
      modalId,
      children: (
        <EditReminderModal
          reminder={reminder}
          onSuccess={() => {
            modals.close(modalId);
            refetchList();
          }}
        />
      ),
    });
  };

  return (
    <Card
      radius="md"
      padding="md"
      w={{
        base: "100%",
        md: "500px",
      }}
      withBorder
    >
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
              <Menu.Item onClick={openEditModal}>Edit</Menu.Item>
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

      <Text size="sm" mt="sm" style={{ whiteSpace: "pre-wrap" }}>
        {reminder.content}
      </Text>
    </Card>
  );
}
