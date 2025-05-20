import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas do aplicativo
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

// Serviços
import { initGoogleSignIn } from './services/auth';
import databaseService from './services/database';

// Criação do stack de navegação
const Stack = createNativeStackNavigator();

/**
 * Componente principal do aplicativo
 * Configura a navegação e inicializa os serviços necessários
 */
const App = () => {
  useEffect(() => {
    // Inicializar o Google Sign-In ao carregar o app
    initGoogleSignIn();
    
    // Inicializar o banco de dados SQLite
    const initDB = async () => {
      await databaseService.initDatabase();
    };
    
    initDB();
    
    // Limpar recursos ao desmontar o componente
    return () => {
      const closeDB = async () => {
        await databaseService.closeDatabase();
      };
      closeDB();
    };
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;