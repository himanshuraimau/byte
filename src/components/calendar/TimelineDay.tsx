import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface TimelineDayProps {
    date: Date;
    isToday: boolean;
    isSelected: boolean;
    hasEntries: boolean;
    onPress: () => void;
    showMonthLabel?: boolean;
}

const DAY_WIDTH = 80;

export function TimelineDay({
    date,
    isToday,
    isSelected,
    hasEntries,
    onPress,
    showMonthLabel = false,
}: TimelineDayProps) {
    const scale = useSharedValue(1);
    const dayNumber = date.getDate();
    const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()];
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][date.getMonth()];
    const year = date.getFullYear();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        onPress();
    };

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={[
                    styles.dayContainer,
                    isSelected && styles.daySelected,
                ]}>
                {/* Month label when month changes */}
                {showMonthLabel && (
                    <Text style={styles.monthLabel}>
                        {month} {year}
                    </Text>
                )}

                {/* Weekday label */}
                <Text style={styles.weekday}>{weekday}</Text>

                {/* Date number */}
                <Text
                    style={[
                        styles.dateNumber,
                        isToday && styles.dateNumberToday,
                        isSelected && styles.dateNumberSelected,
                    ]}>
                    {dayNumber}
                </Text>

                {/* Today accent underline */}
                {isToday && <View style={styles.todayUnderline} />}

                {/* Entry indicator dot */}
                {hasEntries && !isSelected && <View style={styles.entryDot} />}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: DAY_WIDTH,
    },
    dayContainer: {
        width: DAY_WIDTH,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.sm,
        position: 'relative',
    },
    daySelected: {
        backgroundColor: Colors.accent0,
        borderRadius: Radius.sm,
    },
    monthLabel: {
        ...Typography.monoXs,
        color: Colors.text2,
        position: 'absolute',
        top: 4,
        textTransform: 'uppercase',
        fontSize: 9,
    },
    weekday: {
        ...Typography.monoXs,
        color: Colors.text2,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
    },
    dateNumber: {
        ...Typography.display,
        color: Colors.text0,
        fontSize: 32,
        lineHeight: 36,
    },
    dateNumberToday: {
        fontWeight: '700',
        color: Colors.accent0,
    },
    dateNumberSelected: {
        color: Colors.bg0,
    },
    todayUnderline: {
        position: 'absolute',
        bottom: 12,
        width: 32,
        height: 3,
        backgroundColor: Colors.accent0,
        borderRadius: 2,
    },
    entryDot: {
        position: 'absolute',
        bottom: 8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.accent0,
    },
});
