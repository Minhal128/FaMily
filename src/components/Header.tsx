import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  back?: boolean;
};

export default function Header({ title, subtitle, back = true }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.row}>
      {back ? (
        <Pressable onPress={navigation.goBack} style={styles.back} accessibilityLabel="Go back">
          <Feather name="chevron-left" size={22} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  title: { fontFamily: font.bold, fontSize: 22, color: colors.text },
  subtitle: { fontFamily: font.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
});
