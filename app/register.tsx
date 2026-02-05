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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useUser();
  const router = useRouter();
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!name.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    if (password.trim().length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    try {
      setError("");
      await register(name.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Username already taken");
    }
  };

  const goToLogin = () => {
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg1 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.bg0 }]}>
          <Text style={[styles.title, { color: colors.text0 }]}>
            Welcome to Byte
          </Text>
          <Text style={[styles.subtitle, { color: colors.text1 }]}>
            Create your account
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text1 }]}>
              USERNAME
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text0, borderBottomColor: colors.border0 },
              ]}
              placeholder="Choose a username"
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

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text1 }]}>
              PASSWORD
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text0, borderBottomColor: colors.border0 },
              ]}
              placeholder="Choose a password"
              placeholderTextColor={colors.text3}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              secureTextEntry
              onSubmitEditing={handleRegister}
              returnKeyType="go"
            />
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
              onPress={handleRegister}
              disabled={!name.trim() || !password.trim()}
            >
              <Text style={[styles.buttonText, { color: colors.bg0 }]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text2 }]}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={[styles.link, { color: colors.accent0 }]}>
                Login
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
    ...Typography.monoSm,
    
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
  },
  input: {
    ...Typography.body,
    
    borderBottomWidth: 1,
    
    paddingVertical: Spacing.lg,
    paddingHorizontal: 0,
    fontSize: 16,
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
