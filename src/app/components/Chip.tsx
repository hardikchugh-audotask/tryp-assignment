import { Box } from "@chakra-ui/react";
import React from "react";

type ChipProps = {
  title: string | number | boolean | JSX.Element | null;
  bgColor: string;
};

export default function Chip({ title, bgColor }: ChipProps) {
  return (
    <Box
      backgroundColor={`${bgColor}.200`}
      py={"1"}
      px={"3"}
      textAlign={"center"}
      borderRadius={"3xl"}
    >
      {title}
    </Box>
  );
}
