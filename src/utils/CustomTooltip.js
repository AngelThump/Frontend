import { tooltipClasses } from "@mui/material/Tooltip";
import { styled, Tooltip } from "@mui/material";

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} PopperProps={{ disablePortal: true }} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none",
  },
});

export default CustomTooltip;
