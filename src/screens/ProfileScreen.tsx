import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { signOut } from '../services/auth';
import databaseService from '../services/database';
import { UserInfo, DatabaseUser } from '../types';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ Profile: { user: UserInfo } }, 'Profile'>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { user } = route.params;
  const [userData, setUserData] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const dbUser = await databaseService.getUserById(user.id);
      if (dbUser) {
        setUserData(dbUser);
      }
    } catch (error) {
      console.error('Error loading user data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar sair. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={
            userData?.photo
              ? { uri: userData.photo }
              : require('../../assets/default_avatar.png')
          }
          style={styles.profileImage}
        />

        <Text style={styles.nameText}>{userData?.name || user.name}</Text>
        <Text style={styles.emailText}>{userData?.email || user.email}</Text>

        {userData?.loginDate && (
          <Text style={styles.loginInfoText}>
            Último login: {new Date(userData.loginDate).toLocaleString()}
          </Text>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Informações da Conta</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>
          {user.givenName && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>{user.givenName}</Text>
            </View>
          )}
          {user.familyName && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sobrenome:</Text>
              <Text style={styles.infoValue}>{user.familyName}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loginInfoText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: 100,
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;