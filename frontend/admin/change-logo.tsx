import { Button, Image, FileInput, Group, Stack, Card, Center } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconReceipt, IconX } from "@tabler/icons-react";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

export default function ChangeLogo() {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoCacheControl, setLogoCacheControl] = useState(new Date().getTime());
  const [{ data, loading, error }, submit] = useAxios(
    {
      url: "/api/admin/logo",
      method: "post",
      data: {
        logo,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    { manual: true },
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      notifications.show({
        autoClose: 5000,
        title: "Something went wrong",
        message:
          "There was a problem on our end. You can try and send the message again.",
        color: "red",
        icon: <IconX />,
      });
    } else if (data) {
      setLogo(null);
      let message = "Reminders will now print with the new logo";
      if (data.previousLogoFilename) {
        message += `. Your previous logo has been copied to [your uploads folder]/previous-logos/${data.previousLogoFilename}.`;
      }

      setLogoCacheControl(new Date().getTime());

      notifications.show({
        autoClose: 5000,
        title: "Logo updated!",
        message,
        color: "green",
        icon: <IconReceipt />,
      });
    }
  }, [data, error, loading]);

  return (
    <Card
      shadow="sm" padding="lg" radius="md"
      withBorder
      w="50%"
    >
      <form method="post" action="/api/admin/logo">
        <Group align="end">
          <FileInput
            label="Change Logo"
            description='Choose an image to upload and set as your logo. This will be printed on reminders when the "Print Logo" setting is enabled.'
            accept="image/png,image/jpeg"
            clearable
            name="logo"
            id="logo"
            onChange={setLogo}
            value={logo}
          // w="50%"
          />
          <Button
            onClick={async () => {
              if (logo) {
                try {
                  submit();
                } catch {
                  // errors are handled in a useEffect
                }
              }
            }}
            disabled={!logo || loading}
            loading={loading}
          >
            Change Logo
          </Button>
        </Group>
      </form>
      <Card.Section withBorder mt="md">
        <Center>
          <Image
            src={`/api/admin/logo?cache=${logoCacheControl}`}
            alt="Current Reminder Logo"
            h={350}
            w="auto"
            fit="contain"
          />
        </Center>
      </Card.Section>
    </Card>
  );
}
