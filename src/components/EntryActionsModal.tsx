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
import Button from './Button';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
};

/** Brand sheet for edit/delete — replaces the system Alert. */
export default function EntryActionsModal({
  visible,
  title,
  onClose,
  onEdit,
  onDelete,
  deleting = false,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={deleting ? undefined : onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing(5) }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.hint}>Edit or delete this entry</Text>

          <Button
            title="Edit"
            onPress={onEdit}
            loading={false}
            icon={<Feather name="edit-2" size={16} color={colors.surface} />}
            style={styles.btn}
          />
          <Pressable
            onPress={onDelete}
            disabled={deleting}
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && !deleting && styles.deletePressed,
              deleting && styles.deleteBusy,
            ]}
          >
            {deleting ? (
              <ActivityIndicator color={colors.danger} />
            ) : (
              <>
                <Feather name="trash-2" size={16} color={colors.danger} />
                <Text style={styles.deleteText}>Delete</Text>
              </>
            )}
          </Pressable>
          <Pressable onPress={onClose} disabled={deleting} hitSlop={8} style={styles.cancel}>
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
  btn: { marginTop: spacing(1) },
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
