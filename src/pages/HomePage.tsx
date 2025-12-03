// src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from "react";
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
import {
  type Account,
  type Transaction,
  type QuickAction,
  type MonthRequest,
  type TransactionResponse,
  type UserResponse,
  type AccountsResponse,
  type SpendingInAMonth,
} from "../types/types";
import axios from "axios";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import {
  callSync,
  filterTransactionsByMonth,
  getMonthAbbr,
  getRecentTransactions,
} from "../helpers";

const drawerWidth = 240;

const HomePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] =
    useState<TransactionResponse | null>(null);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [accountsData, setAccountsData] = useState<AccountsResponse | null>(
    null
  );
  const [recentTransactions, setRecentTransactions] = useState<
    Transaction[] | null
  >(null);
  const [postSyncFlag, setPostSyncFlag] = useState(false);
  const [spendingData, setSpendingData] = useState<SpendingInAMonth[] | null>(
    null
  );

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

  const fetchAccounts = async () => {
    setLoading(true);

    try {
      const token = await currentUser?.getIdToken();
      const response = await axios.get<AccountsResponse>(
        `${import.meta.env.VITE_BASE_URL}api/accounts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAccountsData(response.data);
    } catch (err) {
      let errorMessage = "Failed to fetch accounts.";

      if (axios.isAxiosError(err)) {
        // Try to extract a specific error message from the server
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          errorMessage;
      }

      toast.error(errorMessage);
      console.error("Fetch Accounts Error:", err);
      // Set data to null on error
      setAccountsData(null);
    } finally {
      setLoading(false);
    }
  };

  const [totalBalance, setTotalBalance] = useState(0);
  useEffect(() => {
    setTotalBalance(
      accountsData?.accounts.reduce(
        (sum, acc) => sum + parseFloat(acc.currentBalance),
        0
      ) ?? 0
    );
  }, [accountsData]);

  useEffect(() => {
    if (transactionsData) {
      setRecentTransactions(
        getRecentTransactions(transactionsData!.transactions, 6)
      );
    }
    if (userData && transactionsData) {
      if (
        (transactionsData?.transactionCount ?? 0) > 1 &&
        userData.transactionMonths.length > 0
      ) {
        const _spendingData: SpendingInAMonth[] = [];
        userData?.transactionMonths.forEach((month) => {
          const monthIndex = parseInt(month.substring(0, 2));
          const year = parseInt(month.substring(3));
          const transactions = filterTransactionsByMonth(
            transactionsData?.transactions,
            monthIndex,
            year
          );
          const sum = transactions.reduce((sum, tx) => {
            if (tx.amount < 0) {
              return sum + Math.abs(tx.amount);
            }
            return sum;
          }, 0);
          _spendingData.push({
            month: new Date(year, monthIndex, 1),
            spending: sum,
          });
        });
        let max = 0;
        _spendingData.forEach((spendMonth) => {
          if (spendMonth.spending > max) max = spendMonth.spending;
        });
        setMaxSpending(max);
        setSpendingData(_spendingData);
      }
    }
  }, [transactionsData, userData]);

  const [maxSpending, setMaxSpending] = useState<number>(0);

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
        return "#9E9E9E";
      case "total":
        return "#689F38";
      default:
        return "#00695C";
    }
  };

  useEffect(() => {
    if (hasRun.current) {
      return; // Already ran, so exit immediately
    }

    hasRun.current = true;
    callSync(currentUser, setPostSyncFlag);
  }, []);

 
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
              {accountsData &&
                accountsData!.accounts.map((acc) => (
                  <Grid key={acc.accountId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      sx={{
                        bgcolor: getAccountColor(acc.accountType),
                        color: "white",
                        borderRadius: 3,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2">
                          {acc.accountName}
                        </Typography>
                        <Typography variant="caption">
                          *******{acc.plaidMask}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Balance
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {parseFloat(acc.currentBalance) < 0 ? "-" : ""}$
                          {Math.abs(
                            parseFloat(acc.currentBalance)
                          ).toLocaleString()}
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
              {spendingData != null && (
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
                            Maximum Spending: ${maxSpending.toLocaleString("en-us"/*TODO add limit */)}
                          </Typography>
                          {spendingData.some((d) => d.spending > maxSpending) && ( // TODO replace spendingmax with limit
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
                                (maxSpending / maxSpending) * 220, /*TODO add limit */
                              borderTop: "2px dashed rgba(255, 107, 107, 0.5)",
                              zIndex: 0,
                              pointerEvents: "none",
                            }}
                          />

                          {spendingData.map((data, i) => {
                            const barHeight =
                              (data.spending / maxSpending) * 220;
                            const percentage = Math.round(
                              (data.spending / maxSpending) * 100 //TODO add limit
                            );
                            const isOverLimit = data.spending > maxSpending;
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
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
                                        borderLeft: "6px solid transparent",
                                        borderRight: "6px solid transparent",
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
                                  ${maxSpending.toLocaleString("en-us")}
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
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    "&:hover": {
                                      transform: "translateY(-4px) scale(1.05)",
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
                                    {getMonthAbbr(data.month.getMonth())}
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
              )}
              {/* Recent Transactions */} {/* Add pending flag */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Recent Transactions
                    </Typography>
                    {recentTransactions &&
                      recentTransactions.map((t) => (
                        <Box
                          key={t.transactionId}
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
                              <Typography variant="subtitle2">
                                {t.merchantName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t.plaidCategoryPrimary} • {t.transactionDate}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color={
                              t.plaidCategoryPrimary === "credit"
                                ? "success.main"
                                : "text.primary"
                            }
                          >
                            {t.amount < 0 ? "-" : "+"}$
                            {Math.abs(t.amount).toFixed(2)}
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
