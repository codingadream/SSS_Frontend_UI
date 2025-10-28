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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../types/types";

const drawerWidth = 240;

// Mock transaction data
const mockTransactions: Transaction[] = [
  { id: "1", merchant: "Freelance Payment", category: "Income", date: "Oct 8, 2025 • 11:22 AM", amount: 1235.05, type: "credit" },
  { id: "2", merchant: "Target", category: "Shopping", date: "Oct 8, 2025 • 04:13 PM", amount: -172.05, type: "debit" },
  { id: "3", merchant: "Electric Bill", category: "Utilities", date: "Oct 8, 2025 • 07:49 PM", amount: -17.41, type: "debit" },
  { id: "4", merchant: "Salary Deposit", category: "Income", date: "Oct 7, 2025 • 06:09 PM", amount: 3500.0, type: "credit" },
  { id: "5", merchant: "Amazon", category: "Shopping", date: "Oct 7, 2025 • 10:15 AM", amount: -156.99, type: "debit" },
  { id: "6", merchant: "Grocery Store", category: "Food", date: "Oct 6, 2025 • 03:30 PM", amount: -87.23, type: "debit" },
  { id: "7", merchant: "Online Income", category: "Income", date: "Oct 6, 2025 • 09:00 AM", amount: 450.0, type: "credit" },
  { id: "8", merchant: "Gas Station", category: "Transportation", date: "Oct 5, 2025 • 05:45 PM", amount: -45.67, type: "debit" },
];

const TransactionsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const totalTransactions = mockTransactions.length;
  const totalSpent = mockTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = mockTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);

  const getCategoryIcon = (category: string) => {
    const iconProps = { sx: { color: "#666" } };
    if (category === "Income") return <AttachMoneyIcon {...iconProps} />;
    if (category === "Shopping") return <ShoppingCartIcon {...iconProps} />;
    if (category === "Utilities") return <HomeIcon {...iconProps} />;
    return <ShoppingCartIcon {...iconProps} />;
  };

  const getCategoryColor = (category: string) => {
    if (category === "Income") return "#4CAF50";
    if (category === "Shopping") return "#4CAF50";
    if (category === "Utilities") return "#4CAF50";
    if (category === "Food") return "#4CAF50";
    if (category === "Transportation") return "#4CAF50";
    return "#4CAF50";
  };

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
          <ListItemButton onClick={() => navigate("/home")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected sx={{ bgcolor: "#E0F2F1" }}>
            <ListItemIcon><SwapHorizIcon sx={{ color: "#00796B" }} /></ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><TrendingUpIcon /></ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      <Typography variant="caption" sx={{ px: 2, py: 1, color: "text.secondary" }}>Other</Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton><ListItemIcon><SettingsIcon /></ListItemIcon><ListItemText primary="Settings" /></ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton><ListItemIcon><HelpIcon /></ListItemIcon><ListItemText primary="Help & Support" /></ListItemButton>
        </ListItem>
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
            Transaction History
          </Typography>
          <IconButton onClick={handleLogout} sx={{ color: "#00796B" }}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ display: "flex", flexGrow: 1, pt: 8 }}>
        {/* Drawer */}
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

        {/* Content area */}
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
            {/* Header */}
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Transaction History
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              View and manage all your transactions
            </Typography>

            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Filter by Month</InputLabel>
                <Select value={selectedMonth} label="Filter by Month" onChange={(e) => setSelectedMonth(e.target.value)}>
                  <MenuItem value="all">All months</MenuItem>
                  <MenuItem value="oct">October 2025</MenuItem>
                  <MenuItem value="sep">September 2025</MenuItem>
                  <MenuItem value="aug">August 2025</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Filter by Category</InputLabel>
                <Select value={selectedCategory} label="Filter by Category" onChange={(e) => setSelectedCategory(e.target.value)}>
                  <MenuItem value="all">All categories</MenuItem>
                  <MenuItem value="Income">Income</MenuItem>
                  <MenuItem value="Shopping">Shopping</MenuItem>
                  <MenuItem value="Utilities">Utilities</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Transportation">Transportation</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{xs:12, md:4}}>
                <Card sx={{ borderRadius: 3, bgcolor: "#F1F1F1" }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Transactions
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="#4CAF50">
                      {totalTransactions}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{xs:12, md:4}}>
                <Card sx={{ borderRadius: 3, bgcolor: "#F1F1F1" }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Spent
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                      -${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{xs:12, md:4}}>
                <Card sx={{ borderRadius: 3, bgcolor: "#E8F5E9" }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Income
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="#4CAF50">
                      +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Transactions List */}
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              All Transactions
            </Typography>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 0 }}>
                {mockTransactions.map((transaction, index) => (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 3,
                      py: 2,
                      borderBottom: index < mockTransactions.length - 1 ? "1px solid #eee" : "none",
                      "&:hover": { bgcolor: "#FAFAFA" },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "#F1F1F1", width: 40, height: 40 }}>
                        {getCategoryIcon(transaction.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {transaction.merchant}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.category} • {transaction.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: getCategoryColor(transaction.category),
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {transaction.category}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color={transaction.type === "credit" ? "success.main" : "text.primary"}
                      >
                        {transaction.amount >= 0 ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionsPage;

