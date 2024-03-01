import React, { useEffect } from "react";
import SimpleBar from "simplebar-react";
import VerifyCode from "./auth/verify-code";
import Profile from "./settings/profile";
//import Security from "./settings/security";
//import ChannelSettings from "./settings/channel";
//import Connections from "./settings/connections";
//import Patreon from "./settings/patreon";
import NavLink from "./utils/NavLink";
import { Typography, Box, Paper, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import logo from "./assets/logo.png";

const classes = {
  verfiyCode: {
    margin: "0 auto",
    maxWidth: "21rem",
    marginTop: "2rem",
  },
  header: {
    color: "#fff",
  },
  navDisplayFlex: {
    display: `flex`,
  },
  linkText: {
    textDecoration: `none`,
    color: `#fff`,
    "&:hover": {
      opacity: "50%",
    },
    marginRight: "1rem",
  },
  linkTextActive: {
    color: `#84dcff!important`,
    "&:hover": {
      opacity: "100%!important",
    },
  },
};

export default function Settings(props) {
  const { user } = props;
  const { subPath } = useParams();

  useEffect(() => {
    document.title = "Settings - AngelThump";
    return;
  }, []);

  if (!user) return (window.location.href = "/");

  if (!user.isVerified && subPath !== "security") {
    return (
      <Paper sx={{ display: "flex", flexDirection: "column", maxWidth: "400px", p: 2 }}>
        <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
        <Typography sx={{ alignSelf: "center", color: "#efeff1", fontWeight: 600 }} variant="h5">
          {`Verify your Email Address`}
        </Typography>
        <VerifyCode email={user.email} />
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ pl: 4, pr: 4, pt: 2 }}>
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
          {user.patreon && (
            <Box sx={{ mr: 2 }}>
              <NavLink to="/settings/patreon">
                <Typography variant="body1">Patreon</Typography>
              </NavLink>
            </Box>
          )}
        </Box>
        <Divider />
        <SimpleBar style={{ height: "100%", minHeight: 0 }}>
          <>{subPath === "profile" && <Profile user={props.user} />}</>
        </SimpleBar>
      </Box>
    </>
  );
}

/**
 * 
      <SimpleBar style={{ height: "100%", minHeight: 0 }}>
        {subPath === "profile" ? (
          <Profile user={props.user} />
        ) : subPath === "channel" ? (
          <ChannelSettings user={props.user} />
        ) : subPath === "security" ? (
          <Security user={props.user} />
        ) : subPath === "connections" ? (
          <Connections user={props.user} />
        ) : subPath === "patreon" ? (
          <Patreon user={props.user} />
        ) : (
          <Profile user={props.user} />
        )}
      </SimpleBar>
 */
