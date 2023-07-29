import { Typography, Button, Box } from "@mui/material";
import biblethump from "../assets/biblethump_small.png";
import { useEffect } from "react";

export default function NotFound(props) {
  const { message } = props;

  useEffect(() => {
    document.title = "? - AngelThump";
  }, []);

  return (
    <Box sx={{ minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
      <img alt="" src={biblethump} />
      <Typography sx={{ p: 1 }} variant="alt">
        {message ? message : "Whatever you are looking for does not exist."}
      </Typography>
      <Button href="/" variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }}>
        Home
      </Button>
    </Box>
  );
}
