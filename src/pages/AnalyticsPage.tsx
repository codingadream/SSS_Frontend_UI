import React, { useMemo, useState } from "react";
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
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // using MUI Grid v2
import {
  TrendingUp as TrendingUpIcon,
  WarningAmber as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  Menu as MenuIcon,
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

import Sidebar from "../components/Sidebar";

const drawerWidth = 240;

// -------------------- Mock data --------------------
import { useAuth } from "../contexts/AuthContext";
// -------------------- Mock data (same as your Figma code) --------------------
const monthlySpendingData = [
  { month: "Jan", amount: 3200 },
  { month: "Feb", amount: 2800 },
  { month: "Mar", amount: 3600 },
  { month: "Apr", amount: 3100 },
  { month: "May", amount: 4200 },
  { month: "Jun", amount: 3800 },
  { month: "Jul", amount: 3500 },
  { month: "Aug", amount: 4100 },
  { month: "Sep", amount: 3900 },
  { month: "Oct", amount: 4500 },
];

const categoryData: Record<string, Array<{ name: string; value: number; color: string }>> = {
  January: [
    { name: "Shopping", value: 1200, color: "#00786F" },
    { name: "Food & Dining", value: 800, color: "#10B981" },
    { name: "Transportation", value: 400, color: "#60D5C0" },
    { name: "Entertainment", value: 500, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  February: [
    { name: "Shopping", value: 900, color: "#00786F" },
    { name: "Food & Dining", value: 750, color: "#10B981" },
    { name: "Transportation", value: 450, color: "#60D5C0" },
    { name: "Entertainment", value: 400, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  March: [
    { name: "Shopping", value: 1500, color: "#00786F" },
    { name: "Food & Dining", value: 900, color: "#10B981" },
    { name: "Transportation", value: 500, color: "#60D5C0" },
    { name: "Entertainment", value: 400, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  April: [
    { name: "Shopping", value: 1100, color: "#00786F" },
    { name: "Food & Dining", value: 850, color: "#10B981" },
    { name: "Transportation", value: 400, color: "#60D5C0" },
    { name: "Entertainment", value: 450, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  May: [
    { name: "Shopping", value: 1600, color: "#00786F" },
    { name: "Food & Dining", value: 1100, color: "#10B981" },
    { name: "Transportation", value: 600, color: "#60D5C0" },
    { name: "Entertainment", value: 600, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  June: [
    { name: "Shopping", value: 1300, color: "#00786F" },
    { name: "Food & Dining", value: 1000, color: "#10B981" },
    { name: "Transportation", value: 550, color: "#60D5C0" },
    { name: "Entertainment", value: 650, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  July: [
    { name: "Shopping", value: 1200, color: "#00786F" },
    { name: "Food & Dining", value: 900, color: "#10B981" },
    { name: "Transportation", value: 500, color: "#60D5C0" },
    { name: "Entertainment", value: 600, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  August: [
    { name: "Shopping", value: 1500, color: "#00786F" },
    { name: "Food & Dining", value: 1050, color: "#10B981" },
    { name: "Transportation", value: 600, color: "#60D5C0" },
    { name: "Entertainment", value: 650, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  September: [
    { name: "Shopping", value: 1400, color: "#00786F" },
    { name: "Food & Dining", value: 1000, color: "#10B981" },
    { name: "Transportation", value: 550, color: "#60D5C0" },
    { name: "Entertainment", value: 650, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
  October: [
    { name: "Shopping", value: 1700, color: "#00786F" },
    { name: "Food & Dining", value: 1150, color: "#10B981" },
    { name: "Transportation", value: 650, color: "#60D5C0" },
    { name: "Entertainment", value: 700, color: "#93E4D8" },
    { name: "Utilities", value: 300, color: "#CBFBF1" },
  ],
};

const recommendations: Record<
  string,
  { summary: string; insights: Array<{ type: "warning" | "success" | "info"; text: string }> }
> = {
  January: {
    summary: "Great start to the year! Your spending is well-balanced across categories.",
    insights: [
      { type: "success", text: "Shopping expenses are reasonable at $1,200, which is 37.5% of total spending." },
      { type: "success", text: "Food & Dining costs are within healthy limits at $800." },
      { type: "info", text: "Consider setting aside more for savings this month." },
    ],
  },
  February: {
    summary: "Excellent work! You reduced spending by 12.5% compared to January.",
    insights: [
      { type: "success", text: "You've successfully cut shopping expenses by $300 from last month." },
      { type: "success", text: "Overall spending trend is downward - keep it up!" },
      { type: "info", text: "Transportation costs increased slightly. Consider carpooling or public transit." },
    ],
  },
  March: {
    summary: "Spending increased this month. Review your shopping habits.",
    insights: [
      { type: "warning", text: "Shopping expenses jumped to $1,500, a 67% increase from February." },
      { type: "warning", text: "Total spending is up 28.6% - highest in Q1." },
      { type: "info", text: "Food & Dining also increased. Try meal prepping to reduce costs." },
    ],
  },
  April: {
    summary: "Back on track! You've reined in spending compared to March.",
    insights: [
      { type: "success", text: "Shopping costs decreased by $400, showing good self-control." },
      { type: "success", text: "Overall spending down 13.9% from last month." },
      { type: "info", text: "Entertainment spending is stable. Consider free activities to reduce further." },
    ],
  },
  May: {
    summary: "Highest spending month so far. Summer activities may be impacting your budget.",
    insights: [
      { type: "warning", text: "Total spending reached $4,200, a 35.5% increase from April." },
      { type: "warning", text: "Shopping and Food & Dining both saw significant increases." },
      { type: "info", text: "Set stricter budget limits for June to compensate." },
    ],
  },
  June: {
    summary: "Spending decreased slightly but remains elevated. Continue monitoring closely.",
    insights: [
      { type: "warning", text: "Still spending $3,800, which is 9.5% below May but 22.6% above April." },
      { type: "info", text: "Entertainment costs are up. Look for free summer events." },
      { type: "success", text: "Shopping expenses dropped by $300 - good progress!" },
    ],
  },
  July: {
    summary: "Good correction! Spending is trending downward again.",
    insights: [
      { type: "success", text: "Reduced spending by 7.9% compared to June." },
      { type: "success", text: "Shopping and Food & Dining both decreased." },
      { type: "info", text: "Keep this momentum going through August." },
    ],
  },
  August: {
    summary: "Spending increased again. Back-to-school season may be affecting your budget.",
    insights: [
      { type: "warning", text: "Total spending up 17.1% to $4,100." },
      { type: "warning", text: "Shopping costs rose $300 from July." },
      { type: "info", text: "Consider bulk buying for better deals on recurring expenses." },
    ],
  },
  September: {
    summary: "Spending stabilized but remains elevated. Focus on consistency.",
    insights: [
      { type: "info", text: "Spending decreased slightly to $3,900, down 4.9% from August." },
      { type: "success", text: "Shopping costs are down $100 - small wins count!" },
      { type: "warning", text: "Still 11.4% above July levels. Aim for further reduction." },
    ],
  },
  October: {
    summary: "Highest spending month of the year. Holiday season approaching - plan accordingly.",
    insights: [
      { type: "warning", text: "Spending reached $4,500, up 15.4% from September." },
      { type: "warning", text: "All categories increased except Utilities." },
      { type: "info", text: "Create a strict holiday budget now to avoid overspending in Nov–Dec." },
    ],
  },
};

const monthOptions = Object.keys(categoryData);

// -------------------- Page --------------------
const AnalyticsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>("October");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const [llmQuery, setLlmQuery] = useState<string>("");
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [isLoadingLlm, setIsLoadingLlm] = useState<boolean>(false);
  const [llmError, setLlmError] = useState<string>("");

  const currentMonthData = categoryData[selectedMonth] || [];
  const recs = recommendations[selectedMonth];
  const totalSpending = useMemo(
    () => currentMonthData.reduce((sum, c) => sum + c.value, 0),
    [currentMonthData]
  );

  // Map month name to month number
  const monthNameToNumber: Record<string, number> = {
    January: 1, February: 2, March: 3, April: 4,
    May: 5, June: 6, July: 7, August: 8,
    September: 9, October: 10, November: 11, December: 12
  };

  // Function to call LLM endpoint
  const handleLlmQuery = async () => {
    if (!llmQuery.trim()) {
      setLlmError("Please enter a query");
      return;
    }

    setIsLoadingLlm(true);
    setLlmError("");
    setLlmResponse("");

    try {
      // Get Firebase auth token
      const token = await currentUser?.getIdToken();
      
      if (!token) {
        throw new Error("You must be logged in to use this feature");
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/llm/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: llmQuery,
          month: monthNameToNumber[selectedMonth] || 10,
          year: 2024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Failed to get financial advice");
      }

      const data = await response.json();
      setLlmResponse(data.response || "No response received");
    } catch (error) {
      console.error("Error calling LLM endpoint:", error);
      setLlmError(error instanceof Error ? error.message : "An error occurred while processing your query");
    } finally {
      setIsLoadingLlm(false);
    }
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
      {/* Top AppBar */}
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
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, color: "text.primary" }}>
            Analytics
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar + main content */}
      <Box sx={{ display: "flex", flexGrow: 1, pt: 8 }}>
        {/* Left nav: uses shared Sidebar component */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
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

          {/* Desktop drawer */}
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

        {/* Main analytics content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            px: { xs: 3, sm: 5, md: 8 },
            py: 4,
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ bgcolor: "#CBFBF1", p: 1, borderRadius: 2, display: "inline-flex" }}>
                <MoneyIcon sx={{ color: "#00786F" }} />
              </Box>
              <Typography variant="h5" fontWeight={700}>
                Budget Breakdown
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Analyze your spending patterns and get personalized insights
            </Typography>

            {/* Controls */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="month-select-label">Select Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    label="Select Month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {monthOptions.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ ml: "auto" }}>
                  <Chip
                    sx={{ bgcolor: "white" }}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          Total Spending
                        </Typography>
                        <Typography fontWeight={700}>
                          ${totalSpending.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Spending by Month
                    </Typography>
                    <Box sx={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlySpendingData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: 8,
                              fontSize: 14,
                            }}
                            formatter={(v: number) => [`$${v.toLocaleString()}`, "Spending"]}
                          />
                          <Bar dataKey="amount" fill="#00786F" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Spending by Category — {selectedMonth}
                    </Typography>
                    <Box sx={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentMonthData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: PieLabelRenderProps) =>
                              `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                            }
                            outerRadius={100}
                            dataKey="value"
                          >
                            {currentMonthData.map((entry, index) => (
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
                            formatter={(v: number) => `$${v.toLocaleString()}`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* AI Insights */}
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

            {/* Category Breakdown */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Category Breakdown — {selectedMonth}
                </Typography>

                <Box sx={{ display: "grid", gap: 1.5 }}>
                  {currentMonthData.map((cat) => {
                    const pct = totalSpending ? (cat.value / totalSpending) * 100 : 0;
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
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: cat.color,
                            flexShrink: 0,
                          }}
                        />
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
                              "& .MuiLinearProgress-bar": { bgcolor: cat.color },
                            }}
                          />
                        </Box>
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
