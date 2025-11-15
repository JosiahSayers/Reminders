import NavbarLink from "./navbar-link";
import useAxios from "axios-hooks";

export default function Navbar() {
  const [{ data: counts }] = useAxios("/api/reminders/counts");

  return (
    <>
      <NavbarLink
        href="/"
        title="Active Reminders"
        count={counts?.activeReminderCount}
      />

      <NavbarLink href="/new-reminder" title="New Reminder" />
    </>
  );
}
