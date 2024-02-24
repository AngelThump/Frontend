import React from "react";
import { AppBar, Toolbar, Typography, useMediaQuery, Box, Menu, IconButton, MenuItem, Divider, Link, Button, Modal } from "@mui/material";
import Logo from "../assets/logo.png";
import client from "../auth/feathers";
import NavLink from "../utils/NavLink";
import { MoreHoriz } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Auth from "../auth";

const navMenuLinks = [
  { title: `How to Stream`, path: `/p/help` },
  { title: `Status`, path: `https://status.angelthump.com` },
  { title: `Patreon`, path: `https://patreon.com/join/angelthump` },
  { title: `Discord (Support)`, path: `https://discord.gg/QGrZXNh` },
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

export default function NavBar(props) {
  const { user } = props;
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [navAnchorEl, setNavAnchorEl] = React.useState(null);
  const [userAnchorEl, setUserAnchorEl] = React.useState(null);
  const [modal, setModal] = React.useState(false);

  const logOut = () => {
    fetch(`${process.env.REACT_APP_AUTH_BASE}/logout`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(() => client.logout())
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Box sx={{ flex: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Box sx={{ mr: 2 }}>
              <NavLink to="/">
                <Typography variant="body1">Browse</Typography>
              </NavLink>
            </Box>
            <Box>
              <IconButton color="alt" onClick={(e) => setNavAnchorEl(e.currentTarget)}>
                <MoreHoriz />
              </IconButton>
              <Menu elevation={1} anchorEl={navAnchorEl} keepMounted open={Boolean(navAnchorEl)} onClose={() => setNavAnchorEl(null)}>
                <Box sx={{ pt: 2, pl: 2, pr: 2 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="alt" fontWeight={600}>
                      PAGES
                    </Typography>
                    <Divider />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    {navMenuLinks.map(({ title, path }) => (
                      <MenuItem key={title} component={Link} dense disableGutters href={path}>
                        {title}
                      </MenuItem>
                    ))}
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="alt" fontWeight={600}>
                      LEGAL
                    </Typography>
                    <Divider />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    {legalLinks.map(({ title, path }) => (
                      <MenuItem key={title} component={Link} dense disableGutters href={path}>
                        {title}
                      </MenuItem>
                    ))}
                  </Box>
                </Box>
              </Menu>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Box>
              <a href="/">
                <img alt="" style={{ maxWidth: "120px", height: "auto" }} src={Logo} />
              </a>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "end", flex: 1 }}>
            {user && (
              <Box>
                <IconButton disableRipple color="alt" onClick={(e) => setUserAnchorEl(e.currentTarget)}>
                  <img alt="" src={user.profile_logo_url} style={{ borderRadius: "50%", width: "2.5rem", height: "2.5rem" }} />
                </IconButton>
                <Menu elevation={1} anchorEl={userAnchorEl} keepMounted open={Boolean(userAnchorEl)} onClose={() => setUserAnchorEl(null)}>
                  <Box sx={{ pl: 2, pr: 2 }}>
                    <MenuItem component={Link} dense disableGutters href={`/${user.username}`}>
                      <PersonIcon color="alt" size="small" sx={{ mr: 1 }} />
                      <Typography variant="userNavText">Channel</Typography>
                    </MenuItem>
                    <MenuItem component={Link} dense disableGutters href={`/dashboard`}>
                      <DashboardIcon color="alt" size="small" sx={{ mr: 1 }} />
                      <Typography variant="userNavText">Dashboard</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} dense disableGutters href={`/settings`}>
                      <SettingsIcon color="alt" size="small" sx={{ mr: 1 }} />
                      <Typography variant="userNavText">Settings</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem dense disableGutters onClick={logOut}>
                      <LogoutIcon color="alt" size="small" sx={{ mr: 1 }} />
                      <Typography variant="userNavText">Log Out</Typography>
                    </MenuItem>
                  </Box>
                </Menu>
              </Box>
            )}

            {!user && (
              <Box>
                <Button size={isMobile ? "small" : "medium"} onClick={() => setModal(true)} variant="contained" color="primary">
                  Login
                </Button>
                <Modal open={modal} onClose={() => setModal(false)}>
                  <Box sx={{ position: "absolute", width: "400px", backgroundColor: "#1d1d1d", outline: "none", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <Auth user={user} />
                  </Box>
                </Modal>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
