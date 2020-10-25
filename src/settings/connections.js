import React from "react";
import patreon_oauth_logo from "../assets/patreon_oauth_logo.jpg";
import client from "../feathers";
import { Typography, makeStyles, Box, Icon, Button } from "@material-ui/core";
import { CheckCircleRounded } from "@material-ui/icons";

export default function Connections(props) {
  const classes = useStyles();

  const patreon = async () => {
    const { accessToken } = await client.get("authentication");
    if (props.user.patreon) {
      return await fetch("https://sso.angelthump.com/v1/user/patreon", {
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
    window.location.href = `https://sso.angelthump.com/oauth/patreon?feathers_token=${accessToken}`;
  };

  return (
    <div className={classes.root}>
      <Typography
        variant="h6"
        className={classes.title}
        style={{ marginBottom: "0.3rem" }}
      >
        Connections
      </Typography>
      <div style={{ marginBottom: "1rem" }}>
        <Typography variant="caption" style={{ color: "#868686" }}>
          Manage your connected accounts
        </Typography>
      </div>
      <div className={classes.borderBox}>
        <div style={{ padding: "2rem" }}>
          <Box display="flex" flexDirection="row">
            <Box flexShrink={0} paddingRight="0.5rem" paddingTop="0.5rem">
              <Box borderRadius="4px" overflow="hidden">
                <img alt="" width={80} height={80} src={patreon_oauth_logo} />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              flexGrow={1}
              width="100%"
              paddingLeft="1rem"
              paddingRight="1rem"
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box display="flex" flexDirection="column" flexGrow={1}>
                  <Typography className={classes.textLabel} variant="body1">
                    Patreon
                  </Typography>
                  {props.user.patreon ? (
                    <Box alignItems="center" display="flex">
                      <Icon style={{ color: "#00e6cb" }}>
                        <CheckCircleRounded fontSize="small" />
                      </Icon>
                      <div style={{ marginTop: "5px" }}>
                        <Typography
                          variant="body2"
                          className={classes.textLabel}
                        >
                          Your Patreon account is connected!
                        </Typography>
                      </div>
                    </Box>
                  ) : null}
                </Box>
                <Button
                  onClick={patreon}
                  size="small"
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  style={{ color: "#fff" }}
                >
                  {props.user.patreon ? "Disconnect" : "Connect"}
                </Button>
              </Box>
              <div style={{ paddingTop: "1rem" }}>
                <Typography className={classes.text} variant="caption">
                  {`When you choose to connect your Patreon account, the profile information connected to your Patreon account, including your name, may be used by AngelThump. You will be able to use patreon specific perks depeding on which tier you pledged. AngelThump will not publicly display your Patreon account information.`}
                </Typography>
              </div>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
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
    width: "9rem",
    paddingRight: "1rem",
    marginTop: "5px",
    alignSelf: "center",
  },
  textLabel: {
    color: "#f7f7f8",
    fontWeight: "550",
  },
}));
