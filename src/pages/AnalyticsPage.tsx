/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/AnalyticsPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
// Use MUI Grid v2 (same pattern as HomePage/Settings/Transactions)

import {
  TrendingUp as TrendingUpIcon,
  WarningAmber as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  Send as SendIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import type {
  MonthRequest,
  SpendingInAMonth,
  SpendingInAMonthFormatted,
  TransactionResponse,
  UserResponse,
} from "../types/types";
import axios from "axios";
import toast from "react-hot-toast";
import {
  convertToReadableDate,
  getMonthAbbr,
  groupTransactionsByYearMonthMap,
} from "../helpers";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

// Keep drawerWidth consistent with other pages that use Sidebar
const drawerWidth = 240;

//const monthOptions = Object.keys(categoryData);

const COLORS = [
  "#00786F", // Teal
  "#10B981", // Emerald
  "#60D5C0", // Soft Teal
  "#93E4D8", // Light Teal
  "#CBFBF1", // Pale Teal
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
];

// -------------------- Analytics Page --------------------
const AnalyticsPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(false);

  const [transactionsData, setTransactionsData] =
    useState<TransactionResponse | null>(null);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [transactionMap, setTransactionMap] = useState<Map<any, any> | null>(
    null
  );
  const [spendingData, setSpendingData] = useState<
    SpendingInAMonthFormatted[] | null
  >(null);
  const [categoryData, setCategoryData] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);

  const { currentUser } = useAuth();

  const navigate = useNavigate();

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

  useEffect(() => {
    if (transactionsData?.transactionCount ?? 0 > 0) {
      setTransactionMap(
        groupTransactionsByYearMonthMap(transactionsData!.transactions)
      );
      console.log(
        groupTransactionsByYearMonthMap(transactionsData!.transactions)
      );
      setTotalSpent(
        transactionsData?.transactions
          .filter((t) => t.amount > 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0
      );
    }
  }, [transactionsData]);

  useEffect(() => {
    if (selectedYear && transactionMap) {
      const _spendingData: Array<SpendingInAMonthFormatted> = [];
      Array.from(transactionMap!.get(selectedYear)).forEach(
        ([month, transactions]) => {
          console.log(month);
          const sum = transactions.reduce((sum, tx) => {
            if (tx.amount > 0) {
              return sum + Math.abs(tx.amount);
            }
            return sum;
          }, 0);
          _spendingData.unshift({
            month: getMonthAbbr(parseInt(month)),
            spending: sum,
          });
        }
      );
      setSpendingData(_spendingData);
    }
  }, [transactionMap, selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedMonth && transactionMap) {
      const [month, year] = selectedMonth.split("/");
      const transactions = transactionMap.get(selectedYear)?.get(month) || [];

      const categoryTotals = transactions.reduce((acc, tx) => {
        if (tx.amount > 0) {
          const category = tx.plaidCategoryPrimary || "Uncategorized";
          acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
        }
        return acc;
      }, {});

      console.log(categoryTotals);

      const _categoryData = Object.entries(categoryTotals).map(
        ([category, spending], index) => ({
          name: category,
          value: spending,
          color: COLORS[index % COLORS.length], // Assign color cyclically
        })
      );

      // Optional: Sort by highest spending first
      setCategoryData(_categoryData as any);
    }
  }, [transactionMap, selectedYear, selectedMonth]);

  useEffect(() => {
    if (userData) {
      setSelectedMonth(userData!.transactionMonths.at(0) ?? "");
    }
  }, [userData]);

  // LLM query + response state
  const [llmQuery, setLlmQuery] = useState<string>("");
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [isLoadingLlm, setIsLoadingLlm] = useState<boolean>(false);
  const [llmError, setLlmError] = useState<string>("");

  // Map month name to month number for backend API
  const monthNameToNumber: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  // Call LLM endpoint for financial advice
  const handleLlmQuery = async () => {
    if (!llmQuery.trim()) {
      setLlmError("Please enter a query");
      return;
    }

    setIsLoadingLlm(true);
    setLlmError("");
    setLlmResponse("");

    try {
      // Get Firebase auth token for secured backend
      const token = await currentUser?.getIdToken();

      if (!token) {
        throw new Error("You must be logged in to use this feature");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}api/llm/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: llmQuery,
            month: Number(selectedMonth.split("/")[0]) || 10,
            year: new Date().getFullYear(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Failed to get financial advice");
      }

      const data = await response.json();
      setLlmResponse(data.response || "No response received");
    } catch (error) {
      console.error("Error calling LLM endpoint:", error);
      setLlmError(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your query"
      );
    } finally {
      setIsLoadingLlm(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#F9FAFB",
      }}
    >
      {/* Left navigation sidebar (same component as other pages) */}
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

      {/* Main analytics content area */}
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
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            {/* Page header */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Box
                sx={{
                  bgcolor: "#CBFBF1",
                  p: 1,
                  borderRadius: 2,
                  display: "inline-flex",
                }}
              >
                <MoneyIcon sx={{ color: "#00786F" }} />
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 1.5}}
              >
                <Typography variant="h5" fontWeight={700}>
                  Budget Breakdown
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}
                >
                  Log Out
                </Button>
              </Box>  
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Analyze your spending patterns and get personalized insights
            </Typography>

            {/* Month selector + total spending chip */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* Filters (currently only month filter) */}
                <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                  <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Filter by Month</InputLabel>
                    <Select
                      value={selectedMonth}
                      label="Filter by Month"
                      onChange={(e) => {
                        setSelectedMonth(e.target.value);
                      }}
                    >
                      {userData?.transactionMonths.map((monthStr) => (
                        <MenuItem key={monthStr} value={monthStr}>
                          {convertToReadableDate(monthStr)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                  {transactionMap && (
                    <FormControl sx={{ minWidth: 180 }}>
                      <InputLabel>Filter by Year</InputLabel>
                      <Select
                        value={selectedYear}
                        label="Filter by Year"
                        onChange={(e) => {
                          setSelectedYear(e.target.value);
                        }}
                      >
                        {Array.from(transactionMap!).map(([year, monthMap]) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>

                <Box sx={{ ml: "auto" }}>
                  <Chip
                    sx={{ bgcolor: "white" }}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          Total Spending
                        </Typography>
                        <Typography fontWeight={700}>
                          ${totalSpent.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Top charts: bar (months) + pie (categories) */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Spending by month bar chart */}
              {transactionMap && spendingData && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Spending by Month
                      </Typography>
                      <Box sx={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={spendingData ?? undefined}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#eee"
                            />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: 8,
                                fontSize: 14,
                              }}
                              formatter={(v: number) => [
                                `$${v.toLocaleString()}`,
                                "Spending",
                              ]}
                            />
                            <Bar
                              dataKey="spending"
                              fill="#00786F"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Spending by category pie chart */}
              {categoryData && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Spending by Category —{" "}
                        {convertToReadableDate(selectedMonth)}
                      </Typography>
                      <Box sx={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(props: PieLabelRenderProps) =>
                                `${props.name ?? ""} ${(
                                  (props.percent ?? 0) * 100
                                ).toFixed(0)}%`
                              }
                              outerRadius={65}
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: 8,
                                fontSize: 14,
                              }}
                              formatter={(v: number) =>
                                `$${v.toLocaleString()}`
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Static AI-like insights (predefined per month) */}
            {/*
<Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                AI-Powered Insights — {selectedMonth}
              </Typography>

              <Box
                sx={{
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E5E7EB",
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography>{recs.summary}</Typography>
              </Box>

              <List>
                {recs.insights.map((x, i) => (
                  <ListItem
                    key={i}
                    alignItems="flex-start"
                    sx={{
                      border: "1px solid",
                      borderColor:
                        x.type === "warning"
                          ? "#FED7AA"
                          : x.type === "success"
                          ? "#A7F3D0"
                          : "#BFDBFE",
                      bgcolor:
                        x.type === "warning"
                          ? "#FFF7ED"
                          : x.type === "success"
                          ? "#ECFDF5"
                          : "#EFF6FF",
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            x.type === "warning"
                              ? "#FDBA74"
                              : x.type === "success"
                              ? "#34D399"
                              : "#60A5FA",
                        }}
                      >
                        {x.type === "warning" ? (
                          <WarningIcon />
                        ) : x.type === "success" ? (
                          <CheckCircleIcon />
                        ) : (
                          <TrendingUpIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 14 }}
                      primary={x.text}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
            */}

            {/* Category list with progress bars */}
            {spendingData && categoryData && (
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Category Breakdown — {convertToReadableDate(selectedMonth)}
                  </Typography>

                  <Box sx={{ display: "grid", gap: 1.5 }}>
                    {categoryData.map((cat) => {
                      const pct = totalSpent
                        ? (cat.value / totalSpent) * 100
                        : 0;
                      return (
                        <Box
                          key={cat.name}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 1.5,
                            bgcolor: "#F9FAFB",
                            borderRadius: 2,
                          }}
                        >
                          {/* Color dot for category */}
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: cat.color,
                              flexShrink: 0,
                            }}
                          />
                          {/* Name + progress bar */}
                          <Box sx={{ flex: 1 }}>
                            <Typography fontSize={14} sx={{ mb: 0.5 }}>
                              {cat.name}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={pct}
                              sx={{
                                height: 8,
                                borderRadius: 999,
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: cat.color,
                                },
                              }}
                            />
                          </Box>
                          {/* Percentage + value */}
                          <Box sx={{ textAlign: "right", minWidth: 140 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mr: 1 }}
                            >
                              {pct.toFixed(1)}%
                            </Typography>
                            <Typography fontWeight={600}>
                              ${cat.value.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            )}
            {/* Live LLM-based financial advisor section */}
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#E0E7FF",
                      p: 1,
                      borderRadius: 2,
                      display: "inline-flex",
                    }}
                  >
                    <PsychologyIcon sx={{ color: "#4F46E5" }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    Ask Financial Advisor
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Get personalized financial advice based on your spending data
                  for {selectedMonth}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Ask a question about your finances... (e.g., 'How can I reduce my spending?' or 'What areas should I focus on?')"
                    value={llmQuery}
                    onChange={(e) => setLlmQuery(e.target.value)}
                    disabled={isLoadingLlm}
                    onKeyPress={(e) => {
                      // Allow Enter to submit when not holding Shift
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleLlmQuery();
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={handleLlmQuery}
                  disabled={isLoadingLlm || !llmQuery.trim()}
                  startIcon={
                    isLoadingLlm ? <CircularProgress size={20} /> : <SendIcon />
                  }
                  sx={{
                    bgcolor: "#00786F",
                    "&:hover": { bgcolor: "#005F58" },
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  {isLoadingLlm ? "Getting Advice..." : "Get Advice"}
                </Button>

                {llmError && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {llmError}
                  </Alert>
                )}

                {llmResponse && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      bgcolor: "#F0FDF4",
                      border: "2px solid #86EFAC",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{ mb: 1, color: "#166534" }}
                    >
                      Financial Advisor Response:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-wrap", color: "#15803D" }}
                    >
                      {llmResponse}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AnalyticsPage;
