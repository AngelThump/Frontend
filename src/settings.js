import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import SimpleBar from "simplebar-react";
import VerifyCode from "./auth/verify-code";
import Profile from "./settings/profile";
import Security from "./settings/security";
import ChannelSettings from "./settings/channel";
import Connections from "./settings/connections";
import Patreon from './settings/patreon';
import {
  makeStyles,
  Typography,
  ListItemText,
  ListItem,
  List,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  verfiyCode: {
    margin: "0 auto",
    maxWidth: "21rem",
    marginTop: "2rem",
  },
  settingsTab: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
    paddingTop: "2rem",
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
}));

export default function Settings(props) {
  const classes = useStyles();
  useEffect(() => {
    document.title = "Settings - AngelThump";
    return;
  }, []);

  const LinkRef = React.forwardRef((props, ref) => (
    <div ref={ref}>
      <NavLink {...props} />
    </div>
  ));

  if (props.user === undefined) return null;
  if (!props.user) return props.history.push("/login");

  const subPath = props.match.params.subPath;

  if (!props.user.isVerified && subPath !== "security") {
    return (
      <div className={classes.verfiyCode}>
        <VerifyCode email={props.user.email} />
      </div>
    );
  }

  return (
    <>
      <div className={classes.settingsTab}>
        <Typography className={classes.header} variant="h5">
          Settings
        </Typography>
        <List component="nav" className={classes.navDisplayFlex}>
          <ListItem
            disableGutters
            component={LinkRef}
            to="/settings/profile"
            button
            exact
            activeClassName={classes.linkTextActive}
            className={classes.linkText}
          >
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem
            disableGutters
            component={LinkRef}
            to="/settings/channel"
            button
            exact
            activeClassName={classes.linkTextActive}
            className={classes.linkText}
          >
            <ListItemText primary="Channel Settings" />
          </ListItem>
          <ListItem
            disableGutters
            component={LinkRef}
            to="/settings/security"
            button
            exact
            activeClassName={classes.linkTextActive}
            className={classes.linkText}
          >
            <ListItemText primary="Security" />
          </ListItem>
          <ListItem
            disableGutters
            component={LinkRef}
            to="/settings/connections"
            button
            exact
            activeClassName={classes.linkTextActive}
            className={classes.linkText}
          >
            <ListItemText primary="Connections" />
          </ListItem>
          {props.user.patreon ? (
            <ListItem
              disableGutters
              component={LinkRef}
              to="/settings/patreon"
              button
              exact
              activeClassName={classes.linkTextActive}
              className={classes.linkText}
            >
              <ListItemText primary="Patreon" />
            </ListItem>
          ) : null}
        </List>
      </div>
      <SimpleBar style={{ height: "calc(100% - 10rem)" }}>
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
    </>
  );
}
