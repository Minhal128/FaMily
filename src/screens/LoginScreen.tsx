import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../components/Button';
import GradientBackground from '../components/GradientBackground';
import KissBackdrop from '../components/KissBackdrop';
import Wordmark from '../components/Wordmark';
import { loadWho } from '../lib/identity';
import { useApp } from '../state/AppContext';
import { brandGradient, colors, font, radius, shadow, spacing } from '../theme';
import { ProfileId } from '../types';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { unlock, claimIdentity, profiles, setProfileId } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState<ProfileId | null>(null);
  const [step, setStep] = useState<'code' | 'who'>('code');
  const [kb, setKb] = useState(0);
  const shake = useRef(new Animated.Value(0)).current;
  const pickLock = useRef(false);

  // Android 15+ no longer resizes for the IME — pad manually from keyboard events.
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKb(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKb(0)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const enter = () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await unlock(code);
      setError('');
      const who = await loadWho();
      if (who) {
        setProfileId(who);
        enter();
        return;
      }
      Keyboard.dismiss();
      setStep('who');
    } catch (err) {
      setError((err as Error).message);
      Animated.sequence(
        [-10, 10, -6, 6, 0].map((toValue) =>
          Animated.timing(shake, { toValue, duration: 55, useNativeDriver: true })
        )
      ).start();
    } finally {
      setBusy(false);
    }
  };

  const pick = async (id: ProfileId) => {
    if (pickLock.current) return;
    pickLock.current = true;
    setPicking(id);
    try {
      await claimIdentity(id);
      enter();
    } finally {
      pickLock.current = false;
      setPicking(null);
    }
  };

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <KissBackdrop />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: spacing(6) + kb }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Wordmark size={52} />
            <Text style={styles.tagline}>Just the two of us.</Text>
          </View>

          {step === 'code' ? (
            <Animated.View style={[styles.card, { transform: [{ translateX: shake }] }]}>
              <Text style={styles.label}>Code word</Text>
              <TextInput
                value={code}
                onChangeText={(t) => {
                  setCode(t);
                  if (error) setError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="••••••"
                placeholderTextColor={colors.muted}
                onSubmitEditing={submit}
                returnKeyType="go"
                style={[styles.input, !!error && styles.inputError]}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button title="Unlock" onPress={submit} loading={busy} style={styles.button} />
            </Animated.View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.whoTitle}>Who is this phone?</Text>
              <Text style={styles.whoHint}>We'll open as you every time. One pick per device.</Text>
              {profiles.map((p) => {
                const loading = picking === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => pick(p.id)}
                    disabled={!!picking}
                    style={({ pressed }) => [
                      styles.whoRow,
                      pressed && !picking && styles.whoRowPressed,
                      loading && styles.whoRowActive,
                    ]}
                  >
                    <GradientBackground colors={brandGradient} style={styles.whoAvatar}>
                      <Text style={styles.whoInitials}>{p.initials}</Text>
                    </GradientBackground>
                    <View style={styles.whoInfo}>
                      <Text style={styles.whoName}>{p.name}</Text>
                      <Text style={styles.whoRole}>This is me</Text>
                    </View>
                    {loading ? (
                      <ActivityIndicator color={colors.primaryDark} />
                    ) : (
                      <Feather name="chevron-right" size={20} color={colors.primaryDark} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing(6),
    gap: spacing(8),
  },
  header: { alignItems: 'center' },
  tagline: {
    fontFamily: font.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing(1),
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing(6),
    gap: spacing(3),
  },
  label: { fontFamily: font.medium, fontSize: 13, color: colors.muted },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(4),
    fontFamily: font.regular,
    fontSize: 18,
    letterSpacing: 4,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  error: { fontFamily: font.regular, fontSize: 12, color: colors.danger },
  button: { marginTop: spacing(2) },
  whoTitle: { fontFamily: font.semibold, fontSize: 18, color: colors.text, textAlign: 'center' },
  whoHint: {
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  whoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(4),
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(4),
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow,
    shadowOpacity: 0.05,
  },
  whoRowPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  whoRowActive: { borderColor: colors.primaryDark, backgroundColor: '#FFEFF0' },
  whoAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexGrow: 0,
  },
  whoInitials: { fontFamily: font.bold, fontSize: 18, color: colors.surface },
  whoInfo: { flex: 1 },
  whoName: { fontFamily: font.semibold, fontSize: 16, color: colors.text },
  whoRole: { fontFamily: font.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
});
