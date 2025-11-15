import { AppShell, Box, Burger, Flex, Group, Title } from "@mantine/core";
import Mantine from "./mantine";
import Reminders from "./reminders/reminders";
import { useDisclosure } from "@mantine/hooks";
import { Route, Switch } from "wouter";
import Navbar from "./layout/navbar";
import NewReminderPage from "./new-reminder/new-reminder-page";
import { AppContextWrapper } from "./app-context";

export default function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Mantine>
      <AppContextWrapper>
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
            <Group h="100%" px="md">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />

              <Title>Reminders</Title>
            </Group>
          </AppShell.Header>

          <AppShell.Navbar>
            <Navbar />
          </AppShell.Navbar>

          <AppShell.Main>
            <Box px="xl">
              <Switch>
                <Route path="/" component={Reminders} />

                <Route path="/new-reminder" component={NewReminderPage} />

                {/* Default route in a switch */}
                <Route>404: No such page!</Route>
              </Switch>
            </Box>
          </AppShell.Main>
        </AppShell>
      </AppContextWrapper>
    </Mantine>
  );
}
