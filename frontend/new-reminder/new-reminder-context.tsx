import { createContext, useState, type PropsWithChildren } from "react";
import z from "zod";
import cronstrue from "cronstrue";

export const scheduleFormSchema = z.object({
  description: z.string().trim().min(1, { message: "Description is required" }),
});

type ScheduleForm = z.infer<typeof scheduleFormSchema>;

export const detailsFormSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  content: z.string().trim().min(1, { message: "Content is required" }),
  cronExplanation: z
    .string()
    .trim()
    .min(1, { message: "Cron Explanation is required" }),
  cron: z
    .string()
    .trim()
    .min(1, { message: "Cron is required" })
    .superRefine((value, context) => {
      try {
        cronstrue.toString(value);
      } catch (e: any) {
        context.addIssue({
          code: "invalid_format",
          message: e,
          format: "* * * * *",
        });
      }
    }),
});

type DetailsForm = z.infer<typeof detailsFormSchema>;

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
  scheduleForm: ScheduleForm;
  setScheduleForm: (form: ScheduleForm) => void;
  cron: Cron | null;
  setCron: (cron: Cron) => void;
  detailsForm: DetailsForm;
  setDetailsForm: (form: DetailsForm) => void;
  validationError: boolean;
}

export const NewReminderContext = createContext<NewReminderContextInterface>({
  step: 0,
  nextStep: () => {},
  previousStep: () => {},
  setStep: () => {},
  completed: false,
  scheduleForm: {
    description: "",
  },
  setScheduleForm: () => {},
  cron: null,
  setCron: () => {},
  detailsForm: {
    title: "",
    content: "",
    cronExplanation: "",
    cron: "",
  },
  setDetailsForm: () => {},
  validationError: false,
});

interface NewReminderContextWrapperProps extends PropsWithChildren {
  stepCount: number;
}

export function NewReminderContextWrapper({
  children,
  stepCount,
}: NewReminderContextWrapperProps) {
  const [active, setActive] = useState(0);
  const [validationError, setValidationError] = useState(false);
  const completed = active >= stepCount;
  const previousStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const setStep = (newStep: number) => {
    if (completed) return;
    setActive(newStep);
  };

  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    description: "",
  });

  const [detailsForm, setDetailsForm] = useState<DetailsForm>({
    title: "",
    content: "",
    cronExplanation: "",
    cron: "",
  });

  const [cron, setCron] = useState<NewReminderContextInterface["cron"]>(null);

  const validateStep = (step: number) => {
    try {
      if (step === 0) {
        scheduleFormSchema.parse(scheduleForm);
      } else if (step === 2) {
        detailsFormSchema.parse(detailsForm);
      }

      return true;
    } catch {
      return false;
    }
  };

  const nextStep = () => {
    const stepIsValid = validateStep(active);
    if (stepIsValid) {
      setValidationError(false);
      setActive((current) => (current < stepCount ? current + 1 : current));
    } else {
      setValidationError(true);
    }
  };

  return (
    <NewReminderContext
      value={{
        step: active,
        completed,
        setStep,
        nextStep,
        previousStep,
        scheduleForm,
        setScheduleForm,
        cron,
        setCron,
        detailsForm,
        setDetailsForm,
        validationError,
      }}
    >
      {children}
    </NewReminderContext>
  );
}
