import { defineStore } from 'pinia';
import Decimal from 'decimal.js';
import { mockUser, mockAccount, mockLoan, mockTransactions } from '../utils/mockData';

export const useAccountStore = defineStore('account', {
  // 'state' is the exact equivalent of your Redux initialState
  state: () => ({
    user: mockUser,
    account: mockAccount,
    loan: mockLoan,
    transactions: mockTransactions,
  }),
  
  // 'actions' are your Redux reducers
  actions: {
    login() {
      this.user = mockUser;
      this.account = mockAccount;
    },
    logout() {
      this.user = null;
      this.account = null;
    },
    // The exact equivalent of your Redux transferFunds slice
    transferFunds({ amount, description, destination }) {
      // Use decimal.js to avoid Javascript floating point math errors
      const currentBalance = new Decimal(this.account.balance);
      const transferAmount = new Decimal(amount);
      
      this.account.balance = currentBalance.minus(transferAmount).toFixed(2);
      
      // Log the new transaction
      this.transactions.unshift({
        id: Date.now(),
        source_account_id: this.account.id,
        destination_account_id: destination,
        amount: `-${transferAmount.toFixed(2)}`,
        type: "transfer",
        status: "completed",
        description: description,
        created_at: new Date().toISOString()
      });
    }
  }
});