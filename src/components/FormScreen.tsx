import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, spacing } from '../theme';
import Button from './Button';
import Screen from './Screen';

type Props = {
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  error?: string;
  children: React.ReactNode;
};

/** Shared shell for the three "add ..." modals: header, fields, submit. */
export default function FormScreen({ title, submitLabel, onSubmit, error, children }: Props) {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <Screen scroll tabBarSpace={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={navigation.goBack} hitSlop={12} accessibilityLabel="Close">
            <Feather name="x" size={22} color={colors.muted} />
          </Pressable>
        </View>

        {children}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={submitLabel} onPress={onSubmit} style={styles.submit} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(2),
  },
  title: { fontFamily: font.bold, fontSize: 22, color: colors.text },
  error: { fontFamily: font.regular, fontSize: 12, color: colors.danger },
  submit: { marginTop: spacing(2) },
});
