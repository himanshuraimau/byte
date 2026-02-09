import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'mono';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text0');

  return (
    <Text
      style={[
        { color, fontFamily: Typography.fontFamily },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'mono' ? styles.mono : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...Typography.body,
  },
  defaultSemiBold: {
    ...Typography.body,
    fontFamily: Typography.fontFamilyMedium,
  },
  title: {
    ...Typography.h1,
    fontFamily: Typography.fontFamilyBold,
  },
  subtitle: {
    ...Typography.h2,
    fontFamily: Typography.fontFamilyMedium,
  },
  link: {
    ...Typography.body,
    color: '#22c55e',
    textDecorationLine: 'underline',
  },
  mono: {
    ...Typography.monoMd,
  }
});
