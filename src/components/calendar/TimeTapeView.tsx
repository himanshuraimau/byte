import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarTimeline } from './CalendarTimeline';
import { TimelineTodoList } from './TimelineTodoList';

interface TimeTapeViewProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export function TimeTapeView({ selectedDate, onDateSelect }: TimeTapeViewProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg1,
        },
        timelineHeader: {
            backgroundColor: colors.bg0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border0,
        },
        agendaContainer: {
            flex: 1,
        },
    });

    return (
        <View style={styles.container}>
            {/* Persistent horizontal timeline header */}
            <View style={styles.timelineHeader}>
                <CalendarTimeline
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                />
            </View>

            {/* Agenda list below */}
            <View style={styles.agendaContainer}>
                <TimelineTodoList
                    selectedDate={selectedDate}
                    isVisible={true}
                />
            </View>
        </View>
    );
}
