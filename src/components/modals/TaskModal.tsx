import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { Task } from '@/types/entities';
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

interface TaskModalProps {
  visible: boolean;
  task?: Task | null; // If provided, edit mode; otherwise create mode
  onClose: () => void;
  onSave: (task: { title: string; progress: number }) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function TaskModal({ visible, task, onClose, onSave, onDelete }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setProgress(task.progress);
    } else {
      setTitle('');
      setProgress(0);
    }
    setError('');
  }, [task, visible]);

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
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({ title: title.trim(), progress });
      // Reset form state
      setTitle('');
      setProgress(0);
      setError('');
      onClose();
      // Success feedback handled by parent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
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
      setError(err instanceof Error ? err.message : 'Failed to delete task');
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
                    {isEditMode ? 'Edit Task' : 'New Task'}
                  </Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                  <Input
                    label="TITLE"
                    value={title}
                    onChangeText={(text) => {
                      setTitle(text);
                      setError('');
                    }}
                    placeholder="Enter task title"
                    autoFocus
                  />

                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>PROGRESS</Text>
                    <Slider
                      value={progress}
                      onValueChange={setProgress}
                      step={5}
                      showValue={true}
                    />
                  </View>

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
                        disabled={loading || !title.trim()}
                      />
                    </View>
                  </View>
                </ScrollView>
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
  sliderContainer: {
    marginBottom: Spacing.xl,
  },
  sliderLabel: {
    ...Typography.monoSm,
    color: Colors.text1,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
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
