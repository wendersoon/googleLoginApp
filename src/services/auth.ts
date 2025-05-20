import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { UserInfo } from '../types';

// Inicializar o Google Sign-In com a configuração
export const initGoogleSignIn = () => {
  GoogleSignin.configure({
    // Substituir pelo seu ID de cliente Web do Google Cloud Console
    webClientId: 'CLIENTE ID AQUI',
    offlineAccess: true,
  });
};

// Verificar se o usuário já está conectado
export const isSignedIn = async (): Promise<boolean> => {
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error('Error checking sign in status: ', error);
    return false;
  }
};

// Obter o usuário atual caso esteja logado
export const getCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    if (userInfo) {
      return {
        id: userInfo.user.id,
        name: userInfo.user.name,
        email: userInfo.user.email,
        photo: userInfo.user.photo,
        familyName: userInfo.user.familyName,
        givenName: userInfo.user.givenName,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user: ', error);
    return null;
  }
};

// Fazer login com o Google
export const signIn = async (): Promise<UserInfo | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    // Retornar informações do usuário
    return {
      id: userInfo.user.id,
      name: userInfo.user.name,
      email: userInfo.user.email,
      photo: userInfo.user.photo,
      familyName: userInfo.user.familyName,
      givenName: userInfo.user.givenName,
    };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign in is in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available');
    } else {
      console.error('Error during sign in: ', error);
    }
    return null;
  }
};

// Fazer logout
export const signOut = async (): Promise<void> => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};