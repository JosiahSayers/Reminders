import { NewReminderContextWrapper } from "./new-reminder-context";
import Steps from "./steps";

export default function NewReminderPage() {
  return (
    <NewReminderContextWrapper stepCount={3}>
      <Steps />
    </NewReminderContextWrapper>
  );
}
