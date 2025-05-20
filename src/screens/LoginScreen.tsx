import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginButton from '../components/LoginButton';
import { signIn, isSignedIn, getCurrentUser } from '../services/auth';
import databaseService from '../services/database';
import { sendConfirmationEmail } from '../services/email';
import { UserInfo } from '../types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Verificar se o usuário já está logado ao iniciar a tela
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const signedIn = await isSignedIn();
      if (signedIn) {
        const user = await getCurrentUser();
        if (user) {
          // Navegar diretamente para o perfil se já estiver logado
          navigation.replace('Profile', { user });
        }
      }
    } catch (error) {
      console.error('Error checking login status: ', error);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Realizar login com Google
      const userInfo = await signIn();
      
      if (userInfo) {
        await processUserLogin(userInfo);
      }
    } catch (error) {
      console.error('Error during login process: ', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const processUserLogin = async (user: UserInfo) => {
    try {
      // Salvar dados do usuário no SQLite
      await databaseService.saveUser(user);
      
      // Enviar e-mail de confirmação
      sendConfirmationEmail(user).catch(error => {
        console.error('Failed to send email: ', error);
      });
      
      // Navegar para a tela de perfil
      navigation.replace('Profile', { user });
      
    } catch (error) {
      console.error('Error processing login: ', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar seu login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Login App</Text>
      <Text style={styles.subtitle}>
        Faça login com sua conta Google para continuar
      </Text>
      
      <View style={styles.buttonContainer}>
        <LoginButton onPress={handleGoogleLogin} loading={loading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;