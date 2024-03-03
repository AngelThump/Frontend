import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import VerifyCode from "./auth/verify-code";
import Profile from "./settings/profile";
import Security from "./settings/security";
import ChannelSettings from "./settings/channel";
import Connections from "./settings/connections";
import Patreon from "./settings/patreon";
import NavLink from "./utils/NavLink";
import { Typography, Box, Paper, Divider, Modal } from "@mui/material";
import { useParams } from "react-router-dom";
import logo from "./assets/logo.png";
import NotFound from "./utils/NotFound";

export default function Settings(props) {
  const { user } = props;
  const { subPath } = useParams();
  const [showVerificationModal, setShowVerificationModal] = useState(user && !user.isVerified);

  useEffect(() => {
    document.title = "Settings - AngelThump";
    return;
  }, []);

  if (!user) return (window.location.href = "/");

  return (
    <Box sx={{ pl: 4, pr: 4, pt: 2, height: "100%", width: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Typography variant="h4" sx={{ fontWeight: 550 }}>
        Settings
      </Typography>
      <Box sx={{ display: "flex", mt: 1 }}>
        <Box sx={{ mr: 2 }}>
          <NavLink to="/settings/profile">
            <Typography variant="body1">Profile</Typography>
          </NavLink>
        </Box>
        <Box sx={{ mr: 2 }}>
          <NavLink to="/settings/channel">
            <Typography variant="body1">Channel Settings</Typography>
          </NavLink>
        </Box>
        <Box sx={{ mr: 2 }}>
          <NavLink to="/settings/security">
            <Typography variant="body1">Security</Typography>
          </NavLink>
        </Box>
        <Box sx={{ mr: 2 }}>
          <NavLink to="/settings/connections">
            <Typography variant="body1">Connections</Typography>
          </NavLink>
        </Box>
        <Box sx={{ mr: 2 }}>
          <NavLink to="/settings/patreon">
            <Typography variant="body1">Patreon</Typography>
          </NavLink>
        </Box>
      </Box>
      <Divider />
      <SimpleBar style={{ height: "100%", minHeight: 0 }}>
        {subPath === "profile" ? (
          <Profile user={user} />
        ) : subPath === "channel" ? (
          <ChannelSettings user={user} />
        ) : subPath === "security" ? (
          <Security user={user} />
        ) : subPath === "connections" ? (
          subPath === "connections" && <Connections user={user} />
        ) : subPath === "patreon" ? (
          <Patreon user={user} />
        ) : (
          <Box sx={{ mt: 2 }}>
            <NotFound />
          </Box>
        )}
      </SimpleBar>
      <Modal open={showVerificationModal} onClose={() => setShowVerificationModal(false)}>
        <Box sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", outline: "none" }}>
          <Paper sx={{ display: "flex", flexDirection: "column", maxWidth: "400px", p: 2 }}>
            <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
            <Typography sx={{ alignSelf: "center", color: "#efeff1", fontWeight: 600 }} variant="h5">
              {`Verify your Email Address`}
            </Typography>
            <VerifyCode email={user.email} />
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
