export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  AddMoney: undefined;
  Expense: undefined;
  AddExpense: undefined;
  Saving: undefined;
  Investment: undefined;
  AddInvestment: undefined;
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
