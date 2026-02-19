// components/MicrosoftAuth.tsx
// Componente para manejar la autenticación con Microsoft

import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, User, Cloud } from 'lucide-react';
import * as MicrosoftGraph from '../services/microsoftGraphService';

interface MicrosoftAuthProps {
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export const MicrosoftAuth: React.FC<MicrosoftAuthProps> = ({ onAuthChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await MicrosoftGraph.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUser = await MicrosoftGraph.getCurrentUser();
        setUser(currentUser);
      }
      
      onAuthChange?.(authenticated);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const account = await MicrosoftGraph.signIn();
      setUser(account);
      setIsAuthenticated(true);
      onAuthChange?.(true);
      
      // Crear estructura de carpetas inicial
      await MicrosoftGraph.createInitialFolderStructure();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión con Microsoft. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await MicrosoftGraph.signOut();
      setUser(null);
      setIsAuthenticated(false);
      onAuthChange?.(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Verificando sesión...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user.name || user.username}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              OneDrive conectado
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-2">
        <Cloud className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Conectar con Microsoft
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Inicia sesión para guardar documentos en OneDrive y enviar correos con Outlook
          </p>
        </div>
      </div>
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogIn className="w-4 h-4" />
        Iniciar sesión con Microsoft
      </button>
      <p className="text-xs text-gray-500 text-center">
        Se abrirá una ventana para iniciar sesión de forma segura
      </p>
    </div>
  );
};

export default MicrosoftAuth;
