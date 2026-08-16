'use client';

import { useCallback, useState } from 'react';
import { useGooglePicker, type GoogleDriveFile } from '@/hooks/use-google-picker';
import { Button } from '@/components/ui/button';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '';

type DriveImportButtonProps = {
  onUploaded: (url: string) => void;
  onError?: (message: string) => void;
};

async function importFromDrive(file: GoogleDriveFile, accessToken: string): Promise<string> {
  const response = await fetch('/api/drive-import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId: file.id, accessToken, name: file.name }),
  });

  const payload = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !payload.url) {
    throw new Error(payload.error ?? 'Failed to import image');
  }
  return payload.url;
}

export function DriveImportButton({ onUploaded, onError }: DriveImportButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleSelect = useCallback(
    async (file: GoogleDriveFile, accessToken: string) => {
      setBusy(true);
      try {
        const url = await importFromDrive(file, accessToken);
        onUploaded(url);
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Drive import failed');
      } finally {
        setBusy(false);
      }
    },
    [onUploaded, onError],
  );

  const { open, loading } = useGooglePicker({
    clientId: GOOGLE_CLIENT_ID,
    apiKey: GOOGLE_API_KEY,
    onSelect: handleSelect,
    onError,
  });

  return (
    <Button
      type="button"
      variant="secondary"
      icon="external"
      loading={busy || loading}
      onClick={open}
    >
      Import from Google Drive
    </Button>
  );
}
