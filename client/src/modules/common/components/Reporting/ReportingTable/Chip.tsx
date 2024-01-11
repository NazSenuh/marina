//@ts-nocheck
import React from "react";
import Box from "@mui/material/Box";

const Chip = (props) => {
  const { text, borderColor } = props;
  const blockStyle = {
    border: `1px solid ${borderColor}`,
    borderRadius: `2px`,
    padding: "8px",
    ...props,
  };

  return <Box style={blockStyle}>{text}</Box>;
};

export default Chip;
