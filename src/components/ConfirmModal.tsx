import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius, shadow, spacing } from '../theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

/** Destructive confirm sheet — same look as entry actions. */
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={loading ? undefined : onCancel}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing(5) }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.hint}>{message}</Text>

          <Pressable
            onPress={onConfirm}
            disabled={loading}
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && !loading && styles.deletePressed,
              loading && styles.deleteBusy,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.danger} />
            ) : (
              <>
                <Feather name="trash-2" size={16} color={colors.danger} />
                <Text style={styles.deleteText}>{confirmLabel}</Text>
              </>
            )}
          </Pressable>
          <Pressable onPress={onCancel} disabled={loading} hitSlop={8} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,26,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing(6),
    paddingTop: spacing(3),
    gap: spacing(3),
    ...shadow,
    shadowOpacity: 0.18,
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing(2),
  },
  title: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  hint: {
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: -spacing(1),
    marginBottom: spacing(1),
  },
  deleteBtn: {
    minHeight: spacing(13),
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#F5C4C0',
    backgroundColor: '#FDECEA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(2),
  },
  deletePressed: { opacity: 0.85 },
  deleteBusy: { opacity: 0.7 },
  deleteText: { fontFamily: font.semibold, fontSize: 15, color: colors.danger },
  cancel: { alignItems: 'center', paddingVertical: spacing(2) },
  cancelText: { fontFamily: font.medium, fontSize: 14, color: colors.muted },
});
