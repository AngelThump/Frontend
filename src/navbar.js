import React from "react";
import logo from "./assets/logo.png";
import client from "./feathers";
import Auth from "./auth";
import { NavLink } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Button,
  Menu,
  MenuItem,
  Typography,
  Divider,
  withStyles,
  Hidden,
  IconButton,
  Modal,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";

const navMenuLinks = [
  { title: `How to Stream`, path: `/help` },
  { title: `Status`, path: `https://status.angelthump.com` },
  { title: `Patreon`, path: `https://patreon.com/join/angelthump` },
  { title: `Discord (Support & Chill)`, path: `https://discord.gg/QGrZXNh` },
  {
    title: `Digitalocean (Get $100 in credit)`,
    path: `https://m.do.co/c/9992c85854c2`,
  },
  { title: `Github`, path: `https://github.com/angelthump` },
];
const legalLinks = [
  { title: `Terms of Service`, path: `/p/tos` },
  { title: `Privacy Policy`, path: `/p/privacy` },
  { title: `DMCA`, path: `/p/dmca` },
];

const useStyles = makeStyles({
  navDisplayFlex: {
    display: `flex`,
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
  button: {
    color: `#fff`,
    "&:hover": {
      opacity: "0.7"
    }
  },
  menuHeader: {
    marginLeft: "1rem",
    marginBottom: "0.3rem",
    color: "#868686",
    fontWeight: 500,
  },
  modalContent: {
    position: "absolute",
    width: "400px",
    backgroundColor: "#1d1d1d",
    outline: "none",
  },
  modal: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const StyledMenu = withStyles({
  paper: {
    backgroundColor: "#1d1d1d",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    {...props}
  />
));

export default function NavBar(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const LinkRef = React.forwardRef((props, ref) => (
    <div ref={ref}>
      <NavLink {...props} />
    </div>
  ));

  if (props.user === undefined) return null;

  const handleClick = (evt) => {
    setAnchorEl(evt.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => {
    setModal(true);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  const goToSettings = () => {
    props.history.push("/settings");
  };

  const logOut = () => {
    client.logout();
  };

  return (
    <AppBar position="static" style={{ background: "#1d1d1d", height: "4rem" }}>
      <Toolbar>
        <List
          component="nav"
          aria-labelledby="main navigation"
          className={classes.navDisplayFlex}
        >
          <Hidden only="xs">
            <ListItem
              component={LinkRef}
              to="/"
              exact
              button
              activeClassName={classes.linkTextActive}
              className={classes.linkText}
            >
              <ListItemText primary="Browse" />
            </ListItem>

            {props.user ? (
              <ListItem
                component={LinkRef}
                to="/dashboard"
                button
                exact
                activeClassName={classes.linkTextActive}
                className={classes.linkText}
              >
                <ListItemText primary="Dashboard" />
              </ListItem>
            ) : (
              <></>
            )}
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              className={classes.button}
              onClick={handleClick}
              style={{ color: "#efeff1" }}
            >
              <MoreHoriz />
            </IconButton>
            <StyledMenu
              id="nav-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Typography className={classes.menuHeader}>PAGES</Typography>
              {navMenuLinks.map(({ title, path }) => (
                <a
                  href={path}
                  key={title}
                  className={`${classes.linkText} ${classes.navLink}`}
                >
                  <MenuItem button>{title}</MenuItem>
                </a>
              ))}
              <Divider
                style={{ marginBottom: "1rem", backgroundColor: "#2a2a2a" }}
              />
              <Typography className={classes.menuHeader}>LEGAL</Typography>
              {legalLinks.map(({ title, path }) => (
                <a
                  href={path}
                  key={title}
                  className={`${classes.linkText} ${classes.navLink}`}
                >
                  <MenuItem button>{title}</MenuItem>
                </a>
              ))}
            </StyledMenu>
          </Hidden>
          <Hidden only={["md", "xl", "sm", "lg"]}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              className={classes.button}
              onClick={handleClick}
              style={{ color: "#efeff1" }}
            >
              <MoreHoriz />
            </IconButton>
            <StyledMenu
              id="long-nav-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <a
                href="/"
                key="Browse"
                className={`${classes.linkText} ${classes.navLink}`}
              >
                <ListItem button>
                  <ListItemText primary="Browse" />
                </ListItem>
              </a>
              {props.user ? (
                <a
                  href="/"
                  key="Dashboard"
                  className={`${classes.linkText} ${classes.navLink}`}
                >
                  <ListItem button>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                </a>
              ) : null}
              <Typography
                className={classes.menuHeader}
                style={{ marginTop: "1rem" }}
              >
                PAGES
              </Typography>
              {navMenuLinks.map(({ title, path }) => (
                <a
                  href={path}
                  key={title}
                  className={`${classes.linkText} ${classes.navLink}`}
                >
                  <MenuItem button>{title}</MenuItem>
                </a>
              ))}
              <Divider
                style={{ marginBottom: "1rem", backgroundColor: "#2a2a2a" }}
              />
              <Typography className={classes.menuHeader}>LEGAL</Typography>
              {legalLinks.map(({ title, path }) => (
                <a
                  href={path}
                  key={title}
                  className={`${classes.linkText} ${classes.navLink}`}
                >
                  <MenuItem button>{title}</MenuItem>
                </a>
              ))}
            </StyledMenu>
          </Hidden>
          <a style={{ marginLeft: "auto", marginRight: "auto" }} href="/">
            <img
              alt="logo"
              width="110px"
              style={{ maxWidth: "100%", height: "auto" }}
              src={logo}
            ></img>
          </a>
        </List>
        {props.user ? (
          <>
            <Button
              onClick={goToSettings}
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{ whiteSpace: "nowrap", textTransform: "none" }}
            >
              Settings
            </Button>
            <Button
              onClick={logOut}
              variant="contained"
              color="primary"
              className={classes.button}
              style={{
                marginLeft: "1rem",
                whiteSpace: "nowrap",
                textTransform: "none",
              }}
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleModalOpen}
              variant="contained"
              color="primary"
              className={classes.button}
              style={{ whiteSpace: "nowrap", textTransform: "none" }}
            >
              Login
            </Button>
            <Modal
              open={modal}
              onClose={handleModalClose}
              aria-labelledby="Login"
              aria-describedby="Login to AngelThump"
            >
              <div className={`${classes.modalContent} ${classes.modal}`}>
                <Auth user={props.user} history={props.history}></Auth>
              </div>
            </Modal>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
