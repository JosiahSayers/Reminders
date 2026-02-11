import { useContext } from "react";
import NavbarLink from "./navbar-link";
import { AppContext } from "../app-context";
import { Divider, NavLink, Stack } from "@mantine/core";

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

        <div>
          <NavLink
            href="#admin-parent-nav-link"
            label="Admin"
            childrenOffset={28}
          >
            <NavbarLink href="/admin/settings" title="Settings" />
            <NavbarLink href="/admin/stats" title="Statistics" />
          </NavLink>
        </div>
      </Stack>
    </>
  );
}
