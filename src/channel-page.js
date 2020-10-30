import React, { useEffect } from "react";
import ChannelPageError from "./channel/channel_page_error";
import { PageView, initGA } from "./tracking";
import { PersonOutline, QueryBuilder } from "@material-ui/icons";
import moment from "moment";

import {
  useMediaQuery,
  makeStyles,
  Container,
  Typography,
  Icon,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  statParent: {
    position: "relative",
    width: "100%",
    paddingLeft: "0.3rem",
    paddingRight: "0.3rem",
    marginTop: "0.3rem",
  },
  avatar: {
    marginRight: "0.5rem",
    alignItems: "stretch",
  },
  imgAvatar: {
    borderRadius: "25px",
    borderCollapse: "separate",
    height: "2.3rem",
    width: "2.3rem",
  },
  text: {
    color: "#fff",
  },
  username: {
    color: "#dcdcdc",
  },
  live: {
    backgroundColor: "#e91916",
    pointerEvents: "none",
    borderRadius: "5px",
    paddingLeft: "0.3rem",
    paddingRight: "0.3rem",
  },
}));

export default function ChannelPage(props) {
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [live, setLive] = React.useState(null);
  const [stream, setStream] = React.useState(null);
  const [channel, setChannel] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [timer, setTimer] = React.useState(null);

  useEffect(() => {
    initGA();
    PageView();
    document.title = `${props.match.params.channel} - AngelThump`;

    const fetchStream = async () => {
      fetch(
        `https://api.angelthump.com/v2/streams/${props.match.params.channel}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error || data.code > 400 || data.status > 400) {
            return console.error(data.errorMsg);
          }
          document.title = `${data.user.display_name} - AngelThump`;
          setLive(data.type === "live");
          setStream(data);
          setChannel(data.user);
          setLoading(false);
          setTimer(moment.utc().diff(moment.utc(data.createdAt)));
        })
        .catch((e) => {
          console.error(e);
        });
    };

    fetchStream();
    const intervalID = setInterval(fetchStream, 30000);
    return () => {
      clearInterval(intervalID);
    };
  }, [props.match]);

  useEffect(() => {
    const timerFunc = () => {
      if (!live) return;
      setTimer(timer + 1000);
    };

    const timeout = setTimeout(timerFunc, 1000);
    return () => clearTimeout(timeout);
  });

  if (loading) return null;
  if (props.user === undefined) return null;
  if (stream === null) return <ChannelPageError />;
  if (channel.banned)
    return <ChannelPageError message={`${channel.display_name} is banned`} />;

  const showChat =
    channel.twitch && channel.patreon
      ? (channel.patreon.isPatron && channel.patreon.tier > 1) || channel.angel
      : false;

  return (
    <Container maxWidth={false} disableGutters style={{ height: "100%" }}>
      <Box
        display="flex"
        flexWrap="nowrap"
        justifyContent="center"
        style={{ height: "3rem" }}
      >
        <Box className={classes.statParent}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" flexWrap="nowrap" alignItems="center">
              <Box className={classes.avatar} display="flex">
                <img
                  className={classes.imgAvatar}
                  alt=""
                  src={channel.profile_logo_url}
                />
              </Box>
              <Typography className={classes.username} variant="body2">
                {channel.display_name}
              </Typography>
              {live ? (
                <Box alignItems="center" style={{ marginLeft: "0.5rem" }}>
                  <Typography
                    className={`${classes.text} ${classes.live}`}
                    variant="body2"
                  >
                    {`LIVE`}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <Box
              display="flex"
              flexGrow="1"
              flexWrap="nowrap"
              alignItems="center"
              justifyContent="center"
            >
              {live ? (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginRight: "1rem" }}
                  >
                    <Icon style={{ color: "#84dcff" }}>
                      <PersonOutline />
                    </Icon>
                    <Typography className={classes.text} variant="body2">
                      {stream.viewer_count}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginRight: "1rem" }}
                  >
                    <Icon style={{ color: "#84dcff", marginRight: "0.2rem" }}>
                      <QueryBuilder />
                    </Icon>
                    <Typography className={classes.text} variant="body2">
                      {moment.utc(timer).format("HH:mm:ss")}
                    </Typography>
                  </Box>
                </>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {!isMobile ? (
        <Box
          display="flex"
          flexWrap="nowrap"
          style={{ height: "calc(100% - 3rem)" }}
        >
          <iframe
            title="Player"
            style={{ width: showChat ? "calc(100% - 340px)" : "100%" }}
            width="100%"
            height="100%"
            marginHeight="0"
            marginWidth="0"
            frameBorder="0"
            allowtransparency="true"
            allowFullScreen
            src={`https://player.angelthump.com/?channel=${channel.username}`}
            scrolling="true"
          />
          {showChat ? (
            <iframe
              title="Chat"
              style={{ width: "340px" }}
              scrolling="no"
              height="100%"
              width="100%"
              seamless="seamless"
              frameBorder="0"
              src={`https://www.twitch.tv/embed/${channel.twitch.channel}/chat?darkpopout&parent=angelthump.com`}
            />
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <Box display="block" style={{ height: "100%" }}>
          <iframe
            title="Player"
            style={{ height: showChat ? "calc(100% - 500px)" : "calc(100% - 3rem)" }}
            width="100%"
            height="100%"
            marginHeight="0"
            marginWidth="0"
            frameBorder="0"
            allowtransparency="true"
            allowFullScreen
            src={`https://player.angelthump.com/?channel=${channel.username}`}
            scrolling="true"
          />
          {showChat ? (
            <iframe
              title="Chat"
              style={{ height: "calc(500px - 3rem)" }}
              scrolling="no"
              seamless="seamless"
              frameBorder="0"
              height="100%"
              width="100%"
              src={`https://www.twitch.tv/embed/${channel.twitch.channel}/chat?darkpopout&parent=angelthump.com`}
            />
          ) : (
            <></>
          )}
        </Box>
      )}
    </Container>
  );
}
