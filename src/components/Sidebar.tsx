// src/components/Sidebar.tsx
import React from "react";
import {
  Box,
  Toolbar,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Small helper hook to know which menu item should be active
const useActivePath = () => {
  const { pathname } = useLocation();

  // Returns true if the given path should be considered "active"
  const isActive = (path: string) => {
    // Home: treat /home and / as the same
    if (path === "/home") {
      return pathname === "/home" || pathname === "/";
    }
    // For other pages, simple prefix check is usually enough
    return pathname.startsWith(path);
  };

  return isActive;
};

// Helper to build the common styles for nav items
const navItemSx = (active: boolean) => ({
  borderRadius: 1,
  mx: 1.5,
  transition: "all 0.3s ease",
  bgcolor: active ? "#E0F2F1" : "transparent",
  "& .MuiListItemIcon-root": {
    color: active ? "#00796B" : "inherit",
  },
  "&:hover": {
    bgcolor: "#E0F2F1",
    transform: "translateX(4px)",
    boxShadow: "0 2px 8px rgba(0, 121, 107, 0.15)",
    "& .MuiListItemIcon-root": {
      color: "#00796B",
    },
  },
});

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isActive = useActivePath();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(0, 121, 107, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(77, 182, 172, 0.05) 0%, transparent 50%)",
      }}
    >
      {/* Top brand / logo area */}
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#00796B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 4px 12px rgba(0, 121, 107, 0.3)",
            },
          }}
        >
          <AccountBalanceIcon sx={{ color: "white" }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#00796B", fontWeight: 600 }}>
          Commerce Bank
        </Typography>
      </Toolbar>

      {/* Main navigation section */}
      <Typography
        variant="caption"
        sx={{ px: 2, py: 1, color: "text.secondary", fontWeight: 600 }}
      >
        Menu
      </Typography>
      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActive("/home")}
            sx={navItemSx(isActive("/home"))}
            onClick={() => navigate("/home")}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Transactions */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActive("/transactions")}
            sx={navItemSx(isActive("/transactions"))}
            onClick={() => navigate("/transactions")}
          >
            <ListItemIcon>
              <SwapHorizIcon />
            </ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItemButton>
        </ListItem>

        {/* Analytics */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActive("/analytics")}
            sx={navItemSx(isActive("/analytics"))}
            onClick={() => navigate("/analytics")}
          >
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>

         {/* Settings */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActive("/settings-nav")}
            sx={navItemSx(isActive("/settings-nav"))}
            onClick={() => navigate("/settings-nav")}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>

      </List>

      {/* User info card at the bottom */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <Card
          sx={{
            bgcolor: "#ffffff",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 121, 107, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 16px rgba(0, 121, 107, 0.2)",
              transform: "translateY(-2px)",
              borderColor: "rgba(0, 121, 107, 0.2)",
            },
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: "#00796B",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {currentUser?.email?.[0].toUpperCase() || "J"}
              </Avatar>
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {currentUser?.displayName || "John Doe"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentUser?.email || "john.doe@email.com"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Sidebar;
