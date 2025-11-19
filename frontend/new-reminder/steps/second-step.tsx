import useAxios from "axios-hooks";
import { type Cron, NewReminderContext } from "../new-reminder-context";
import { useContext } from "react";
import {
  Alert,
  Blockquote,
  Button,
  Center,
  Code,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function SecondStep() {
  const { scheduleForm, setCron, detailsForm, setDetailsForm } =
    useContext(NewReminderContext);
  const [{ data, loading, error }, refetch] = useAxios<Cron>(
    {
      url: "/api/cron",
      params: { description: scheduleForm.description },
    },
    { useCache: false }
  );

  const safeRefetch = async () => {
    try {
      await refetch();
    } catch {
      // do nothing, error state is already defined in the UI
    }
  };

  if (loading) {
    return (
      <Center>
        <Loader type="bars" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        variant="light"
        color="red"
        title="Something went wrong"
        icon={<IconInfoCircle />}
      >
        <Stack>
          There was a problem on our end.{" "}
          <Button
            onClick={() => safeRefetch()}
            variant="outline"
            w="fit-content"
          >
            Try again
          </Button>
        </Stack>
      </Alert>
    );
  }

  if (data) {
    setTimeout(() => setCron(data), 0);
    setTimeout(
      () =>
        setDetailsForm({
          ...detailsForm,
          cron: data.cron,
          cronExplanation: data.explanation,
        }),
      0
    );

    return (
      <>
        <Text fz="h3" fw="bold">
          Here's what I think you meant
        </Text>
        <Blockquote py="sm" ml="lg" my="lg" w="fit-content">
          {data.explanation}
        </Blockquote>
        <Text mb="md">
          If this doesn't seem right you can either go back and update your
          prompt or continue on and manually change details in the next step.
        </Text>
        <Text fz="sm">
          Here is the cron string that was generated: <Code>{data.cron}</Code>
        </Text>
      </>
    );
  }

  return null;
}
