import useAxios from "axios-hooks";
import type { Setting } from "../../prisma/generated/browser";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { Switch } from "@mantine/core";

interface Props {
  setting: Setting;
  onSettingChange: () => void;
}

export default function SettingSwitch({ setting, onSettingChange }: Props) {
  const [{ response, error, loading: updateLoading }, updateSetting] = useAxios(
    {
      url: "/api/admin/settings",
      method: "put",
    },
    { manual: true },
  );
  const [dirtyValue, setDirtyValue] = useState<boolean | null>(null);

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
      setDirtyValue(null);
      onSettingChange();
    }
  }, [error, updateLoading]);

  const handleSettingChange = (newValue: boolean) => {
    setDirtyValue(newValue);
    updateSetting({ data: { name: setting.name, enabled: newValue } });
  };

  return (
    <Switch
      key={setting.name}
      checked={dirtyValue === null ? setting.enabled : dirtyValue}
      label={setting.name}
      onChange={(e) => handleSettingChange(e.currentTarget.checked)}
      disabled={updateLoading}
      description={setting.description}
    />
  );
}
