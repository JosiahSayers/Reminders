import useAxios from "axios-hooks";
import { createContext, type PropsWithChildren } from "react";

interface AppContextInterface {
  activeReminderCount: number;
  fetchCounts: () => void;
  aiEnabled: boolean;
}

export const AppContext = createContext<AppContextInterface>({
  activeReminderCount: 0,
  fetchCounts: () => {},
  aiEnabled: false,
});

export function AppContextWrapper({ children }: PropsWithChildren) {
  const [{ data: counts }, refetchCounts] = useAxios("/api/reminders/counts");
  const [{ data: healthData }] = useAxios("/readyz");
  const activeReminderCount = counts?.activeReminderCount;
  console.log(JSON.stringify(healthData));

  return (
    <AppContext
      value={{
        activeReminderCount,
        fetchCounts: refetchCounts,
        aiEnabled: healthData?.aiEnabled ?? false,
      }}
    >
      {children}
    </AppContext>
  );
}
