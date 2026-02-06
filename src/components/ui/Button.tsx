import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const styles = StyleSheet.create({
    button: {
      height: 52,
      borderRadius: Radius.md,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: colors.accent0,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border0,
    },
    destructive: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.destructive,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      ...Typography.body,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    primaryText: {
      color: colors.bg0,
    },
    secondaryText: {
      color: colors.text0,
    },
    destructiveText: {
      color: colors.destructive,
    },
    disabledText: {
      color: colors.text2,
    },
  });

  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'destructive' && styles.destructive,
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'destructive' && styles.destructiveText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <AnimatedTouchable
      style={[buttonStyle, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}>
      <Text style={buttonTextStyle}>{title}</Text>
    </AnimatedTouchable>
  );
}
