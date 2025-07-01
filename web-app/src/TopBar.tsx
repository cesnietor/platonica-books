import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Container, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useAuth } from "./hooks/useAuth";

function TopBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [anchorMenuElement, setAnchorMenuElement] =
    useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorMenuElement(null);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorMenuElement(event.currentTarget);
  };
  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await logout();
    } finally {
      setLoadingLogout(false);
      handleClose();
    }
  };

  return (
    <AppBar position="sticky" color="default">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Platonica
          </Typography>

          <Button
            color="inherit"
            variant="text"
            size="medium"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            variant="text"
            size="medium"
            onClick={handleOpenUserMenu}
          >
            Options
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorMenuElement}
            disableRestoreFocus //stops it returning focus on close
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorMenuElement)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              {loadingLogout && <CircularProgress size={16} sx={{ mr: 1 }} />}
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopBar;
