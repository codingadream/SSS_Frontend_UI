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

export interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactElement;
  route: string;
}


