
import { useState } from 'react';
import ZoomVideoSDK from '@zoom/videosdk';
import type { ZoomConfig } from '../../types/zoom';

export const useZoomClient = () => {
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initClient = async () => {
    if (client || isConnected) {
      console.log('Cliente ya inicializado o conectado');
      return client || true;
    }

    setIsInitializing(true);
    setConnectionError(null);

    try {
      console.log('Inicializando cliente Zoom...');
      const clientZoom = ZoomVideoSDK.createClient();
      await clientZoom.init('es-ES', 'Global', {
        patchJsMedia: true,
        enforceMultipleVideos: true,
        enforceVirtualBackground: true,
        stayAwake: true,
        leaveOnPageUnload: true
      });
      
      setClient(clientZoom);
      console.log('Cliente Zoom inicializado correctamente');
      return clientZoom;
    } catch (error) {
      console.error('Error inicializando cliente Zoom:', error);
      setConnectionError('Error al inicializar el cliente de videollamada');
      return null;
    } finally {
      setIsInitializing(false);
    }
  };

  const joinSession = async (config: ZoomConfig) => {
    console.log('Iniciando joinSession con config:', config);
    
    let currentClient = client;
    
    if (!currentClient) {
      console.log('Cliente no existe, inicializando...');
      currentClient = await initClient();
      if (!currentClient) {
        console.error('No se pudo inicializar el cliente');
        return false;
      }
    }

    try {
      console.log('Uniéndose a la sesión con cliente:', currentClient);
      setConnectionError(null);
      
      await currentClient.join(
        window.sessionName,
        window.accesstoken,
        window.userIdentity,
        window.sessionPassword
      );
      
      setIsConnected(true);
      console.log('✅ Conectado exitosamente a la sesión');
      return true;
    } catch (error) {
      console.error('Error uniéndose a la sesión:', error);
      setConnectionError('No se pudo conectar a la videollamada. Verifica tus permisos.');
      setIsConnected(false);
      return false;
    }
  };

  const leaveSession = async () => {
    if (!client || !isConnected) return;

    try {
      await client.leave();
      setIsConnected(false);
      console.log('Sesión abandonada');
    } catch (error) {
      console.error('Error al abandonar sesión:', error);
    }
  };

  return {
    client,
    isConnected,
    connectionError,
    isInitializing,
    initClient,
    joinSession,
    leaveSession,
    setIsConnected
  };
};
