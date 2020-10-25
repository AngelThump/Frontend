import React from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { List, ListItemText, ListItem, makeStyles } from "@material-ui/core";

export default function TopNav() {
  const classes = useStyles();
  const LinkRef = React.forwardRef((props, ref) => (
    <div ref={ref}>
      <NavLink {...props} />
    </div>
  ));

  return (
    <List
      component="nav"
      aria-labelledby="main navigation"
      className={classes.nav}
    >
      <ListItem component={LinkRef} to="/">
        <img alt="" src={logo} />
      </ListItem>
      <ListItem
        component={LinkRef}
        to="/help/ingests"
        exact
        button
        activeClassName={classes.linkTextActive}
        className={classes.linkText}
      >
        <ListItemText primary="Ingests" />
      </ListItem>
      <ListItem
        component={LinkRef}
        to="/help/stream"
        exact
        button
        activeClassName={classes.linkTextActive}
        className={classes.linkText}
      >
        <ListItemText primary="How to Stream" />
      </ListItem>
    </List>
  );
}

const useStyles = makeStyles({
  nav: {
    display: `flex`,
    alignItems: "center",
    justifyContent: "center"
  },
  linkText: {
    textDecoration: `none`,
    color: `#fff`,
    "&:hover": {
      opacity: "50%",
    },
  },
  linkTextActive: {
    color: `#84dcff!important`,
    "&:hover": {
      opacity: "100%!important",
    },
  },
});