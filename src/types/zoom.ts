
export interface ZoomConfig {
  sessionName: string;
  accessToken: string;
  userIdentity: string;
  sessionPassword?: string;
}

export interface RemoteVideoStatus {
  userId: string | null;
  bVideoOn: boolean;
}

export interface VideoRenderEvent {
  action: 'Start' | 'Stop';
  userId: string;
}
