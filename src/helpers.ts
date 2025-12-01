import axios from "axios";
import type { User } from "firebase/auth";
import type { SyncResponse } from "./types/types";
import toast from "react-hot-toast";

export function convertToReadableDate(dateString: string) {
  const [month, year] = dateString.split('/');
  const isoDateString = `${year}-${month}-01`;

  const date = new Date(isoDateString);

  const options = { year: 'numeric', month: 'long' };

  return date.toLocaleDateString('en-US', options);
}

export const callSync = async (currentUser: User | null) => {
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
    };