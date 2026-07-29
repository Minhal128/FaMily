import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import Screen from '../components/Screen';
import { profiles } from '../mock';
import { useApp } from '../state/AppContext';
import { colors, font, money, radius, spacing } from '../theme';

export default function SwitchProfileScreen() {
  const { profileId, setProfileId, profile, balance, totalExpense, totalInvestment } = useApp();

  return (
    <Screen scroll>
      <Header title="Switch profile" subtitle="Whose entries you're looking at" back={false} />

      <View style={styles.banner}>
        <Feather name="eye" size={15} color={colors.primaryDark} />
        <Text style={styles.bannerText}>
          Viewing <Text style={styles.bannerName}>{profile.name}</Text>'s data
        </Text>
      </View>

      {profiles.map((p) => {
        const active = p.id === profileId;
        return (
          <Pressable key={p.id} onPress={() => setProfileId(p.id)}>
            <Card style={[styles.profileCard, active && styles.profileCardActive]}>
              <View style={[styles.avatar, active && styles.avatarActive]}>
                <Text style={[styles.avatarText, active && styles.avatarTextActive]}>
                  {p.initials}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.role}>{p.id === 'you' ? 'You' : 'Partner'}</Text>
              </View>
              {active ? (
                <View style={styles.check}>
                  <Feather name="check" size={14} color={colors.surface} />
                </View>
              ) : (
                <Feather name="chevron-right" size={20} color={colors.muted} />
              )}
            </Card>
          </Pressable>
        );
      })}

      <Card style={styles.stats}>
        <Text style={styles.statsTitle}>{profile.name} at a glance</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsKey}>Balance</Text>
          <Text style={styles.statsValue}>{money(balance)}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsKey}>Spent</Text>
          <Text style={[styles.statsValue, { color: colors.danger }]}>{money(totalExpense)}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsKey}>Invested</Text>
          <Text style={[styles.statsValue, { color: colors.gold }]}>{money(totalInvestment)}</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    backgroundColor: '#FFEFF0',
    borderRadius: radius.md,
    padding: spacing(3),
  },
  bannerText: { fontFamily: font.regular, fontSize: 13, color: colors.text },
  bannerName: { fontFamily: font.semibold },

  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing(4) },
  profileCardActive: { borderWidth: 2, borderColor: colors.primaryDark },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActive: { backgroundColor: colors.primaryLight },
  avatarText: { fontFamily: font.bold, fontSize: 20, color: colors.muted },
  avatarTextActive: { color: colors.surface },
  info: { flex: 1 },
  name: { fontFamily: font.semibold, fontSize: 16, color: colors.text },
  role: { fontFamily: font.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stats: { gap: spacing(2) },
  statsTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statsKey: { fontFamily: font.regular, fontSize: 13, color: colors.muted },
  statsValue: { fontFamily: font.medium, fontSize: 13, color: colors.text },
});
