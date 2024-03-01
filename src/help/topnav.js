import React from "react";
import NavLink from "../utils/NavLink";
import { Box, Typography } from "@mui/material";

export default function TopNav() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
      <NavLink to="/help/stream" style={{ marginRight: "1rem" }}>
        <Typography variant="body1">How to Stream</Typography>
      </NavLink>
      <NavLink to="/help/ingests">
        <Typography variant="body1">Ingests</Typography>
      </NavLink>
    </Box>
  );
}
