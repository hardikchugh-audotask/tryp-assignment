"use client";

import { ChakraProvider } from "@chakra-ui/react";

export default function ThemeProvider({ children }: any) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
