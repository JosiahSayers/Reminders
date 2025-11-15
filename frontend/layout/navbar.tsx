import { useLocation } from "wouter";
import NavbarLink from "./navbar-link";
import { Center, Stack } from "@mantine/core";

export default function Navbar() {
  const [location] = useLocation();

  const isRouteActive = (route: string) => {
    return location === route;
  };

  return (
    <Stack>
      <NavbarLink href="/" title="Active Reminders" />

      <NavbarLink href="/new-reminder" title="New Reminder" />
    </Stack>
  );
}
