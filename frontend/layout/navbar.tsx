import { useContext } from "react";
import NavbarLink from "./navbar-link";
import { AppContext } from "../app-context";
import { Divider, Stack } from "@mantine/core";

export default function Navbar() {
  const { activeReminderCount } = useContext(AppContext);

  return (
    <>
      <NavbarLink
        href="/"
        title="Active Reminders"
        count={activeReminderCount}
      />

      <NavbarLink href="/new-reminder" title="New Reminder" />

      <NavbarLink href="/history" title="History" />

      <Divider />

      <Stack justify="space-between" h="100%">
        <NavbarLink href="/new-message" title="One Time Message" />

        <NavbarLink href="/stats" title="Statistics" />
      </Stack>
    </>
  );
}
