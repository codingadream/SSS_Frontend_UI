import axios from "axios";
import type { User } from "firebase/auth";
import type { SyncResponse } from "./types/types";
import toast from "react-hot-toast";

export function convertToReadableDate(dateString: string) {
  const [month, year] = dateString.split("/");
  const isoDateString = `${year}-${month}-01`;

  const date = new Date(Number(year), Number(month) - 1);

  const options = { year: "numeric", month: "long" };

  return date.toLocaleDateString("en-US", options);
}

export const callSync = async (
  currentUser: User | null,
  setPostSyncFlag?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const token = await currentUser?.getIdToken();
    const response = await axios.get<SyncResponse>(
      `${import.meta.env.VITE_BASE_URL}api/sync`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // --- SUCCESS TOAST ---
    toast.success(
      response.data.message || "Data from Plaid synced successfully!",
      {
        duration: 3000,
      }
    );
  } catch (err) {
    // --- FAILURE TOAST ---
    let errorMessage = "Synchronization failed due to a network error.";

    if (axios.isAxiosError(err)) {
      const serverMessage = (err.response?.data as any)?.message;
      if (serverMessage) {
        errorMessage = serverMessage;
      } else if (err.message) {
        errorMessage = `Request failed: ${err.message}`;
      }
    }

    toast.error(`Sync Failed: ${errorMessage}`, {
      duration: 3000,
    });

    console.error("API Sync Error:", errorMessage);
  }
  if (setPostSyncFlag) setPostSyncFlag(true);
};

export const filterTransactionsByMonth = (transactions, monthIndex, year) => {
  return transactions.filter((tx) => {
    const date = new Date(tx.transactionDate);
    return (
      date.getMonth() + 1 === parseInt(monthIndex) &&
      date.getFullYear() === parseInt(year)
    );
  });
};

export const groupTransactionsByYearMonthMap = (transactions) => {
  const map = new Map();

  for (const tx of transactions) {
    const date = new Date(tx.transactionDate);

    // Skip invalid dates
    if (isNaN(date.getTime())) continue;

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // 1. Handle the Year Map
    if (!map.has(year)) {
      map.set(year, new Map());
    }
    const yearMap = map.get(year);

    // 2. Handle the Month Array
    if (!yearMap.has(month)) {
      yearMap.set(month, []);
    }

    // 3. Add the transaction
    yearMap.get(month).push(tx);
  }

  const sortedMap = new Map();

  // 1. Get all years and sort them
  const years = Array.from(map.keys()).sort((a, b) => {
    return b - a;
  });

  for (const year of years) {
    const unsortedMonths = map.get(year);
    const sortedMonths = new Map();

    // 2. Get all months for this year and sort them
    const months = Array.from(unsortedMonths.keys()).sort((a, b) => {
      // Compare strings "01", "10", etc.
      return b.localeCompare(a);
    });

    // 3. Re-insert months into the new inner Map in sorted order
    for (const month of months) {
      // Optional: You can also sort the specific transactions array here if needed
      // const txList = unsortedMonths.get(month).sort(...)
      sortedMonths.set(month, unsortedMonths.get(month));
    }

    // 4. Insert the sorted year entry into the main Map
    sortedMap.set(year, sortedMonths);
  }

  return sortedMap;
};

export const getRecentTransactions = (transactions, limit) => {
  // Create a copy using [...transactions] to avoid mutating original array
  const sorted = [...transactions].sort((a, b) => {
    return new Date(b.transactionDate) - new Date(a.transactionDate);
  });
  return sorted.slice(0, limit);
};

export const getMonthAbbr = (monthIndex) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthIndex - 1];
};