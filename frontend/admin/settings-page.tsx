import { List, ListItem, Stack, Switch, Title } from "@mantine/core";
import useAxios from "axios-hooks";
import type { Setting } from "../../prisma/generated/browser";
import { useContext, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { AppContext } from "../app-context";

export default function AdminSettingsPage() {
  const appContext = useContext(AppContext);
  const [{ data: currentSettings, loading: settingsLoading }, reload] =
    useAxios<{
      settings: Array<Setting>;
    }>("/api/admin/settings", { useCache: false });
  const [{ error, loading: updateLoading }, updateSetting] = useAxios(
    {
      url: "/api/admin/settings",
      method: "put",
    },
    { manual: true },
  );
  const [dirty, setDirty] = useState<{ name: string; enabled: boolean } | null>(
    null,
  );

  useEffect(() => {
    if (updateLoading) return;

    if (error) {
      notifications.show({
        title: "Something went wrong",
        message: "There was a problem on our end. You can try again.",
        color: "red",
        icon: <IconX />,
      });
    } else if (currentSettings) {
      setDirty(null);
      reload();
      appContext.fetchSettings();
    }
  }, [error, updateLoading]);

  const handleSettingChange = (setting: Setting, newValue: boolean) => {
    setDirty({ ...setting, enabled: newValue });
    updateSetting({ data: { name: setting.name, enabled: newValue } });
  };

  return (
    <Stack>
      <Title order={1}>Settings</Title>
      {!settingsLoading && currentSettings ? (
        <Stack>
          {currentSettings.settings.map((setting) => (
            <Switch
              key={setting.name}
              checked={
                dirty?.name === setting.name ? dirty.enabled : setting.enabled
              }
              label={setting.name}
              onChange={(e) =>
                handleSettingChange(setting, e.currentTarget.checked)
              }
              disabled={settingsLoading || updateLoading}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
