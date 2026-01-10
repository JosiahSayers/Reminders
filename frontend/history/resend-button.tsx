import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconReceipt, IconX } from "@tabler/icons-react";
import useAxios from "axios-hooks";
import { useEffect } from "react";

interface Props {
  reminderId: number;
  onSuccess?: () => void;
}

export default function ResendReminderButton({ reminderId, onSuccess }: Props) {
  const [{ loading, error, response }, execute] = useAxios(
    { url: `/api/reminders/${reminderId}/resend`, method: "POST" },
    { manual: true }
  );

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
        title: "Reminder sent!",
        message: "It should be on the printer soon.",
        color: "green",
        icon: <IconReceipt />,
      });
      setTimeout(() => onSuccess?.(), 250);
    }
  }, [loading, error, response]);

  return (
    <Button onClick={() => execute()} loading={loading}>
      Resend
    </Button>
  );
}
