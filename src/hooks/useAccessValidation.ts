
import { useState } from "react";
import { useZoomVideoSDK } from "./useZoomVideoSDK";

interface UserData {
  name: string;
  startWithVideo: boolean;
  startWithAudio: boolean;
  initialBlurEnabled: boolean;
  initialBackground: string | null;
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
      
      // AQUÍ PUEDES CONFIGURAR TUS DATOS DE ZOOM REALES
      // Por ahora uso datos simulados - reemplaza con tus valores reales
      const zoomConfig = {
        sessionName: 'test-session', // Reemplaza con tu sessionName real
        accessToken: 'your-jwt-token', // Reemplaza con tu JWT token real
        userIdentity: userData.name, // Usar el nombre del usuario
        sessionPassword: '' // Opcional
      };

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
