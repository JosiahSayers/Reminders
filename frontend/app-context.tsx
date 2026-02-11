import useAxios from "axios-hooks";
import { createContext, type PropsWithChildren } from "react";

interface AppContextInterface {
  activeReminderCount: number;
  fetchCounts: () => void;
  fetchSettings: () => void;
  aiEnabled: boolean;
}

export const AppContext = createContext<AppContextInterface>({
  activeReminderCount: 0,
  fetchCounts: () => {},
  fetchSettings: () => {},
  aiEnabled: false,
});

export function AppContextWrapper({ children }: PropsWithChildren) {
  const [{ data: counts }, refetchCounts] = useAxios("/api/reminders/counts");
  const [{ data: healthData }, refetchHealthData] = useAxios("/readyz");
  const activeReminderCount = counts?.activeReminderCount;

  return (
    <AppContext
      value={{
        activeReminderCount,
        fetchCounts: refetchCounts,
        fetchSettings: refetchHealthData,
        aiEnabled: healthData?.aiEnabled ?? false,
      }}
    >
      {children}
    </AppContext>
  );
}
