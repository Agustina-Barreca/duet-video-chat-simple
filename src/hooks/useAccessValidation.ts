
import { useState } from "react";
import { useZoomVideoSDK } from "./useZoomVideoSDK";

interface UserData {
  name: string;
  startWithVideo: boolean;
  startWithAudio: boolean;
  initialBlurEnabled: boolean;
  initialBackground: string | null;
}

// Extend window interface to include Zoom configuration
declare global {
  interface Window {
    sessionName?: string;
    accesstoken?: string;
    sessionPassword?: string;
  }
}

export const useAccessValidation = () => {
  const [isValidatingAccess, setIsValidatingAccess] = useState(false);
  const [accessValidationError, setAccessValidationError] = useState<string | null>(null);
  const { joinSession, connectionError } = useZoomVideoSDK();

  const handleAccessValidation = async (userData: UserData): Promise<boolean> => {
    setIsValidatingAccess(true);
    setAccessValidationError(null);

    try {
      console.log('Validando acceso a la videollamada para:', userData);
      
      // Simulación de delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar que el token esté presente
      if (!window.accesstoken) {
        const errorMsg = 'Token de acceso requerido. Por favor, configure window.accesstoken antes de iniciar la videollamada.';
        setAccessValidationError(errorMsg);
        console.log('❌ Token de acceso faltante');
        return false;
      }
      
      // Usar variables globales de window para la configuración de Zoom
      const zoomConfig = {
        sessionName: window.sessionName || 'test-session',
        accessToken: window.accesstoken,
        userIdentity: userData.name,
        sessionPassword: window.sessionPassword || ''
      };

      console.log('Configuración de Zoom:', {
        sessionName: zoomConfig.sessionName,
        accessToken: zoomConfig.accessToken ? '[TOKEN PRESENTE]' : '[TOKEN FALTANTE]',
        userIdentity: zoomConfig.userIdentity,
        sessionPassword: zoomConfig.sessionPassword ? '[PASSWORD PRESENTE]' : '[SIN PASSWORD]'
      });

      // Intentar conectar a la sesión de Zoom
      const connectionSuccess = await joinSession(zoomConfig);
      
      if (connectionSuccess) {
        console.log('✅ Acceso concedido y conectado a Zoom');
        return true;
      } else {
        const errorMsg = connectionError || 'No se pudo conectar a la videollamada. Verifica tu configuración.';
        setAccessValidationError(errorMsg);
        console.log('❌ Error de conexión a Zoom');
        return false;
      }
    } catch (error) {
      console.error('Error al validar acceso:', error);
      setAccessValidationError('Error de conexión con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
      return false;
    } finally {
      setIsValidatingAccess(false);
    }
  };

  return {
    isValidatingAccess,
    accessValidationError,
    handleAccessValidation
  };
};
