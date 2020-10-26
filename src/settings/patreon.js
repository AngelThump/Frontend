import React from "react";
import client from "../feathers";
import { Typography, makeStyles, Box, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default function Connections(props) {
  const classes = useStyles();
  const [patreonError, setPatreonError] = React.useState(false);
  const [patreonSuccess, setPatreonSuccess] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [disable, setDisable] = React.useState(false);

  const updatePatreonStatus = async () => {
    setPatreonError(false);
    setPatreonSuccess(false);
    setDisable(true);

    const { accessToken } = await client.get("authentication");
    await fetch("https://sso.angelthump.com/v1/user/verify/patreon", {
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
          return console.error(data);
        }
        setPatreonError(false);
        setMessage(data.message);
        setPatreonSuccess(true);
      })
      .catch((e) => {
        setPatreonError(true);
        setMessage("Server encountered an Error");
        setPatreonSuccess(false);
        return console.error(e);
      });
    setTimeout(() => {
      setDisable(false);
    }, 3000);
  };

  return (
    <div className={classes.root}>
      <Typography
        variant="h6"
        className={classes.title}
        style={{ marginBottom: "0.3rem" }}
      >
        Patreon
      </Typography>
      <div style={{ marginBottom: "1rem" }}>
        <Typography variant="caption" style={{ color: "#868686" }}>
          Use your Patreon features
        </Typography>
      </div>
      <div className={classes.borderBox}>
        <div style={{ padding: "2rem" }}>
          <Box flexGrow={1} position="relative">
            <Box display="flex" flexWrap="nowrap">
              <div className={classes.label}>
                <Typography variant="body2" className={classes.textLabel}>
                  Patreon Status
                </Typography>
              </div>
              <div style={{ flexGrow: 1 }}>
                <Typography variant="body2" className={classes.textLabel}>
                  {props.user.patreon.isPatron
                    ? "You are a patron"
                    : "You are not a patron"}
                </Typography>
              </div>
            </Box>
          </Box>
        </div>
        <div style={{ padding: "2rem" }}>
          <Box flexGrow={1} position="relative">
            <Box display="flex" flexWrap="nowrap">
              <div className={classes.label}>
                <Typography variant="body2" className={classes.textLabel}>
                  Patreon Tier
                </Typography>
              </div>
              <div style={{ flexGrow: 1 }}>
                <Typography variant="body2" className={classes.textLabel}>
                  {props.user.patreon.tierName
                    ? props.user.patreon.tierName
                    : props.user.patreon.tier}
                </Typography>
              </div>
            </Box>
          </Box>
        </div>
        <div style={{ padding: "2rem" }}>
          <Box flexGrow={1} position="relative">
            <Box display="flex" flexWrap="nowrap">
              <div className={classes.label}>
                <Typography variant="body2" className={classes.textLabel}>
                  Update Patreon Status/Tier
                </Typography>
              </div>
              <div style={{ flexGrow: 1 }}>
                {patreonSuccess ? (
                  <Alert style={{ marginBottom: ".5rem" }} severity="success">
                    {message}
                  </Alert>
                ) : patreonError ? (
                  <Alert style={{ marginBottom: ".5rem" }} severity="error">
                    {message}
                  </Alert>
                ) : (
                  <></>
                )}
                <Button
                  onClick={updatePatreonStatus}
                  size="small"
                  classes={{ disabled: classes.disabled }}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  disabled={disable}
                >
                  Update
                </Button>
              </div>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "55rem",
    height: "100%",
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
  button: {
    textTransform: "none",
    "&:hover": {
      opacity: "0.7",
    },
  },
  title: {
    marginBottom: "1rem",
    fontWeight: "800",
    color: "#b6b6b6",
  },
  borderBox: {
    borderColor: "#2a2a2a",
    backgroundColor: "#1d1d1d",
    border: "1px solid hsla(0,0%,100%,.1)",
    marginBottom: "3rem",
    borderRadius: "4px",
  },
  box: {
    padding: "1rem",
  },
  text: {
    color: "#b6b6b6",
  },
  label: {
    flexShrink: 0,
    width: "15rem",
    paddingRight: "1rem",
    alignSelf: "center",
  },
  textLabel: {
    color: "#f7f7f8",
    fontWeight: "550",
  },
  disabled: {
    backgroundColor: "hsla(0,0%,100%,.15)!important",
    color: "hsla(0,0%,100%,.5)!important",
    cursor: "not-allowed!important",
  },
}));
