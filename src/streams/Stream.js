import { Box, Typography, Grid, Link } from "@mui/material";
import CustomLink from "../utils/CustomLink";
import CustomTooltip from "../utils/CustomTooltip";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function Stream(props) {
  const { stream, gridSize } = props;
  const [timer, setTimer] = useState(dayjs(stream.createdAt).unix());

  useEffect(() => {
    const timerFunc = () => {
      setTimer((timer) => timer + 1);
    };

    const timeout = setInterval(timerFunc, 1000);
    return () => clearInterval(timeout);
  }, []);

  return (
    <Grid item xs={gridSize} sx={{ maxWidth: "18rem", flexBasis: "18rem" }}>
      <Box
        sx={{
          overflow: "hidden",
          height: 0,
          paddingTop: "56.25%",
          position: "relative",
          "&:hover": {
            boxShadow: "0 0 8px #03a9f4",
          },
        }}
      >
        <Link href={`/${stream.user.username}`}>
          <img alt={`${stream.user.username}'s thumbnail`} src={stream.thumbnail_url} className={!stream.user.nsfw ? "thumbnail" : "image-blur"} />
          {stream.user.nsfw && (
            <Typography className="nsfw" variant="h2">
              {`NSFW`}
            </Typography>
          )}
        </Link>
        <Box sx={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 0.5 }}>
            <Typography variant="caption" sx={{ backgroundColor: "rgba(0,0,0,.6)" }}>
              {`${stream.viewer_count} viewers`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <Box sx={{ position: "absolute", top: 0, right: 0, p: 0.5 }}>
            <Typography variant="caption" sx={{ backgroundColor: "rgba(0,0,0,.6)" }}>
              {`${dayjs.unix(timer).format("HH:mm:ss")}`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1, mb: 1, display: "flex", alignItems: "center" }}>
        <Box sx={{ minWidth: 0, width: "100%", display: "flex", alignItems: "center" }}>
          <Link href={`/${stream.user.username}`}>
            <img alt="" width="40px" height="40px" src={stream.user.profile_logo_url} style={{ borderRadius: "50%" }} />
          </Link>
          <Box sx={{ ml: 0.5, pb: 0.5, display: "flex", flexDirection: "column" }}>
            <CustomTooltip title={stream.user.title}>
              <span>
                <CustomLink href={`/${stream.user.username}`} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                  <Typography variant="caption" color="#fff" sx={{ fontWeight: "550" }}>
                    {stream.user.title}
                  </Typography>
                </CustomLink>
              </span>
            </CustomTooltip>
            <CustomLink href={`/${stream.user.username}`} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
              <Typography variant="caption" color="#b4b4b4" sx={{ fontWeight: "550" }}>
                {stream.user.display_name}
              </Typography>
            </CustomLink>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
