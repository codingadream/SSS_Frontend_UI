export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  type: 'checking' | 'savings' | 'total';
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
}

export interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactElement;
  route: string;
}


