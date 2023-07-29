import { styled } from "@mui/material";
import { NavLink as NavLinkBase } from "react-router-dom";

const NavLink = styled(NavLinkBase)(({ theme }) => ({
  color: theme.palette.alt.main,
  "&:hover": {
    opacity: "50%",
  },
  "&.active": {
    color: theme.palette.primary.main,
  },
}));

export default NavLink;
