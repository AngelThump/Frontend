import { Box, Typography, Grid, Link } from "@mui/material";
import CustomLink from "../utils/CustomLink";
import CustomTooltip from "../utils/CustomTooltip";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NumberAbbreviate from "number-abbreviate";
dayjs.extend(duration);

export default function Stream(props) {
  const { stream, gridSize } = props;
  const [timer, setTimer] = useState(dayjs().unix() - dayjs(stream.createdAt).unix());

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
            <Typography variant="caption" sx={{ backgroundColor: "rgba(0,0,0,.6)", p: 0.5 }}>
              {`${NumberAbbreviate(stream.viewer_count, 1)} viewers`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <Box sx={{ position: "absolute", top: 0, right: 0, p: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pr: 1, pt: 0.5, pb: 0.5, backgroundColor: "rgba(0,0,0,.6)" }}>
              <AccessTimeIcon fontSize="0.75rem" color="error" />
              <Typography sx={{ ml: 0.3, lineHeight: 0 }} variant="caption">{`${dayjs.duration(timer, "s").format("H:mm:ss")}`}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1, mb: 1, display: "flex", alignItems: "center" }}>
        <Box sx={{ minWidth: 0, width: "100%", display: "flex", alignItems: "center" }}>
          <Link href={`/${stream.user.username}`}>
            <Box sx={{ position: "relative", maxHeight: "100%", width: "2.5rem", height: "2.5rem" }}>
              <img style={{ borderRadius: "9000px", width: "100%" }} alt="" src={stream.user.profile_logo_url} />
            </Box>
          </Link>
          <Box sx={{ ml: 0.5, pb: 0.5, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <CustomTooltip title={stream.user.title} disableInteractive>
              <span>
                <CustomLink href={`/${stream.user.username}`} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", lineHeight: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: "550" }} noWrap>
                    {stream.user.title}
                  </Typography>
                </CustomLink>
              </span>
            </CustomTooltip>
            <CustomLink href={`/${stream.user.username}`} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", lineHeight: 0 }}>
              <Typography variant="caption" color="#b4b4b4" sx={{ fontWeight: "550" }} noWrap>
                {stream.user.display_name}
              </Typography>
            </CustomLink>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
