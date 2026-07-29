import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EntryRow from '../components/EntryRow';
import GradientBackground from '../components/GradientBackground';
import Header from '../components/Header';
import Rise from '../components/Rise';
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

  const largest = investments.reduce((top, i) => Math.max(top, i.amount), 0);

  return (
    <View style={styles.flex}>
      <Screen tabBarSpace={false}>
        <Header title="Investments" subtitle={`${money(totalInvestment)} invested`} />

        <View style={styles.summary}>
          <GradientBackground colors={goldGradient} style={styles.summaryInner}>
            <View style={styles.summaryTop}>
              <View>
                <Text style={styles.summaryLabel}>Total invested</Text>
                <Text style={styles.summaryAmount}>{money(totalInvestment)}</Text>
              </View>
              <View style={styles.summaryBadge}>
                <Feather name="trending-up" size={22} color={colors.surface} />
              </View>
            </View>

            <View style={styles.strip}>
              <View style={styles.stripItem}>
                <Text style={styles.stripLabel}>Holdings</Text>
                <Text style={styles.stripValue}>{sorted.length}</Text>
              </View>
              <View style={styles.stripDivider} />
              <View style={styles.stripItem}>
                <Text style={styles.stripLabel}>Largest</Text>
                <Text style={styles.stripValue}>{money(largest)}</Text>
              </View>
            </View>
          </GradientBackground>
        </View>

        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing(2.5), paddingBottom: insets.bottom + 96 }}
          ListEmptyComponent={<Text style={styles.empty}>No investments yet.</Text>}
          renderItem={({ item, index }) => (
            <Rise index={index}>
              <EntryRow
                icon="trending-up"
                title={item.name}
                subtitle={item.note}
                meta={prettyDate(item.date)}
                amount={money(item.amount)}
                amountColor={colors.gold}
                tint="#FBF3DC"
              />
            </Rise>
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
  summary: { borderRadius: radius.lg, overflow: 'hidden', ...shadow, shadowOpacity: 0.18 },
  summaryInner: { padding: spacing(5), gap: spacing(4) },
  summaryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: font.regular, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  summaryAmount: { fontFamily: font.bold, fontSize: 30, color: colors.surface, marginTop: 2 },
  summaryBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.md,
    padding: spacing(3.5),
  },
  stripItem: { flex: 1, gap: 2 },
  stripDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },
  stripLabel: { fontFamily: font.regular, fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  stripValue: { fontFamily: font.semibold, fontSize: 16, color: colors.surface },
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
