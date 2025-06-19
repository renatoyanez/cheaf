import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { doSignOut } from "../../firebase/auth";
import { INavElement } from "../../types/navigate";
import { useAuth } from "../../context/authContext";

const pages: Partial<INavElement>[] = [
  {
    label: "Products",
    path: "/products",
  },
  {
    label: "My Packages",
    path: "/my-packages",
    isPrivate: true,
  },
];
const userSettings: Partial<INavElement>[] = [
  {
    label: "Login",
    path: "/login",
    isNotLoguedUser: true,
  },
  {
    label: "Register",
    path: "/register",
    isNotLoguedUser: true,
  },
  {
    label: "Home",
    path: "/home",
    isPrivate: true,
  },
  {
    label: "Products",
    path: "/products",
  },
  {
    label: "My Packages",
    path: "/my-packages",
    isPrivate: true,
  },
  {
    label: "Logout",
    isPrivate: true,
  },
];

const NavBar = () => {
  const { isUserLoggedIn, currentUser, currentRole } = useAuth();

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingsClick = (setting: Partial<INavElement>) => {
    if (setting.label === "Logout") {
      doSignOut().then(() => {
        handleNavigate("/login");
      });
    } else {
      handleNavigate(setting.path || "/");
      setAnchorElUser(null);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          {isUserLoggedIn && (
            <Typography
              variant="h6"
              noWrap
              onClick={() => handleNavigate("/home")}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              HOME
            </Typography>
          )}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => {
                if (!isUserLoggedIn && page.isPrivate) return;
                return (
                  <MenuItem
                    key={page.label}
                    onClick={() => handleNavigate(page.path || "/")}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {page.label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            onClick={() => handleNavigate("/home")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            HOME
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              if (!isUserLoggedIn && page.isPrivate) return;
              return (
                <Button
                  key={page.label}
                  onClick={() => handleNavigate(page.path || "/")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <section style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Typography>
                Role: {currentRole}
              </Typography>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="P" src="/route/to/profile-photo.png" />
                </IconButton>
              </Tooltip>
            </section>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userSettings.map((setting) => {
                if (!isUserLoggedIn && setting.isPrivate) return;
                if (isUserLoggedIn && setting.isNotLoguedUser) return;
                return (
                  <MenuItem
                    key={setting.label}
                    onClick={() => handleSettingsClick(setting)}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
