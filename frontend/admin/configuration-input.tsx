import { Box, Button, Group, Input, TextInput } from "@mantine/core";
import type { Configuration } from "../../prisma/generated/browser";
import { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

interface Props {
  configuration: Configuration;
  onConfigurationChange: () => void;
}

export default function ConfigurationInput({
  configuration,
  onConfigurationChange,
}: Props) {
  const [value, setValue] = useState(configuration.value);
  const [{ response, error, loading: updateLoading }, updateConfiguration] =
    useAxios(
      {
        url: "/api/admin/configurations",
        method: "put",
      },
      { manual: true },
    );

  const handleSave = () => {
    updateConfiguration({ data: { name: configuration.name, value } });
  };

  useEffect(() => {
    if (updateLoading) return;

    if (error) {
      notifications.show({
        title: "Something went wrong",
        message: "There was a problem on our end. You can try again.",
        color: "red",
        icon: <IconX />,
      });
    } else if (response) {
      onConfigurationChange();
    }
  });

  return (
    <Group align="flex-end" justify="space-between">
      <TextInput
        label={configuration.name}
        description={configuration.description}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        w="75%"
        disabled={updateLoading}
      />

      <Button onClick={handleSave} disabled={updateLoading}>
        Save
      </Button>
    </Group>
  );
}
