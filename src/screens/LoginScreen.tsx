import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../components/Button';
import GradientBackground from '../components/GradientBackground';
import Wordmark from '../components/Wordmark';
import { CODE_WORD } from '../mock';
import { colors, font, radius, spacing } from '../theme';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const shake = useRef(new Animated.Value(0)).current;

  const submit = () => {
    if (code.trim().toLowerCase() === CODE_WORD) {
      setError('');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      return;
    }
    setError('That code word is not ours.');
    Animated.sequence(
      [-10, 10, -6, 6, 0].map((toValue) =>
        Animated.timing(shake, { toValue, duration: 55, useNativeDriver: true })
      )
    ).start();
  };

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Wordmark size={52} />
          <Text style={styles.tagline}>Just the two of us.</Text>
        </View>

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
          <Button title="Unlock" onPress={submit} style={styles.button} />
        </Animated.View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing(6), gap: spacing(8) },
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
});
