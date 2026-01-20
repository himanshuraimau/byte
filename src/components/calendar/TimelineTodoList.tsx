import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { initDatabase } from '@/database/db';
import { NoteRepository, SessionRepository, TaskRepository } from '@/database/repositories';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface TimelineTodoListProps {
    selectedDate: string;
    isVisible: boolean;
}

interface TodoItem {
    id: number;
    type: 'task' | 'note' | 'session';
    title: string;
    subtitle?: string;
    completed?: boolean;
}

export function TimelineTodoList({ selectedDate, isVisible }: TimelineTodoListProps) {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (isVisible) {
            loadTodos();
            height.value = withTiming(300, { duration: 300 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            height.value = withTiming(0, { duration: 300 });
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [isVisible, selectedDate]);

    const loadTodos = async () => {
        setLoading(true);
        try {
            const db = await initDatabase();
            const taskRepo = new TaskRepository(db);
            const noteRepo = new NoteRepository(db);
            const sessionRepo = new SessionRepository(db);

            // Get day ID for selected date
            const dayResult = await db.getFirstAsync<{ id: number }>(
                'SELECT id FROM days WHERE date = ?',
                [selectedDate]
            );

            if (!dayResult) {
                setTodos([]);
                return;
            }

            const dayId = dayResult.id;

            // Load tasks, notes, and sessions
            const [tasks, notes, sessions] = await Promise.all([
                taskRepo.findByDayId(dayId),
                noteRepo.findByDayId(dayId),
                sessionRepo.findByDayId(dayId),
            ]);

            const items: TodoItem[] = [
                ...tasks.map(task => ({
                    id: task.id,
                    type: 'task' as const,
                    title: task.title,
                    subtitle: `${task.progress}% complete`,
                    completed: task.completed,
                })),
                ...notes.map(note => ({
                    id: note.id,
                    type: 'note' as const,
                    title: note.content.substring(0, 50) + (note.content.length > 50 ? '...' : ''),
                })),
                ...sessions.map(session => ({
                    id: session.id,
                    type: 'session' as const,
                    title: session.name,
                    subtitle: `${session.duration} min`,
                })),
            ];

            setTodos(items);
        } catch (error) {
            console.error('Failed to load todos:', error);
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        opacity: opacity.value,
    }));

    if (!isVisible) return null;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {todos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No entries for this day</Text>
                </View>
            ) : (
                <FlatList
                    data={todos}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    renderItem={({ item }) => (
                        <View style={styles.todoCard}>
                            <View style={styles.todoHeader}>
                                <Text style={styles.todoType}>[{item.type.toUpperCase()}]</Text>
                                {item.completed !== undefined && (
                                    <Text style={styles.todoStatus}>
                                        {item.completed ? '✓' : '○'}
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.todoTitle}>{item.title}</Text>
                            {item.subtitle && (
                                <Text style={styles.todoSubtitle}>{item.subtitle}</Text>
                            )}
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: Colors.bg1,
    },
    listContent: {
        padding: Spacing.lg,
        gap: Spacing.base,
    },
    todoCard: {
        backgroundColor: Colors.bg0,
        borderRadius: Radius.md,
        padding: Spacing.base,
        borderWidth: 1,
        borderColor: Colors.border0,
        ...Shadows.z1,
    },
    todoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    todoType: {
        ...Typography.monoXs,
        color: Colors.text2,
    },
    todoStatus: {
        ...Typography.body,
        color: Colors.accent0,
    },
    todoTitle: {
        ...Typography.body,
        color: Colors.text0,
        marginBottom: Spacing.xs,
    },
    todoSubtitle: {
        ...Typography.small,
        color: Colors.text2,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    emptyText: {
        ...Typography.small,
        color: Colors.text2,
    },
});
