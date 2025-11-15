import { useContext } from "react";
import NavbarLink from "./navbar-link";
import { AppContext } from "../app-context";

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
    </>
  );
}
