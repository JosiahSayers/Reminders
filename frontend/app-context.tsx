import useAxios from "axios-hooks";
import { createContext, type PropsWithChildren } from "react";

interface AppContextInterface {
  activeReminderCount: number;
  fetchCounts: () => void;
}

export const AppContext = createContext<AppContextInterface>({
  activeReminderCount: 0,
  fetchCounts: () => {},
});

export function AppContextWrapper({ children }: PropsWithChildren) {
  const [{ data: counts }, refetchCounts] = useAxios("/api/reminders/counts");
  const activeReminderCount = counts?.activeReminderCount;

  return (
    <AppContext
      value={{
        activeReminderCount,
        fetchCounts: refetchCounts,
      }}
    >
      {children}
    </AppContext>
  );
}
