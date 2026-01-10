import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import type { PropsWithChildren } from "react";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function Mantine({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
