import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Note } from '@/types/entities';

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

  const isEditMode = !!note;

  useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent('');
    }
    setError('');
  }, [note, visible]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave(content.trim());
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
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
              <View style={styles.modal}>
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
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
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
    marginTop: Spacing.lg,
  },
  deleteButton: {
    marginBottom: Spacing.sm,
  },
  saveButton: {
    width: '100%',
  },
});
