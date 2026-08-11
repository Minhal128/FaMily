export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  Transactions: undefined;
  AddMoney: { id?: string } | undefined;
  Expense: undefined;
  AddExpense: { id?: string } | undefined;
  Saving: undefined;
  Budget: undefined;
  Investment: undefined;
  AddInvestment: { id?: string } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Graph: undefined;
  Chat: undefined;
  Profile: undefined;
  Logout: undefined;
};

/** Makes bare `useNavigation()` typed everywhere — no per-screen generics. */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, TabParamList {}
  }
}
