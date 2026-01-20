import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { Note } from '@/types/entities';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

interface NoteModalProps {
  visible: boolean;
  note?: Note | null; // If provided, edit mode; otherwise create mode
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function NoteModal({ visible, note, onClose, onSave, onDelete }: NoteModalProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const isEditMode = !!note;

  useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent('');
    }
    setError('');
  }, [note, visible]);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.9, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave(content.trim());
      // Reset form state
      setContent('');
      setError('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setLoading(true);
      setError('');
      await onDelete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <AnimatedView style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
              <AnimatedView style={[styles.modal, modalStyle]}>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {isEditMode ? 'Edit Note' : 'New Note'}
                  </Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                  <Textarea
                    label="CONTENT"
                    value={content}
                    onChangeText={(text) => {
                      setContent(text);
                      setError('');
                    }}
                    placeholder="Enter your note..."
                    autoFocus
                    style={styles.textarea}
                  />

                  {error ? (
                    <Text style={styles.error}>{error}</Text>
                  ) : null}


                </ScrollView>

                <View style={styles.actions}>
                  {isEditMode && onDelete && (
                    <Button
                      title="DELETE"
                      variant="destructive"
                      onPress={handleDelete}
                      disabled={loading}
                      style={styles.deleteButton}
                    />
                  )}
                  <View style={styles.saveButton}>
                    <Button
                      title={isEditMode ? 'SAVE' : 'CREATE'}
                      onPress={handleSave}
                      disabled={loading || !content.trim()}
                    />
                  </View>
                </View>
              </AnimatedView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </AnimatedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    ...Shadows.z3,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  title: {
    ...Typography.h2,
    color: Colors.text0,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    ...Typography.h2,
    color: Colors.text2,
  },
  content: {
    padding: Spacing.xl,
  },
  textarea: {
    minHeight: 200,
    marginBottom: Spacing.xl,
  },
  error: {
    ...Typography.small,
    color: Colors.destructive,
    marginBottom: Spacing.base,
  },
  actions: {
    gap: Spacing.base,
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border0,
  },
  deleteButton: {
    marginBottom: Spacing.sm,
  },
  saveButton: {
    width: '100%',
  },
});
