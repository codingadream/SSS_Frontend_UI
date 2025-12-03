import React, { useEffect, useState } from "react";
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
  PriceCheck as PriceCheckIcon,
  CreditCardOff as CreditCardOffIcon,
  LocalActivity as LocalActivityIcon,
  LocalDining as LocalDiningIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingBag as ShoppingBagIcon,
  MedicalInformation as MedicalInformationIcon,
  ContentCut as ContentCutIcon,
  RoomService as RoomServiceIcon,
  Gavel as GavelIcon,
  DirectionsCar as DirectionsCarIcon,
  FlightTakeoff as FlightTakeoffIcon,
  Apartment as ApartmentIcon,
  HelpOutline as HelpOutlineIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import type {
  MonthRequest,
  TransactionResponse,
  UserResponse,
} from "../types/types";
import axios from "axios";
import toast from "react-hot-toast";
import { convertToReadableDate } from "../helpers";

import Sidebar from "../components/Sidebar";

const drawerWidth = 240;

const TransactionsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("all");
  //const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] =
    useState<TransactionResponse | null>(null);
  const [userData, setUserData] = useState<UserResponse | null>(null);


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

  const fetchTransactions = async (month: string | null) => {
    setLoading(true);

    const requestBody: MonthRequest = {
      MonthYear: month,
    };

    try {
      const token = await currentUser?.getIdToken();
      const response = await axios.post<TransactionResponse>(
        `${import.meta.env.VITE_BASE_URL}api/transactions`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactionsData(response.data);
    } catch (err) {
      let errorMessage = "Failed to fetch transactions.";

      if (axios.isAxiosError(err)) {
        // Try to extract a specific error message from the server
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          errorMessage;
      }

      toast.error(errorMessage);
      console.error("Fetch Transactions Error:", err);
      // Set data to null on error
      setTransactionsData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    setLoading(true);

    try {
      const token = await currentUser?.getIdToken();

      const response = await axios.get<UserResponse>(
        `${import.meta.env.VITE_BASE_URL}api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data);
      console.log("Successfully fetched user data.");
    } catch (err) {
      let errorMessage = "Failed to fetch user data.";

      if (axios.isAxiosError(err)) {
        const axiosError = err;

        // Try to extract a specific error message from the server response
        errorMessage =
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          errorMessage;
      } else if (err instanceof Error) {
        // Handle the error from the token guard clause
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      console.error("Fetch User Error:", err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const [totalTransactions, setTotalTransactions] = useState<number | null>(
    null
  );
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchTransactions(null);
    fetchUser();
  }, []);

  //calculations once we have transaction data
  useEffect(() => {
    setTotalTransactions(transactionsData?.transactionCount ?? null);
    setTotalSpent(
      transactionsData?.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0
    );
    setTotalIncome(
      transactionsData?.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0
    );
  }, [transactionsData]);

  const getCategoryIcon = (category: string) => {
    // Standard icon props for consistency
    const iconProps = { sx: { color: "#666" } };

    // Normalize the input category string by removing spaces and converting to uppercase
    // to handle potential variations, although your image uses snake_case which is good.
    const normalizedCategory = category.toUpperCase().replace(/ /g, "_");

    switch (normalizedCategory) {
      case "INCOME":
        return <AttachMoneyIcon {...iconProps} />; // $ symbol
      case "TRANSFER_IN":
      case "TRANSFER_OUT":
        return <SwapHorizIcon {...iconProps} />; // Arrow for movement
      case "LOAN_PAYMENTS":
        return <PriceCheckIcon {...iconProps} />; // Icon suggesting payment/check
      case "BANK_FEES":
        return <CreditCardOffIcon {...iconProps} />; // Card with a cross/off sign
      case "ENTERTAINMENT":
        return <LocalActivityIcon {...iconProps} />; // Ticket icon
      case "FOOD_AND_DRINK":
        return <LocalDiningIcon {...iconProps} />; // Dining/cutlery icon
      case "GENERAL_MERCHANDISE":
        return <ShoppingBagIcon {...iconProps} />; // Shopping bag
      case "HOME_IMPROVEMENT":
        return <HomeIcon {...iconProps} />; // Home icon
      case "MEDICAL":
        return <MedicalInformationIcon {...iconProps} />; // Medical symbol
      case "PERSONAL_CARE":
        return <ContentCutIcon {...iconProps} />; // Scissors (for salons/grooming)
      case "GENERAL_SERVICES":
        return <RoomServiceIcon {...iconProps} />; // Room service bell (general service)
      case "GOVERNMENT_AND_NON_PROFIT":
        return <GavelIcon {...iconProps} />; // Gavel (suggesting authority/legal)
      case "TRANSPORTATION":
        return <DirectionsCarIcon {...iconProps} />; // Car icon
      case "TRAVEL":
        return <FlightTakeoffIcon {...iconProps} />; // Airplane icon
      case "RENT_AND_UTILITIES":
        return <ApartmentIcon {...iconProps} />; // Apartment building

      // Default case for any category not explicitly mapped
      default:
        return <HelpOutlineIcon {...iconProps} />; // Question mark icon for unknown/missing
    }
  };

  const getCategoryColor = (category: string) => {
    if (category === "Income") return "#4CAF50";
    if (category === "Shopping") return "#4CAF50";
    if (category === "Utilities") return "#4CAF50";
    if (category === "Food") return "#4CAF50";
    if (category === "Transportation") return "#4CAF50";
    return "#4CAF50";
  };
  
  

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
            <Sidebar />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
            open
          >
           <Sidebar />
          </Drawer>
        </Box>

        {/* Content area */}
        {!loading ? (
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
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ color: "black" }}
              >
                Transaction History
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, color: "black" }}
              >
                View and manage all your transactions
              </Typography>

              {/* Filters */}
              <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Filter by Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Filter by Month"
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      if (e.target.value != "all")
                        fetchTransactions(e.target.value);
                      else fetchTransactions(null);
                    }}
                  >
                    <MenuItem value={"all"}>All</MenuItem>
                    {userData?.transactionMonths.map((monthStr) => {
                      return (
                        <MenuItem value={monthStr}>
                          {convertToReadableDate(monthStr)}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {/*
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Filter by Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Filter by Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="all">All categories</MenuItem>
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Utilities">Utilities</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Transportation">Transportation</MenuItem>
                  </Select>
                </FormControl>
                */}
              </Box>

              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ borderRadius: 3, bgcolor: "#F1F1F1" }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ color: "black" }}
                      >
                        Total Transactions
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#4CAF50">
                        {totalTransactions}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ borderRadius: 3, bgcolor: "#F1F1F1" }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ color: "black" }}
                      >
                        Total Spent
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="text.primary"
                      >
                        -$
                        {totalSpent.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ borderRadius: 3, bgcolor: "#E8F5E9" }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ color: "black" }}
                      >
                        Total Income
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#4CAF50">
                        +$
                        {totalIncome.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Transactions List */}
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mb: 2, color: "black" }}
              >
                All Transactions
              </Typography>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  {transactionsData?.transactions.map((transaction, index) => (
                    <Box
                      key={transaction.transactionId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 3,
                        py: 2,
                        borderBottom:
                          index < (totalTransactions ?? 0) - 1
                            ? "1px solid #eee"
                            : "none",
                        "&:hover": { bgcolor: "#FAFAFA" },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{ bgcolor: "#F1F1F1", width: 40, height: 40 }}
                        >
                          {getCategoryIcon(transaction.plaidCategoryPrimary)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {transaction.merchantName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transaction.plaidCategoryPrimary} •{" "}
                            {transaction.transactionDate}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: getCategoryColor(
                              transaction.plaidCategoryPrimary
                            ),
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          {transaction.plaidCategoryPrimary}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color={"text.primary"}
                        >
                          {transaction.amount <= 0 ? "+" : "-"}${" "}
                          {/*plaid data reverses signs for some reason*/}
                          {Math.abs(transaction.amount).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )) ?? <div>Not loaded</div>}
                </CardContent>
              </Card>
            </Box>
          </Box>
        ) : (
          <div>loading</div>
        )}
      </Box>
    </Box>
  );
};

export default TransactionsPage;
