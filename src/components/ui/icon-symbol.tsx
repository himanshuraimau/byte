// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation & Layout
  "house.fill": "home",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.left.forwardslash.chevron.right": "code",

  // Actions
  plus: "add",
  checkmark: "check",
  "checkmark.circle.fill": "check-circle",
  "paperplane.fill": "send",

  // Content Types
  "doc.text": "description",
  "note.text": "note",
  clock: "schedule",
  "clock.fill": "access-time",
  calendar: "calendar-today",

  // User & Account
  "person.circle.fill": "account-circle",

  // Notifications & Status
  "bell.fill": "notifications",
  "flame.fill": "local-fire-department",
  "info.circle.fill": "info",

  // Customization
  "paintbrush.fill": "palette",
} as IconMapping;

// Validate all mappings exist
const validateMappings = () => {
  const invalidMappings: string[] = [];
  Object.entries(MAPPING).forEach(([sfSymbol, materialIcon]) => {
    // Material Icons names should be valid - we'll let MaterialIcons handle validation
    // But we can at least check they're not empty
    if (!materialIcon) {
      invalidMappings.push(sfSymbol);
    }
  });
  if (invalidMappings.length > 0) {
    console.warn("Invalid icon mappings:", invalidMappings);
  }
};

// Run validation in development
if (__DEV__) {
  validateMappings();
}

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name];
  if (!iconName) {
    console.warn(
      `Icon "${name}" not found in mapping. Available icons:`,
      Object.keys(MAPPING),
    );
    return (
      <MaterialIcons
        color={color}
        size={size}
        name="help-outline"
        style={style}
      />
    );
  }
  return (
    <MaterialIcons color={color} size={size} name={iconName} style={style} />
  );
}
