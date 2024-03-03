import { useState } from "react";
import client from "../auth/feathers";
import { Typography, Box, Button, Alert, Paper } from "@mui/material";

export default function Connections(props) {
  const { user } = props;
  const [patreonError, setPatreonError] = useState(false);
  const [patreonSuccess, setPatreonSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);

  const updatePatreonStatus = async () => {
    setPatreonError(false);
    setPatreonSuccess(false);
    setDisable(true);

    const { accessToken } = await client.get("authentication");
    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/verify/patreon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setPatreonError(true);
          setMessage(data.message);
          setPatreonSuccess(false);
          return;
        }
        setPatreonError(false);
        setMessage(data.message);
        setPatreonSuccess(true);
      })
      .catch((e) => {
        setPatreonError(true);
        setMessage("Server encountered an Error");
        setPatreonSuccess(false);
        return;
      });
    setTimeout(() => {
      setDisable(false);
    }, 3000);
  };

  return (
    <Box sx={{ maxWidth: "55rem", mt: 2, mb: 2 }}>
      <Box>
        <Typography variant="h6" color="text.primary">
          Patreon
        </Typography>
        <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
          Verify your patreon status
        </Typography>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", borderRadius: "4px", mt: 2 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexShrink: 0, width: "10rem" }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Patreon Status
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 550, color: user.patreon && user.patreon.isPatron ? "#66bb6a" : "#f44336" }} variant="body2">
                      {user.patreon && user.patreon.isPatron ? "You are a patron" : "Not a patron"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexShrink: 0, width: "10rem" }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Patreon Tier
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <Typography sx={{ fontWeight: 550 }} variant="body2">
                      {user.patreon && user.patreon.tierName ? user.patreon.tierName : ""}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexShrink: 0, width: "10rem" }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Update Patreon Status/Tier
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {patreonSuccess ? (
                      <Alert sx={{ mb: 0.5 }} severity="success">
                        {message}
                      </Alert>
                    ) : patreonError ? (
                      <Alert sx={{ mb: 0.5 }} severity="error">
                        {message}
                      </Alert>
                    ) : (
                      <></>
                    )}
                    <Button onClick={updatePatreonStatus} size="small" variant="contained" color="primary" disabled={!user.patreon && disable}>
                      Update
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
