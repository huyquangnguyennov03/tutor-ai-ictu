import type { ReactNode } from 'react';
import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import keycloak from './Keycloak';
import type Keycloak from 'keycloak-js';
import { useAppDispatch } from "@/redux/hooks"
import { setToken, setUserInfo, clearUserInfo } from "@/redux/slices/authSlice"
import { Roles } from '@/common/constants/roles';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const [keycloakState, setKeycloakState] = useState<KeycloakContextType>({
    keycloak: null,
    authenticated: false,
  });

  useEffect(() => {
    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    }).then((authenticated) => {
      setKeycloakState({
        keycloak,
        authenticated,
      });
    }).catch((error) => {
      console.error('Failed to initialize Keycloak', error);
      keycloak.login();
    });

    keycloak.onAuthSuccess = () => {
      keycloak.loadUserInfo().then((data: any) => {
        const roles = keycloak.realmAccess?.roles || [];

        let userRole = null;
        if (roles.includes(Roles.TEACHER)) {
          userRole = Roles.TEACHER;
        } else if (roles.includes(Roles.STUDENT)) {
          userRole = Roles.STUDENT;
        }

        dispatch(setUserInfo({
          authenticated: keycloak.authenticated || false,
          token: keycloak.token || null,
          role: userRole,
          saleUpToken: null,
          userInfo: data
        }))
      });
    }

    keycloak.onAuthLogout = () => {
      dispatch(clearUserInfo());
    }

    keycloak.onTokenExpired = () => {
      keycloak.updateToken().then((refreshed) => {
        if (refreshed) {
          console.log('Token đã được làm mới');
          dispatch(setToken(keycloak.token || null))
        }
      }).catch((error) => {
        console.error('Không thể làm mới token', error);
      });
    }

    return () => {
      keycloak.logout();
    };
  }, []);

  return (
    <KeycloakContext.Provider value={keycloakState}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = (): KeycloakContextType => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
};