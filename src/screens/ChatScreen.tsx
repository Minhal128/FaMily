import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import Header from '../components/Header';
import Screen from '../components/Screen';
import { useApp } from '../state/AppContext';
import { colors, font, radius, shadow, spacing } from '../theme';

export default function ChatScreen() {
  const { messages, sendMessage, profileId, partner } = useApp();
  const [draft, setDraft] = useState('');

  // Inverted list keeps the newest message pinned to the bottom without a scroll ref.
  const reversed = useMemo(() => [...messages].reverse(), [messages]);

  const send = () => {
    if (!draft.trim()) return;
    sendMessage(draft.trim());
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen tabBarSpace={false}>
        <Header title="Notes" subtitle={`Between you and ${partner.name}`} back={false} />

        <FlatList
          data={reversed}
          inverted
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing(2), paddingVertical: spacing(2) }}
          renderItem={({ item }) => {
            const mine = item.sender === profileId;
            return (
              <View style={[styles.bubbleRow, mine ? styles.rowRight : styles.rowLeft]}>
                {mine ? (
                  <View style={styles.bubbleMineWrap}>
                    <GradientBackground style={styles.bubbleMine}>
                      <Text style={styles.textMine}>{item.text}</Text>
                      <Text style={styles.timeMine}>{item.time}</Text>
                    </GradientBackground>
                  </View>
                ) : (
                  <View style={styles.bubbleTheirs}>
                    <Text style={styles.textTheirs}>{item.text}</Text>
                    <Text style={styles.timeTheirs}>{item.time}</Text>
                  </View>
                )}
              </View>
            );
          }}
        />

        <View style={styles.inputBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Leave a note…"
            placeholderTextColor={colors.muted}
            style={styles.input}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable onPress={send} style={styles.send} accessibilityLabel="Send message">
            <GradientBackground style={styles.sendInner}>
              <Feather name="send" size={17} color={colors.surface} />
            </GradientBackground>
          </Pressable>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  bubbleRow: { flexDirection: 'row' },
  rowRight: { justifyContent: 'flex-end' },
  rowLeft: { justifyContent: 'flex-start' },
  bubbleMineWrap: {
    maxWidth: '78%',
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.sm,
    overflow: 'hidden',
  },
  bubbleMine: { paddingHorizontal: spacing(4), paddingVertical: spacing(3) },
  bubbleTheirs: {
    maxWidth: '78%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.sm,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3),
  },
  textMine: { fontFamily: font.regular, fontSize: 14, color: colors.surface },
  textTheirs: { fontFamily: font.regular, fontSize: 14, color: colors.text },
  timeMine: {
    fontFamily: font.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timeTheirs: {
    fontFamily: font.regular,
    fontSize: 10,
    color: colors.muted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  inputBar: { flexDirection: 'row', alignItems: 'center', gap: spacing(2), marginBottom: 64 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(5),
    paddingVertical: spacing(3.5),
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.text,
  },
  send: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', ...shadow },
  sendInner: { alignItems: 'center', justifyContent: 'center' },
});
