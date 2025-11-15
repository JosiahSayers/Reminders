import { createContext, useState, type PropsWithChildren } from "react";

interface FirstStepForm {
  description: string;
}

export interface Cron {
  cron: string;
  explanation: string;
}

interface NewReminderContextInterface {
  step: number;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: number) => void;
  completed: boolean;
  firstStepForm: FirstStepForm;
  setFirstStepForm: (form: FirstStepForm) => void;
  cron: Cron | null;
  setCron: (cron: Cron) => void;
}

export const NewReminderContext = createContext<NewReminderContextInterface>({
  step: 1,
  nextStep: () => {},
  previousStep: () => {},
  setStep: () => {},
  completed: false,
  firstStepForm: {
    description: "",
  },
  setFirstStepForm: () => {},
  cron: null,
  setCron: () => {},
});

interface NewReminderContextWrapperProps extends PropsWithChildren {
  stepCount: number;
}

export function NewReminderContextWrapper({
  children,
  stepCount,
}: NewReminderContextWrapperProps) {
  const [active, setActive] = useState(1);
  const completed = active >= stepCount;
  const nextStep = () =>
    setActive((current) => (current < stepCount ? current + 1 : current));
  const previousStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [firstStepForm, setFirstStepForm] = useState({
    description: "Every first tuesday of the month at 3pm",
  });

  const [cron, setCron] = useState<NewReminderContextInterface["cron"]>(null);

  return (
    <NewReminderContext
      value={{
        step: active,
        completed,
        setStep: setActive,
        nextStep,
        previousStep,
        firstStepForm,
        setFirstStepForm,
        cron,
        setCron,
      }}
    >
      {children}
    </NewReminderContext>
  );
}
