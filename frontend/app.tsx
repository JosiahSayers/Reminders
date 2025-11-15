import { AppShell, Burger } from "@mantine/core";
import Mantine from "./mantine";
import Reminders from "./reminders";
import { useDisclosure } from "@mantine/hooks";

export default function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Mantine>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

          <div>Reminders</div>
        </AppShell.Header>

        <AppShell.Navbar>Navbar</AppShell.Navbar>

        <AppShell.Main>
          <Reminders />
        </AppShell.Main>
      </AppShell>
    </Mantine>
  );
}
