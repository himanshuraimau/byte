/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Map color names to the new color system
const colorMap: Record<string, string> = {
  text: Colors.text0,
  background: Colors.bg0,
  tint: Colors.accent0,
  icon: Colors.text2,
  tabIconDefault: Colors.text2,
  tabIconSelected: Colors.accent0,
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Return mapped color or fallback to text0
    return colorMap[colorName] || Colors.text0;
  }
}
