import React from "react";
import biblethump from "./assets/biblethump_small.png";
import { Container, Typography, Button, Box } from "@material-ui/core";

export default function NotFound(props) {
  document.title = "? - AngelThump"
  return (
    <Container maxWidth={false} disableGutters>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <img alt="" width="120px" height="103px" src={biblethump} />
        <div style={{marginLeft: "1rem", maxWidth: "13rem"}}>
          <Typography
            variant="body2"
            style={{ color: "#868686" }}
          >
            {props.message
              ? props.message
              : "Whatever you are looking for does not exist."}
          </Typography>
          <Button
            href="/"
            variant="contained"
            color="primary"
            style={{ marginTop: "0.5rem", whiteSpace: "nowrap" }}
          >
            Browse
          </Button>
        </div>
      </Box>
    </Container>
  );
}
