import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../theme';
import Button from './Button';
import Header from './Header';
import Rise from './Rise';
import Screen from './Screen';

type Props = {
  title: string;
  subtitle?: string;
  submitLabel: string;
  onSubmit: () => void;
  error?: string;
  children: React.ReactNode;
};

/** Shared shell for the three add-modals: back header, fields on a card, submit. */
export default function FormScreen({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  error,
  children,
}: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <Screen scroll tabBarSpace={false}>
        <Header title={title} subtitle={subtitle} />

        <View style={styles.sheet}>
          {/* Each field springs in just after the one above it. */}
          {React.Children.map(children, (child, index) => (
            <Rise index={index}>{child}</Rise>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={submitLabel} onPress={onSubmit} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing(5),
    gap: spacing(4),
    ...shadow,
    shadowOpacity: 0.07,
  },
  error: { fontFamily: font.regular, fontSize: 12, color: colors.danger, textAlign: 'center' },
});
