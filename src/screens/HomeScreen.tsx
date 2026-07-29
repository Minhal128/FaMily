import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import GradientBackground from '../components/GradientBackground';
import Screen from '../components/Screen';
import Wordmark from '../components/Wordmark';
import { cardNumber } from '../mock';
import { useApp } from '../state/AppContext';
import { colors, font, goldGradient, money, radius, shadow, spacing } from '../theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profile, balance, totalInvestment, months } = useApp();

  const thisMonth = months[months.length - 1];

  return (
    <Screen scroll>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.name}>{profile.name}</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={styles.avatar}
          accessibilityLabel="Switch profile"
        >
          <Text style={styles.avatarText}>{profile.initials}</Text>
          <View style={styles.avatarBadge}>
            <Feather name="repeat" size={9} color={colors.surface} />
          </View>
        </Pressable>
      </View>

      {/* Debit card */}
      <View style={styles.debitCard}>
        <GradientBackground style={styles.debitInner}>
          <View style={styles.debitTop}>
            <View style={styles.chip}>
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
            </View>
            <Wordmark size={22} />
          </View>

          <View>
            <Text style={styles.debitLabel}>Total Balance</Text>
            <Text style={styles.debitAmount}>{money(balance)}</Text>
          </View>

          <View style={styles.debitBottom}>
            <Text style={styles.debitNumber}>{cardNumber}</Text>
            <Feather name="wifi" size={18} color="rgba(255,255,255,0.8)" />
          </View>
        </GradientBackground>
      </View>

      {/* Investment card */}
      <View style={styles.goldCard}>
        <GradientBackground colors={goldGradient} style={styles.goldInner}>
          <View style={styles.goldRow}>
            <View>
              <Text style={styles.goldLabel}>Investments</Text>
              <Text style={styles.goldAmount}>{money(totalInvestment)}</Text>
            </View>
            <Feather name="trending-up" size={26} color="rgba(255,255,255,0.9)" />
          </View>
          <Button
            title="+ Add Investment"
            variant="light"
            onPress={() => navigation.navigate('Investment')}
            style={styles.goldButton}
          />
        </GradientBackground>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Add Money"
          onPress={() => navigation.navigate('AddMoney')}
          icon={<Feather name="plus-circle" size={17} color={colors.surface} />}
          style={styles.action}
        />
        <Button
          title="Saving"
          variant="light"
          onPress={() => navigation.navigate('Saving')}
          icon={<Feather name="dollar-sign" size={17} color={colors.success} />}
          style={styles.action}
        />
      </View>

      {/* Expenses entry point */}
      <Pressable onPress={() => navigation.navigate('Expense')}>
        <Card style={styles.expenseCard}>
          <View style={styles.expenseIcon}>
            <Feather name="shopping-bag" size={18} color={colors.danger} />
          </View>
          <View style={styles.expenseText}>
            <Text style={styles.expenseTitle}>Expenses</Text>
            <Text style={styles.expenseSub}>
              {thisMonth ? `${thisMonth.label} · ${money(thisMonth.expense)} spent` : 'Nothing yet'}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.muted} />
        </Card>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontFamily: font.regular, fontSize: 13, color: colors.muted },
  name: { fontFamily: font.bold, fontSize: 22, color: colors.text },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: font.semibold, fontSize: 17, color: colors.surface },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  debitCard: { borderRadius: radius.lg, overflow: 'hidden', ...shadow, shadowOpacity: 0.18 },
  debitInner: { aspectRatio: 1.62, padding: spacing(5), justifyContent: 'space-between' },
  debitTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: {
    width: 36,
    height: 27,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 5,
    justifyContent: 'space-around',
  },
  chipLine: { height: 2, borderRadius: 1, backgroundColor: 'rgba(239,42,57,0.35)' },
  debitLabel: { fontFamily: font.regular, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  debitAmount: { fontFamily: font.bold, fontSize: 32, color: colors.surface, marginTop: 2 },
  debitBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  debitNumber: {
    fontFamily: font.medium,
    fontSize: 15,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.95)',
  },

  goldCard: { borderRadius: radius.lg, overflow: 'hidden', ...shadow },
  goldInner: { padding: spacing(5), gap: spacing(4) },
  goldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goldLabel: { fontFamily: font.regular, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  goldAmount: { fontFamily: font.bold, fontSize: 24, color: colors.surface, marginTop: 2 },
  goldButton: { alignSelf: 'flex-start', minWidth: 170 },

  actions: { flexDirection: 'row', gap: spacing(3) },
  action: { flex: 1 },

  expenseCard: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseText: { flex: 1 },
  expenseTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  expenseSub: { fontFamily: font.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
});
