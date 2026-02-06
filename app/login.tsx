import { Radius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();
  const router = useRouter();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setError("");
      await login(name.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
    }
  };

  const goToRegister = () => {
    router.push("/register");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg1 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.bg0 }]}>
          <Text style={[styles.title, { color: colors.text0 }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.text1 }]}>
            Login to Byte
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text1 }]}>
              Username
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.bg1,
                  borderColor: colors.border1,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text0 }]}
                placeholder="Enter your username"
                placeholderTextColor={colors.text3}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text1 }]}>
              Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.bg1,
                  borderColor: colors.border1,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text0 }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.text3}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry
                onSubmitEditing={handleLogin}
                returnKeyType="go"
              />
            </View>
          </View>

          {error ? (
            <Text style={[styles.error, { color: colors.destructive }]}>
              {error}
            </Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.accent0 },
                (!name.trim() || !password.trim()) && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!name.trim() || !password.trim()}
            >
              <Text style={[styles.buttonText, { color: colors.bg0 }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text2 }]}>
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={[styles.link, { color: colors.accent0 }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 400,
    ...Shadows.z3,
  },
  title: {
    ...Typography.h1,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.small,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  input: {
    ...Typography.body,
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    ...Typography.small,
    marginBottom: Spacing.base,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
  button: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...Typography.body,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  footerText: {
    ...Typography.small,
  },
  link: {
    ...Typography.small,
    fontWeight: "500",
  },
});
