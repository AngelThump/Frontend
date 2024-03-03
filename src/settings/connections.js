import React from "react";
import patreon_oauth_logo from "../assets/patreon.png";
import twitch_oauth_logo from "../assets/twitch.png";
import client from "../auth/feathers";
import { Typography, Box, Icon, Button, Paper } from "@mui/material";
import { CheckCircleRounded } from "@mui/icons-material";

export default function Connections(props) {
  const { user } = props;
  const patreon = async () => {
    const { accessToken } = await client.get("authentication");
    if (user.patreon) {
      return await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/patreon`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((data) => {
          if (data.error || data.code > 400 || data.status > 400) {
            console.error(data);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
    window.location.href = `${process.env.REACT_APP_AUTH_BASE}/oauth/patreon?feathers_token=${accessToken}`;
  };

  const twitch = async () => {
    const { accessToken } = await client.get("authentication");
    if (user.twitch) {
      return await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/twitch`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((data) => {
          if (data.error || data.code > 400 || data.status > 400) {
            console.error(data);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
    window.location.href = `${process.env.REACT_APP_AUTH_BASE}/oauth/twitch?feathers_token=${accessToken}`;
  };

  return (
    <Box sx={{ maxWidth: "55rem", mt: 2, mb: 2 }}>
      <Box>
        <Typography variant="h6" color="text.primary">
          Connections
        </Typography>
        <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
          Manage your connected accounts
        </Typography>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", borderRadius: "4px", mt: 2 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: 2, position: "relative" }}>
                <img style={{ width: "80px", height: "80px" }} alt="" src={patreon_oauth_logo} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", mr: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 550 }}>
                  Patreon
                </Typography>
                {user.patreon ? (
                  <Box alignItems="center" display="flex">
                    <Icon sx={{ color: "#00e6cb" }}>
                      <CheckCircleRounded fontSize="small" />
                    </Icon>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 550 }}>
                        Your Patreon account is connected!
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  When you choose to connect your Patreon account, the profile information connected to your Patreon account, including your name, may be used by AngelThump. You will be able to use
                  patreon specific perks depeding on which tier you pledged. AngelThump will not publicly display your Patreon account information.
                </Typography>
              </Box>
              <Box>
                <Button onClick={patreon} size="small" variant="contained" color="primary">
                  {user.patreon ? "Disconnect" : "Connect"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", borderRadius: "4px", mt: 4 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: 2, position: "relative" }}>
                <img style={{ width: "80px", height: "80px" }} alt="" src={twitch_oauth_logo} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", mr: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 550 }}>
                  Twitch
                </Typography>
                {user.twitch ? (
                  <Box alignItems="center" display="flex">
                    <Icon sx={{ color: "#00e6cb" }}>
                      <CheckCircleRounded fontSize="small" />
                    </Icon>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 550, color: "#00e6cb" }}>
                        Your Twitch account is connected!
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  When you choose to connect your Twitch account, the profile information connected to your Twitch account, including your name, may be used by AngelThump. AngelThump will not publicly
                  display your Twitch account information.
                </Typography>
              </Box>
              <Box>
                <Button onClick={twitch} size="small" variant="contained" color="primary">
                  {user.twitch ? "Disconnect" : "Connect"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
