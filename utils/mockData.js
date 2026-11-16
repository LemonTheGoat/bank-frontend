export const mockUser = {
  id: 1,
  first_name: "Liam",
  last_name: "Salcedo",
  email: "liam@bank.local",
  phone_number: "+639123456789"
};

export const mockAccount = {
  id: 101,
  user_id: 1,
  account_number: "PH-8820-1092-44",
  account_type: "savings",
  balance: "24500.00",
  status: "active"
};

export const mockLoan = {
  id: 301,
  user_id: 1,
  account_id: 101,
  loan_amount: "50000.00",
  interest_rate: "5.50",
  term_months: 12,
  remaining_balance: "32450.00",
  status: "active"
};

export const mockTransactions = [
  {
    id: 1001,
    source_account_id: null,
    destination_account_id: 101,
    amount: "10000.00",
    type: "deposit",
    status: "completed",
    description: "Over-the-counter Cash Deposit",
    created_at: "2026-10-11T14:15:00Z"
  },
  {
    id: 1002,
    source_account_id: 101,
    destination_account_id: 999,
    amount: "-1500.00",
    type: "transfer",
    status: "completed",
    description: "Transfer to Juan Dela Cruz",
    created_at: "2026-10-12T08:30:00Z"
  },
  {
    id: 1003,
    source_account_id: 101,
    destination_account_id: null,
    amount: "-4500.00",
    type: "loan_repayment",
    status: "completed",
    description: "Monthly Loan Amortization Auto-Debit",
    created_at: "2026-10-13T09:00:00Z"
  }
];

export const customers = [
  {
    id: 1,
    name: "Liam Salcedo",
    accountNumber: "PH-8820-1092-44",
    balance: "24500.00",
    status: "Active"
  },
  {
    id: 2,
    name: "Maria Santos",
    accountNumber: "PH-4417-0356-18",
    balance: "86200.50",
    status: "Active"
  },
  {
    id: 3,
    name: "Juan Dela Cruz",
    accountNumber: "PH-2239-7741-03",
    balance: "3150.75",
    status: "Frozen"
  },
  {
    id: 4,
    name: "Ana Reyes",
    accountNumber: "PH-6605-2284-97",
    balance: "512340.00",
    status: "Active"
  }
];

export const pendingApprovals = [
  {
    id: 1,
    customerName: "Maria Santos",
    type: "Loan",
    amount: "250000.00",
    status: "Pending"
  },
  {
    id: 2,
    customerName: "Ana Reyes",
    type: "High-Value Transfer",
    amount: "120000.00",
    status: "Pending"
  },
  {
    id: 3,
    customerName: "Liam Salcedo",
    type: "High-Value Transfer",
    amount: "75000.00",
    status: "Pending"
  }
];