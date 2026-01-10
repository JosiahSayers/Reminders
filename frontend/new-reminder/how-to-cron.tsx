import {
  Box,
  Group,
  Button,
  Collapse,
  Text,
  Card,
  Code,
  Center,
  Stack,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const cronSegments = ["Second", "Minute", "Hour", "Day", "Month", "Weekday"];
const cronValues = [
  { character: "*", details: "any value" },
  { character: ",", details: "value list separator" },
  { character: "-", details: "range of values" },
  { character: "/", details: "step values" },
];

export default function HowToCron() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box>
      <Group mb={5}>
        <Button onClick={toggle} variant="light">
          {opened ? "Hide" : "Show"} Cron Explanation
        </Button>
      </Group>

      <Collapse in={opened}>
        <Card withBorder w="fit-content">
          <Text fw="bold" my="sm">
            Segments (Second is optional)
          </Text>
          <Group mb="lg" wrap="nowrap" gap="0">
            {cronSegments.map((segment) => (
              <Code
                key={segment}
                fz={{
                  sm: "xs",
                  md: "sm",
                }}
                mx={{
                  sm: "1",
                  md: "xs",
                }}
              >
                {segment}
              </Code>
            ))}
          </Group>

          <Text fw="bold" my="sm">
            Possible Segment Values
          </Text>
          <Stack mx="auto">
            {cronValues.map((value, index) => {
              const isLastItem = index >= cronValues.length - 1;
              return (
                <>
                  <Group
                    key={value.character}
                    justify="space-between"
                    w="fit-content"
                  >
                    <Code>{value.character}</Code>
                    <Code>{value.details}</Code>
                  </Group>

                  {!isLastItem ? <Divider /> : null}
                </>
              );
            })}
          </Stack>
        </Card>
      </Collapse>
    </Box>
  );
}
