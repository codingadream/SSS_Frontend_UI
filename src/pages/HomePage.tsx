// src/pages/HomePage.tsx
import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountBalance as AccountBalanceIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import type { Account, Transaction, QuickAction } from "../types/types";

const drawerWidth = 240;

// mock accounts
const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Weekly Spending Checking Account",
    accountNumber: "****4829",
    balance: -12543.89,
    type: "checking",
  },
  {
    id: "2",
    name: "Weekly Spending Savings Account",
    accountNumber: "****7392",
    balance: -48290.12,
    type: "savings",
  },
  {
    id: "3",
    name: "Weekly Spending Total",
    accountNumber: "****1047",
    balance: -2847.32,
    type: "total",
  },
];

// mock transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    merchant: "Amazon",
    category: "Shopping",
    date: "Oct 1, 2025",
    amount: -156.99,
    type: "debit",
  },
  {
    id: "2",
    merchant: "Salary Deposit",
    category: "Income",
    date: "Oct 1, 2025",
    amount: 3500.0,
    type: "credit",
  },
];

const HomePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // spending overview data
  const spendingData = [
    { month: "Jul", spending: 3200, limit: 5000 },
    { month: "Aug", spending: 4100, limit: 5000 },
    { month: "Sep", spending: 3800, limit: 5000 },
    { month: "Oct", spending: 2850, limit: 5000 },
  ];

  const maxSpending = Math.max(...spendingData.map((d) => d.spending), 5000);

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Analytics",
      icon: <TrendingUpIcon sx={{ fontSize: 36, color: "#009688" }} />,
      route: "/analytics",
    },
    {
      id: "2",
      title: "Transactions",
      icon: <SwapHorizIcon sx={{ fontSize: 36, color: "#4CAF50" }} />,
      route: "/transactions",
    },
    {
      id: "3",
      title: "Edit Spending Limits",
      icon: <AddIcon sx={{ fontSize: 36, color: "#FFC107" }} />,
      route: "/limits",
    },
  ];

  const getAccountColor = (type: string) => {
    switch (type) {
      case "checking":
        return "#00695C";
      case "savings":
        return "#00796B";
      case "total":
        return "#689F38";
      default:
        return "#9E9E9E";
    }
  };

  // ----- Drawer -----
  const drawer = (
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

      <Divider />
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
            selected
            sx={{
              bgcolor: "#E0F2F1",
              borderRadius: 1,
              mx: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#B2DFDB",
                transform: "translateX(4px)",
                boxShadow: "0 2px 8px rgba(0, 121, 107, 0.15)",
              },
              "&.Mui-selected": {
                bgcolor: "#E0F2F1",
                "&:hover": {
                  bgcolor: "#B2DFDB",
                },
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ color: "#00796B" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Transactions */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/transactions")}
            sx={{
              borderRadius: 1,
              mx: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#E0F2F1",
                transform: "translateX(4px)",
                boxShadow: "0 2px 8px rgba(0, 121, 107, 0.15)",
                "& .MuiListItemIcon-root": {
                  color: "#00796B",
                },
              },
            }}
          >
            <ListItemIcon>
              <SwapHorizIcon />
            </ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItemButton>
        </ListItem>

        {/* Analytics → /analytics */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/analytics")}
            sx={{
              borderRadius: 1,
              mx: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#E0F2F1",
                transform: "translateX(4px)",
                boxShadow: "0 2px 8px rgba(0, 121, 107, 0.15)",
                "& .MuiListItemIcon-root": {
                  color: "#00796B",
                },
              },
            }}
          >
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      <Typography
        variant="caption"
        sx={{ px: 2, py: 1, color: "text.secondary", fontWeight: 600 }}
      >
        Other
      </Typography>
      <List>
        {/* Settings (single, styled, routed) */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings-nav")}
            sx={{
              borderRadius: 1,
              mx: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#E0F2F1",
                transform: "translateX(4px)",
                boxShadow: "0 2px 8px rgba(0, 121, 107, 0.15)",
                "& .MuiListItemIcon-root": {
                  color: "#00796B",
                },
              },
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>

        {/* Help & Support (kept once) */}
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 1,
              mx: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#E0F2F1",
                transform: "translateX(4px)",
                boxShadow: "0 2px 8px rgba(0, 121, 107, 0.15)",
                "& .MuiListItemIcon-root": {
                  color: "#00796B",
                },
              },
            }}
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* User card at bottom */}
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

  // ----- Main layout -----
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#F9FAFB",
      }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "text.primary" }}>
            Welcome back, {currentUser?.displayName?.split(" ")[0] || "John"}
          </Typography>
          <IconButton onClick={handleLogout} sx={{ color: "#00796B" }}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer + content */}
      <Box sx={{ display: "flex", flexGrow: 1, pt: 8 }}>
        {/* Left nav */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            px: { xs: 3, sm: 5, md: 8 },
            py: 4,
          }}
        >
          <Box sx={{ maxWidth: "1800px", mx: "auto", width: "100%" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Here's what's happening with your accounts today
            </Typography>

            {/* Total Balance */}
            <Box sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: "black" }}>
                Total Balance
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "black" }}
                >
                  $
                  {totalBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
                <VisibilityIcon sx={{ color: "text.secondary" }} />
              </Box>
            </Box>

            {/* Accounts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {mockAccounts.map((acc) => (
                <Grid key={acc.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      bgcolor: getAccountColor(acc.type),
                      color: "white",
                      borderRadius: 3,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle2">{acc.name}</Typography>
                      <Typography variant="caption">
                        {acc.accountNumber}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Balance
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {acc.balance < 0 ? "-" : ""}$
                        {Math.abs(acc.balance).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Quick Actions */}
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ color: "black" }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {quickActions.map((action) => (
                <Grid key={action.id} size={{ xs: 12, sm: 4 }}>
                  <Card
                    onClick={() => navigate(action.route)}
                    sx={{
                      textAlign: "center",
                      py: 4,
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": {
                        boxShadow: 5,
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 1 }}>{action.icon}</Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {action.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Bottom Section */}
            <Grid container spacing={3}>
              {/* Spending Overview */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3,
                      }}
                    >
                      <BarChartIcon sx={{ color: "#00796B", fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Spending Overview
                      </Typography>
                    </Box>

                    {/* chart */}
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "10px",
                            color: "text.secondary",
                          }}
                        >
                          Monthly Limit: $5,000
                        </Typography>
                        {spendingData.some(
                          (d) => d.spending > d.limit
                        ) && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "10px",
                              color: "#E57373",
                              fontWeight: 600,
                            }}
                          >
                            Over Limit Detected
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-end",
                          gap: 3,
                          height: 220,
                          position: "relative",
                          pb: 4,
                          borderBottom: "2px solid #eee",
                          mb: 2,
                        }}
                      >
                        {/* limit line */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height:
                              (spendingData[0].limit / maxSpending) * 220,
                            borderTop:
                              "2px dashed rgba(255, 107, 107, 0.5)",
                            zIndex: 0,
                            pointerEvents: "none",
                          }}
                        />

                        {spendingData.map((data, i) => {
                          const barHeight =
                            (data.spending / maxSpending) * 220;
                          const percentage = Math.round(
                            (data.spending / data.limit) * 100
                          );
                          const isOverLimit = data.spending > data.limit;
                          const barColor = isOverLimit
                            ? "#E57373"
                            : percentage > 80
                            ? "#FFB74D"
                            : "#4DB6AC";

                          return (
                            <Box
                              key={i}
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                height: "100%",
                                position: "relative",
                                zIndex: 2,
                              }}
                            >
                              {hoveredBar === i && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    bottom: barHeight + 50,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    bgcolor: "#333",
                                    color: "white",
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1,
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    zIndex: 20,
                                    boxShadow:
                                      "0 4px 12px rgba(0,0,0,0.15)",
                                    mb: 1,
                                    textAlign: "center",
                                    minWidth: 100,
                                    "&::after": {
                                      content: '""',
                                      position: "absolute",
                                      bottom: -6,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      width: 0,
                                      height: 0,
                                      borderLeft:
                                        "6px solid transparent",
                                      borderRight:
                                        "6px solid transparent",
                                      borderTop: "6px solid #333",
                                    },
                                  }}
                                >
                                  <Box
                                    component="div"
                                    sx={{
                                      display: "block",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    ${data.spending.toLocaleString()}
                                  </Box>
                                  <Box
                                    component="div"
                                    sx={{
                                      fontSize: "10px",
                                      opacity: 0.9,
                                      mt: 0.25,
                                    }}
                                  >
                                    {percentage}% of limit
                                  </Box>
                                </Box>
                              )}

                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  mb: 0.5,
                                  color: isOverLimit
                                    ? "#E57373"
                                    : percentage > 80
                                    ? "#FFB74D"
                                    : barColor,
                                }}
                              >
                                ${Math.round(data.spending / 100) / 10}K
                              </Typography>

                              <Box
                                sx={{
                                  width: "100%",
                                  minHeight: 8,
                                  height: `${barHeight}px`,
                                  bgcolor: barColor,
                                  borderRadius: "8px 8px 0 0",
                                  position: "relative",
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                  boxShadow:
                                    "0 2px 6px rgba(0,0,0,0.1)",
                                  "&:hover": {
                                    transform:
                                      "translateY(-4px) scale(1.05)",
                                    boxShadow: `0 8px 20px ${barColor}60`,
                                  },
                                }}
                                onMouseEnter={() => setHoveredBar(i)}
                                onMouseLeave={() => setHoveredBar(null)}
                              />

                              <Box
                                sx={{
                                  mt: 1.5,
                                  textAlign: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    display: "block",
                                    color: "text.primary",
                                    fontSize: "12px",
                                    mb: 0.25,
                                  }}
                                >
                                  {data.month}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "10px",
                                    color: isOverLimit
                                      ? "#E57373"
                                      : percentage > 80
                                      ? "#FFB74D"
                                      : "text.secondary",
                                    fontWeight: 600,
                                  }}
                                >
                                  {percentage}%
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>

                      {/* legend */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "center",
                          flexWrap: "wrap",
                          mt: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              bgcolor: "#4DB6AC",
                              borderRadius: "4px",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "11px",
                              color: "text.secondary",
                            }}
                          >
                            Normal
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              bgcolor: "#FFB74D",
                              borderRadius: "4px",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "11px",
                              color: "text.secondary",
                            }}
                          >
                            Warning (80%+)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              bgcolor: "#E57373",
                              borderRadius: "4px",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "11px",
                              color: "text.secondary",
                            }}
                          >
                            Over Limit
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Transactions */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Recent Transactions
                    </Typography>
                    {mockTransactions.map((t) => (
                      <Box
                        key={t.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.5,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Avatar sx={{ bgcolor: "#F1F1F1" }}>
                            <ShoppingCartIcon sx={{ color: "#666" }} />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {t.merchant}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t.category} • {t.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          color={
                            t.type === "credit"
                              ? "success.main"
                              : "text.primary"
                          }
                        >
                          {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(
                            2
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;