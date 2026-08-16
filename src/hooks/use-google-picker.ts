'use client';

import { useCallback, useRef, useState } from 'react';

export type GoogleDriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

type PickerCallbackData = {
  action: string;
  docs?: { id: string; name: string; mimeType: string }[];
};

type PickerBuilder = {
  addView: (view: DocsView) => PickerBuilder;
  setOAuthToken: (token: string) => PickerBuilder;
  setDeveloperKey: (key: string) => PickerBuilder;
  setCallback: (callback: (data: PickerCallbackData) => void) => PickerBuilder;
  build: () => { setVisible: (visible: boolean) => void };
};

type DocsView = {
  setIncludeFolders: (value: boolean) => DocsView;
  setMimeTypes: (types: string) => DocsView;
  setSelectFolderEnabled: (value: boolean) => DocsView;
};

type TokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type PickerGlobal = {
  PickerBuilder: new () => PickerBuilder;
  DocsView: new () => DocsView;
  DocsViewMode: { GRID: string };
};

type GoogleAccounts = {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: { access_token?: string; error?: string }) => void;
    }) => TokenClient;
  };
};

type GapiGlobal = {
  load: (name: string, callback: () => void) => void;
};

declare global {
  interface Window {
    gapi?: GapiGlobal;
    google?: {
      accounts: GoogleAccounts;
      picker?: PickerGlobal;
    };
  }
}

type UseGooglePickerOptions = {
  clientId: string;
  apiKey: string;
  onSelect: (file: GoogleDriveFile, accessToken: string) => void;
  onError?: (message: string) => void;
};

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const GAPI_SRC = 'https://apis.google.com/js/api.js';
const SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function loadPickerLibrary(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error('Google API loader is not available'));
      return;
    }
    window.gapi.load('picker', () => resolve());
  });
}

export function useGooglePicker({ clientId, apiKey, onSelect, onError }: UseGooglePickerOptions) {
  const [loading, setLoading] = useState(false);
  const tokenClient = useRef<TokenClient | null>(null);

  const open = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      await Promise.all([loadScript(GAPI_SRC), loadScript(GIS_SRC)]);
      await loadPickerLibrary();

      const google = window.google;
      if (!google) {
        throw new Error('Google scripts failed to load');
      }

      const picker = google.picker;
      if (!picker) {
        throw new Error('Google Picker library is not available');
      }

      tokenClient.current = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPE,
        callback: (tokenResponse) => {
          if (tokenResponse.error || !tokenResponse.access_token) {
            onError?.(tokenResponse.error ?? 'Google sign-in was cancelled');
            setLoading(false);
            return;
          }

          const accessToken = tokenResponse.access_token;
          const view = new picker.DocsView()
            .setIncludeFolders(false)
            .setMimeTypes('image/png,image/jpeg,image/webp,image/jpg,image/gif')
            .setSelectFolderEnabled(false);

          const pickerInstance = new picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(accessToken)
            .setDeveloperKey(apiKey)
            .setCallback((data: PickerCallbackData) => {
              if (data.action === 'picked' && data.docs && data.docs.length > 0) {
                const selected = data.docs[0];
                onSelect(selected, accessToken);
              }
              setLoading(false);
            })
            .build();

          pickerInstance.setVisible(true);
        },
      });

      tokenClient.current.requestAccessToken({ prompt: '' });
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to open Google Drive picker');
      setLoading(false);
    }
  }, [clientId, apiKey, loading, onSelect, onError]);

  return { open, loading };
}
