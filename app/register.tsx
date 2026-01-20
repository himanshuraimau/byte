import {
    Colors,
    Radius,
    Shadows,
    Spacing,
    Typography,
} from "@/constants/theme";
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Byte</Text>
          <Text style={styles.subtitle}>Create your account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>USERNAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor={Colors.text3}
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
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a password"
              placeholderTextColor={Colors.text3}
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

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                (!name.trim() || !password.trim()) && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={!name.trim() || !password.trim()}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.link}>Login</Text>
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
    backgroundColor: Colors.bg1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 400,
    ...Shadows.z3,
  },
  title: {
    ...Typography.h1,
    color: Colors.text0,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text1,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.monoSm,
    color: Colors.text1,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
  },
  input: {
    ...Typography.body,
    color: Colors.text0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
    paddingVertical: Spacing.lg,
    paddingHorizontal: 0,
    fontSize: 16,
  },
  error: {
    ...Typography.small,
    color: Colors.destructive,
    marginBottom: Spacing.base,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.accent0,
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
    color: Colors.bg0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  footerText: {
    ...Typography.small,
    color: Colors.text2,
  },
  link: {
    ...Typography.small,
    color: Colors.accent0,
    fontWeight: "500",
  },
});
