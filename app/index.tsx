import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Config from 'react-native-config';

const BACKEND_URL = Config.BACKEND_URL;

//Test Data, delete later
export interface User {
  id: number;
  email: string;
  password: string; // can be plain text or bcrypt hash
}

export const users: User[] = [
  { id: 1, email: 'alice@example.com', password: 'password123' },
  { id: 2, email: 'bob@example.com', password: 'mypassword' },
  { id: 3, email: 'a', password: 'b' },
];

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleLogin = async () => {
  try {
    const response = await fetch(`https://nasopalatine-unreminiscently-jenna.ngrok-free.dev/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: email, user_password: password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful!', data.user);
      router.replace("/HomeScreen");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error connecting to server:', error);
    alert('Server error, please try again later');
  }
};



  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.content}>
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={styles.logoInner} />
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign in</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: "#6B8E6B",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoInner: {
    width: 24,
    height: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    height: 44,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  loginButton: {
    height: 44,
    backgroundColor: "#6B8E6B",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  forgotPassword: {
    alignItems: "center",
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B8E6B",
  },
})