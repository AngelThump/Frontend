import React from "react";
import biblethump from "../assets/biblethump_small.png";
import { Typography, Button, Box } from "@mui/material";

export default function ChannelPageError(props) {
  const { message } = props;
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <img alt="" width="120px" height="103px" src={biblethump} />
      <Box sx={{ ml: 1, maxWidth: "13rem" }}>
        <Typography variant="body2" style={{ color: "#868686" }}>
          {message ? message : "Whatever you are looking for does not exist."}
        </Typography>
        <Button href="/" variant="contained" color="primary" sx={{ mt: 0.5, whiteSpace: "nowrap" }}>
          Browse
        </Button>
      </Box>
    </Box>
  );
}
