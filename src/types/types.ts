export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  type: 'checking' | 'savings' | 'total';
}

export interface Transaction {
    transactionId: number;
    plaidTransactionId: string;
    plaidCategoryPrimary: string;
    plaidCategoryDetailed: string;
    plaidCategoryConfidenceLevel: string;
    isPending: boolean;
    amount: number;
    transactionDate: string; // Treat as string for simplicity, convert to Date as needed
    merchantName: string;
    description: string;
}

export interface TransactionResponse {
    transactionCount: number;
    transactions: Transaction[];
}

export interface Account {
    accountId: number;
    accountType: string;
    accountName: string;
    currentBalance: string;
    plaidMask: string;
}

export interface AccountsResponse {
    accounts: Account[];
}

export interface MonthRequest {
    MonthYear: string | null;
}

export interface UserResponse {
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  lastSyncTime: string;
  transactionMonths: string[];
}


export interface SyncResponse {
  message: string;
  status: "success" | "failure";
}

export interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactElement;
  route: string;
}


