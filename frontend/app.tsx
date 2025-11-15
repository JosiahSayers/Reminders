import { AppShell, Burger } from "@mantine/core";
import Mantine from "./mantine";
import Reminders from "./reminders/reminders";
import { useDisclosure } from "@mantine/hooks";
import { Route, Switch } from "wouter";
import Navbar from "./layout/navbar";

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

        <AppShell.Navbar>
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>
          <Switch>
            <Route path="/" component={Reminders} />

            <Route path="/users/:name">
              {(params) => <>Hello, {params.name}!</>}
            </Route>

            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
          </Switch>
        </AppShell.Main>
      </AppShell>
    </Mantine>
  );
}
