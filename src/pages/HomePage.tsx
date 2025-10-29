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
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import type { Account, Transaction, QuickAction } from "../types/types";

const drawerWidth = 240;

// 模拟账户数据
const mockAccounts: Account[] = [
  { id: "1", name: "Weekly Spending Checking Account", accountNumber: "****4829", balance: -12543.89, type: "checking" },
  { id: "2", name: "Weekly Spending Savings Account", accountNumber: "****7392", balance: -48290.12, type: "savings" },
  { id: "3", name: "Weekly Spending Total", accountNumber: "****1047", balance: -2847.32, type: "total" },
];

// 模拟交易记录
const mockTransactions: Transaction[] = [
  { id: "1", merchant: "Amazon", category: "Shopping", date: "Oct 1, 2025", amount: -156.99, type: "debit" },
  { id: "2", merchant: "Salary Deposit", category: "Income", date: "Oct 1, 2025", amount: 3500.0, type: "credit" },
];

const HomePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const quickActions: QuickAction[] = [
    { id: "1", title: "Analytics", icon: <TrendingUpIcon sx={{ fontSize: 36, color: "#009688" }} />, route: "/analytics" },
    { id: "2", title: "Transactions", icon: <SwapHorizIcon sx={{ fontSize: 36, color: "#4CAF50" }} />, route: "/transactions" },
    { id: "3", title: "Edit Spending Limits", icon: <AddIcon sx={{ fontSize: 36, color: "#FFC107" }} />, route: "/limits" },
  ];

  const getAccountColor = (type: string) => {
    switch (type) {
      case "checking": return "#00695C";
      case "savings": return "#00796B";
      case "total": return "#689F38";
      default: return "#9E9E9E";
    }
  };

  // 侧边栏 Drawer
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: "50%", bgcolor: "#00796B",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <AccountBalanceIcon sx={{ color: "white" }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#00796B", fontWeight: 600 }}>
          Commerce Bank
        </Typography>
      </Toolbar>

      <Divider />
      <Typography variant="caption" sx={{ px: 2, py: 1, color: "text.secondary" }}>Menu</Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton selected sx={{ bgcolor: "#E0F2F1" }}>
            <ListItemIcon><DashboardIcon sx={{ color: "#00796B" }} /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/transactions")}>
            <ListItemIcon><SwapHorizIcon /></ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton><ListItemIcon><TrendingUpIcon /></ListItemIcon><ListItemText primary="Analytics" /></ListItemButton>
        </ListItem>
      </List>

      <Divider />
      <Typography variant="caption" sx={{ px: 2, py: 1, color: "text.secondary" }}>Other</Typography>
      <List>
        <ListItem disablePadding><ListItemButton onClick={() => navigate("/settings")}><ListItemIcon><SettingsIcon /></ListItemIcon><ListItemText primary="Settings" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton><ListItemIcon><HelpIcon /></ListItemIcon><ListItemText primary="Help & Support" /></ListItemButton></ListItem>
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Card sx={{ bgcolor: "#F1F1F1", borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#00796B" }}>{currentUser?.email?.[0].toUpperCase() || "J"}</Avatar>
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight={600}>{currentUser?.displayName || "John Doe"}</Typography>
                <Typography variant="caption" color="text.secondary">{currentUser?.email || "john.doe@email.com"}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#F9FAFB",
      }}
    >
      {/* 顶部 AppBar */}
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
  
      {/* 主体区域（Drawer + Content） */}
      <Box sx={{ display: "flex", flexGrow: 1, pt: 8 }}>
        {/* 左侧导航 */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
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
  
        {/* 主内容 */}
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
              <Typography variant="body2" color="text.secondary">
                Total Balance
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h3" fontWeight={700}>
                  ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Typography>
                <VisibilityIcon sx={{ color: "text.secondary" }} />
              </Box>
            </Box>
  
            {/* Accounts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {mockAccounts.map((acc) => (
                <Grid size={{xs:12, sm:6, md:4}}>
                  <Card
                    sx={{
                      bgcolor: getAccountColor(acc.type),
                      color: "white",
                      borderRadius: 3,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle2">{acc.name}</Typography>
                      <Typography variant="caption">{acc.accountNumber}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Balance
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {acc.balance < 0 ? "-" : ""}${Math.abs(acc.balance).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
  
            {/* Quick Actions */}
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {quickActions.map((action) => (
                <Grid size={{xs:12, sm:4} }>
                  <Card
                    sx={{
                      textAlign: "center",
                      py: 4,
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": { boxShadow: 5, transform: "translateY(-4px)" },
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
              <Grid size={{xs:12, md:6} }>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Spending Overview
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, height: 200 }}>
                      {[{ h: "60%" }, { h: "45%" }, { h: "80%" }].map((b, i) => (
                        <Box key={i} sx={{ flex: 1, textAlign: "center" }}>
                          <Box
                            sx={{
                              height: b.h,
                              bgcolor: i === 2 ? "#00796B" : "#4DB6AC",
                              borderRadius: 1,
                              mb: 1,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ${[600, 450, 500][i]}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
  
              <Grid size={{xs:12, md:6}} >
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
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: "#F1F1F1" }}>
                            <ShoppingCartIcon sx={{ color: "#666" }} />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{t.merchant}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t.category} • {t.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          color={t.type === "credit" ? "success.main" : "text.primary"}
                        >
                          {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
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
