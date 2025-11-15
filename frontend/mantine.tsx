import { createTheme, MantineProvider } from "@mantine/core";
import type { PropsWithChildren } from "react";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function Mantine({ children }: PropsWithChildren) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
