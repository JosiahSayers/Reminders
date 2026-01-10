import { NewReminderContext } from "../new-reminder-context";
import { useContext } from "react";
import EditReminder from "../../shared/edit-reminder";

export default function ThirdStep() {
  const { detailsForm, setDetailsForm, validationError } =
    useContext(NewReminderContext);

  return (
    <EditReminder
      form={detailsForm}
      onChange={setDetailsForm}
      displayErrors={validationError}
    />
  );
}
