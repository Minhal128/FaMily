export const colors = {
  primaryLight: '#FF939B',
  primaryDark: '#EF2A39',
  gold: '#D4AF37',
  goldLight: '#F5D77A',
  background: '#F9F9F9',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#8A8A8A',
  success: '#2ECC71',
  danger: '#E74C3C',
  border: '#ECECEC',
};

/** Diagonal brand gradient: top-left pink -> bottom-right red. */
export const brandGradient = [colors.primaryLight, colors.primaryDark] as const;
export const goldGradient = [colors.goldLight, colors.gold] as const;

/** 4px scale: spacing(1) = 4, spacing(4) = 16. */
export const spacing = (n: number) => n * 4;

export const radius = { sm: 8, md: 16, lg: 24, xl: 32, pill: 999 };

export const font = {
  brand: 'Pacifico_400Regular',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

/** ponytail: single const — swap for '$' / '€' if the couple isn't in PK. */
export const currency = 'Rs';

export const money = (n: number) =>
  `${currency} ${Math.round(Math.abs(n)).toLocaleString('en-US')}`;

export const signedMoney = (n: number) => (n < 0 ? `-${money(n)}` : money(n));
