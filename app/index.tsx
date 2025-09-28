import { useRouter } from 'expo-router';
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';

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

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      console.log('Login successful!', user);
      router.replace('/main_menu');
    } else {
      console.log('Invalid email or password');
      alert('Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.backgroundGradient}>
          {/* Bakery Background Image */}
          <Image 
            source={require('../assets/images/background-login.jpeg')}
            style={styles.backgroundImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('Image load error:', error);
              // Fallback to a solid color if image fails to load
            }}
          />
          <View style={styles.imageOverlay} />

          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Done Button (top right) */}
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>

            {/* App Title with Watermelon Mascot */}
            <View style={styles.titleContainer}>
              <Text style={styles.appTitle}>NutriLens+</Text>
              <View style={styles.watermelonMascot}>
                <View style={styles.watermelonBody}>
                  <View style={styles.watermelonStripe1} />
                  <View style={styles.watermelonStripe2} />
                  <View style={styles.watermelonStripe3} />
                  <View style={styles.watermelonStripe4} />
                  <View style={styles.watermelonStripe5} />
                  <View style={styles.watermelonStripe6} />
                  <View style={styles.watermelonStripe7} />
                  <View style={styles.watermelonStripe8} />
                  
                  {/* Face */}
                  <View style={styles.watermelonEyeLeft}>
                    <Text style={styles.eyeText}>{'>'}</Text>
                  </View>
                  <View style={styles.watermelonEyeRight}>
                    <Text style={styles.eyeText}>{'●'}</Text>
                  </View>
                  <View style={styles.watermelonMouth}>
                    <Text style={styles.mouthText}>{'<'}</Text>
          </View>

                  {/* Highlights */}
                  <View style={styles.watermelonHighlight1} />
                  <View style={styles.watermelonHighlight2} />
                </View>
              </View>
            </View>


            {/* Login Form */}
            <View style={styles.loginSection}>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                  placeholderTextColor="#8B4513"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                  placeholderTextColor="#8B4513"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

            {/* Privacy Policy */}
            <View style={styles.privacySection}>
              <View style={styles.privacyCheckbox}>
                <View style={styles.checkboxIcon}>
                  <Text style={styles.checkboxText}>✓</Text>
                </View>
                <Text style={styles.privacyText}>
                  I have read and agree to the <Text style={styles.privacyLink}>Privacy Policy</Text>
                </Text>
                <Text style={styles.globeIcon}>🌐</Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC",
  },
  keyboardView: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Fallback cream color
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 245, 220, 0.3)', // Light cream overlay
  },
  contentCard: {
    flex: 1,
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  doneButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '500',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513', // Brown color to match bakery theme
    textShadowColor: '#D2B48C',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  watermelonMascot: {
    position: 'absolute',
    top: -10,
    right: -20,
  },
  watermelonBody: {
    width: 60,
    height: 60,
    backgroundColor: '#228B22',
    borderRadius: 30,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#000',
  },
  watermelonStripe1: {
    position: 'absolute',
    top: 8,
    left: 5,
    right: 5,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonStripe2: {
    position: 'absolute',
    top: 15,
    left: 3,
    right: 3,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonStripe3: {
    position: 'absolute',
    top: 22,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonStripe4: {
    position: 'absolute',
    top: 29,
    left: 2,
    right: 2,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonStripe5: {
    position: 'absolute',
    top: 36,
    left: 3,
    right: 3,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonStripe6: {
    position: 'absolute',
    top: 43,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonStripe7: {
    position: 'absolute',
    top: 50,
    left: 2,
    right: 2,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonStripe8: {
    position: 'absolute',
    top: 57,
    left: 3,
    right: 3,
    height: 3,
    backgroundColor: '#32CD32',
    borderRadius: 1.5,
  },
  watermelonEyeLeft: {
    position: 'absolute',
    top: 20,
    left: 15,
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermelonEyeRight: {
    position: 'absolute',
    top: 20,
    right: 15,
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermelonMouth: {
    position: 'absolute',
    top: 35,
    left: 26,
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  mouthText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  watermelonHighlight1: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    opacity: 0.8,
  },
  watermelonHighlight2: {
    position: 'absolute',
    top: 12,
    left: 10,
    width: 6,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    opacity: 0.6,
  },
  loginSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D2691E',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#D2B48C', // Tan color for bakery theme
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  privacySection: {
    alignItems: 'center',
  },
  privacyCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
  },
  privacyLink: {
    textDecorationLine: 'underline',
    color: '#8B4513',
  },
  globeIcon: {
    fontSize: 12,
    marginLeft: 5,
  },
} as const)
