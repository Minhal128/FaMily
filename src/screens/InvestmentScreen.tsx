import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EntryRow from '../components/EntryRow';
import GradientBackground from '../components/GradientBackground';
import Header from '../components/Header';
import Screen from '../components/Screen';
import { prettyDate } from '../lib/format';
import { useApp } from '../state/AppContext';
import { colors, font, goldGradient, money, radius, shadow, spacing } from '../theme';

export default function InvestmentScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { investments, totalInvestment } = useApp();

  const sorted = useMemo(
    () => [...investments].sort((a, b) => b.date.localeCompare(a.date)),
    [investments]
  );

  return (
    <View style={styles.flex}>
      <Screen tabBarSpace={false}>
        <Header title="Investments" subtitle={`${money(totalInvestment)} invested`} />

        <View style={styles.summary}>
          <GradientBackground colors={goldGradient} style={styles.summaryInner}>
            <Text style={styles.summaryLabel}>Total invested</Text>
            <Text style={styles.summaryAmount}>{money(totalInvestment)}</Text>
          </GradientBackground>
        </View>

        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing(2.5), paddingBottom: insets.bottom + 96 }}
          ListEmptyComponent={<Text style={styles.empty}>No investments yet.</Text>}
          renderItem={({ item }) => (
            <EntryRow
              icon="trending-up"
              title={item.name}
              subtitle={item.note}
              meta={prettyDate(item.date)}
              amount={money(item.amount)}
              amountColor={colors.gold}
              tint="#FBF3DC"
            />
          )}
        />
      </Screen>

      <Pressable
        onPress={() => navigation.navigate('AddInvestment')}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + spacing(6) },
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
      >
        <GradientBackground colors={goldGradient} style={styles.fabInner}>
          <Feather name="plus" size={18} color={colors.surface} />
          <Text style={styles.fabText}>Add Investment</Text>
        </GradientBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  summary: { borderRadius: radius.lg, overflow: 'hidden', ...shadow },
  summaryInner: { padding: spacing(5) },
  summaryLabel: { fontFamily: font.regular, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  summaryAmount: { fontFamily: font.bold, fontSize: 28, color: colors.surface, marginTop: 2 },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadow,
    shadowOpacity: 0.25,
    elevation: 12,
  },
  fabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(4),
  },
  fabText: { fontFamily: font.semibold, fontSize: 15, color: colors.surface },
});
