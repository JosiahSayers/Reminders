import { Stack, Title } from "@mantine/core";
import useAxios from "axios-hooks";
import type { Configuration, Setting } from "../../prisma/generated/browser";
import { useContext } from "react";
import { AppContext } from "../app-context";
import ChangeLogo from "./change-logo";
import SettingSwitch from "./setting-switch";
import ConfigurationInput from "./configuration-input";

export default function AdminSettingsPage() {
  const appContext = useContext(AppContext);
  const [{ data: currentSettings, loading: settingsLoading }, reload] =
    useAxios<{
      settings: Array<Setting>;
      configurations: Array<Configuration>;
    }>("/api/admin/settings", { useCache: false });

  const handleSettingChange = () => {
    reload();
    appContext.fetchSettings();
  };

  const handleConfigurationChange = () => {
    reload();
  };

  return (
    <Stack gap="xl">
      <Title order={1}>Settings</Title>
      {!settingsLoading && currentSettings ? (
        <>
          <Stack mb="xl">
            {currentSettings.settings.map((setting) => (
              <SettingSwitch
                setting={setting}
                onSettingChange={handleSettingChange}
                key={setting.id}
              />
            ))}
          </Stack>

          <Stack w="50%" mb="xl">
            {currentSettings.configurations.map((configuration) => (
              <ConfigurationInput
                configuration={configuration}
                onConfigurationChange={handleConfigurationChange}
                key={configuration.id}
              />
            ))}
          </Stack>
        </>
      ) : null}

      <ChangeLogo />
    </Stack>
  );
}
