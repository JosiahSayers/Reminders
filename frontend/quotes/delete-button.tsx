import { Button, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconX } from "@tabler/icons-react";
import useAxios from "axios-hooks";
import { useEffect } from "react";
import type { Quote } from "../../prisma/generated/browser";

interface Props {
  quote: Quote;
  onSuccess: () => void;
}

export default function DeleteQuoteButton({ quote, onSuccess }: Props) {
  const [{ loading, error, response }, execute] = useAxios(
    { url: `/api/quotes/${quote.id}`, method: "DELETE" },
    { manual: true },
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
        title: "Quote Deleted!",
        message:
          "This quote will no longer be available when printing a random quote.",
        color: "green",
        icon: <IconTrash />,
      });
      onSuccess();
    }
  }, [loading, error, response]);

  const openModal = () =>
    modals.openConfirmModal({
      title: "Are you sure that you want to delete this quote?",
      children: (
        <Stack>
          <Text size="sm">{quote.quote}</Text>
          <Text size="sm">- {quote.author}</Text>
        </Stack>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => execute(),
    });

  return (
    <Button onClick={openModal} loading={loading} variant="outline" color="red">
      Delete
    </Button>
  );
}
