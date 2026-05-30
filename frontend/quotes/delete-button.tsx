import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconX } from "@tabler/icons-react";
import useAxios from "axios-hooks";
import { useEffect } from "react";

interface Props {
  quoteId: number;
  onSuccess: () => void;
}

export default function DeleteQuoteButton({ quoteId, onSuccess }: Props) {
  const [{ loading, error, response }, execute] = useAxios(
    { url: `/api/quotes/${quoteId}`, method: "DELETE" },
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
          "This quote will no longer be available when printing a random quote",
        color: "green",
        icon: <IconTrash />,
      });
      onSuccess();
    }
  }, [loading, error, response]);

  return (
    <Button
      onClick={() => execute()}
      loading={loading}
      variant="outline"
      color="red"
    >
      Delete
    </Button>
  );
}
