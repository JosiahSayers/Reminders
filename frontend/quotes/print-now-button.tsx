import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconReceipt, IconX } from "@tabler/icons-react";
import useAxios from "axios-hooks";
import { useEffect } from "react";

interface Props {
  quoteId: number;
}

export default function PrintQuoteButton({ quoteId }: Props) {
  const [{ loading, error, response }, execute] = useAxios(
    { url: `/api/quotes/${quoteId}/print`, method: "POST" },
    { manual: true },
  );

  const handleClick = async () => {
    try {
      await execute();
    } catch (e) {
      console.error(e);
    }
  };

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
        title: "Quote Sent!",
        message: "It should be on the printer soon.",
        color: "green",
        icon: <IconReceipt />,
      });
    }
  }, [loading, error, response]);

  return (
    <Button onClick={handleClick} loading={loading} variant="outline">
      Print Now
    </Button>
  );
}
