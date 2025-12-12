// src/pages/TransactionsPage.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
} from "@mui/material";
import {
  SwapHoriz as SwapHorizIcon,
  Settings as SettingsIcon,
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
import { LoadingSpinner } from "../components/LoadingSpinner";

// Fixed sidebar width, same as HomePage and SettingsPageNav
const drawerWidth = 240;

const TransactionsPage: React.FC = () => {
  // UI state
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(false);

  // Data from backend
  const [transactionsData, setTransactionsData] =
    useState<TransactionResponse | null>(null);
  const [userData, setUserData] = useState<UserResponse | null>(null);

  // Total numbers for summary cards
  const [totalTransactions, setTotalTransactions] = useState<number | null>(
    null
  );
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fetch transactions for a specific month (or all months if month is null)
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
        // Try to extract server error message
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          errorMessage;
      }

      console.error("Fetch Transactions Error:", err);
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data (used for month list in the filter)
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
        errorMessage =
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("Fetch User Error:", err);
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  // Initial load: get all transactions + user data
  useEffect(() => {
    fetchTransactions(null);
    fetchUser();
  }, []);

  // Recalculate summary numbers whenever transactions change
  useEffect(() => {
    // Total number of transactions
    setTotalTransactions(transactionsData?.transactionCount ?? null);

    // Total spent: positive amounts
    setTotalSpent(
      transactionsData?.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0
    );

    // Total income: negative amounts (we take absolute value)
    setTotalIncome(
      transactionsData?.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0
    );
  }, [transactionsData]);

  // Map Plaid category to an icon
  const getCategoryIcon = (category: string) => {
    const iconProps = { sx: { color: "#666" } };
    const normalizedCategory = category.toUpperCase().replace(/ /g, "_");

    switch (normalizedCategory) {
      case "INCOME":
        return <AttachMoneyIcon {...iconProps} />;
      case "TRANSFER_IN":
      case "TRANSFER_OUT":
        return <SwapHorizIcon {...iconProps} />;
      case "LOAN_PAYMENTS":
        return <PriceCheckIcon {...iconProps} />;
      case "BANK_FEES":
        return <CreditCardOffIcon {...iconProps} />;
      case "ENTERTAINMENT":
        return <LocalActivityIcon {...iconProps} />;
      case "FOOD_AND_DRINK":
        return <LocalDiningIcon {...iconProps} />;
      case "GENERAL_MERCHANDISE":
        return <ShoppingBagIcon {...iconProps} />;
      case "HOME_IMPROVEMENT":
        return <HomeIcon {...iconProps} />;
      case "MEDICAL":
        return <MedicalInformationIcon {...iconProps} />;
      case "PERSONAL_CARE":
        return <ContentCutIcon {...iconProps} />;
      case "GENERAL_SERVICES":
        return <RoomServiceIcon {...iconProps} />;
      case "GOVERNMENT_AND_NON_PROFIT":
        return <GavelIcon {...iconProps} />;
      case "TRANSPORTATION":
        return <DirectionsCarIcon {...iconProps} />;
      case "TRAVEL":
        return <FlightTakeoffIcon {...iconProps} />;
      case "RENT_AND_UTILITIES":
        return <ApartmentIcon {...iconProps} />;
      default:
        // Fallback icon if category is unknown
        return <HelpOutlineIcon {...iconProps} />;
    }
  };

  // For now all categories use the same color.
  // You can customize this later if you want different colors per category.
  const getCategoryColor = (category: string) => {
    return "#4CAF50";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#F9FAFB",
      }}
    >
      {/* Left sidebar (shared design) */}
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          bgcolor: "#ffffff",
          borderRight: "1px solid #eee",
        }}
      >
        <Sidebar />
      </Box>

      {/* Right main content area */}
      {loading || !transactionsData || !userData ? (
        <LoadingSpinner />
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 3, sm: 5, md: 8 },
            py: 4,
          }}
        >
          <Box sx={{ maxWidth: "1800px", mx: "auto", width: "100%" }}>
            {/* Page header with title and logout button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
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
                  sx={{ mb: 0, color: "black" }}
                >
                  View and manage all your transactions
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}
              >
                Log Out
              </Button>
            </Box>

            {/* Filters (currently only month filter) */}
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Filter by Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Filter by Month"
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    if (e.target.value !== "all") {
                      // Fetch data for the selected month
                      fetchTransactions(e.target.value);
                    } else {
                      // Fetch data for all months
                      fetchTransactions(null);
                    }
                  }}
                >
                  <MenuItem value={"all"}>All</MenuItem>
                  {userData?.transactionMonths.map((monthStr) => (
                    <MenuItem key={monthStr} value={monthStr}>
                      {convertToReadableDate(monthStr)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Summary cards (total transactions, spent, income) */}
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

            {/* Transactions list */}
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
                    {/* Left side: icon + merchant + category/date */}
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

                    {/* Right side: category label + amount */}
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
                        {/* Plaid uses negative values for income, so we adjust the sign */}
                        {transaction.amount <= 0 ? "+" : "-"}${" "}
                        {Math.abs(transaction.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </Box>
                )) ?? <div>Not loaded</div>}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TransactionsPage;
