'use client';

import { useCallback, useRef, useState } from 'react';

export type UploadedImage = {
  /** Only set for images that already exist in `item_images` */
  id?: string;
  url: string;
};

export type UploadTask = {
  id: number;
  fileName: string;
  progress: number;
  error?: string;
};

type UseImageUploadOptions = {
  onUploaded: (image: UploadedImage) => void;
  onError?: (message: string) => void;
};

type UploadResponse = { url?: string; error?: string };

const parseResponse = (text: string): UploadResponse => {
  try {
    return JSON.parse(text) as UploadResponse;
  } catch {
    return {};
  }
};

/**
 * Posts a single file to `/api/upload` (ImgBB proxy).
 * XHR instead of fetch because only XHR reports upload progress.
 */
function uploadImage(file: File, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('file', file);

    const request = new XMLHttpRequest();
    request.open('POST', '/api/upload');
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener('load', () => {
      const payload = parseResponse(request.responseText);
      if (request.status >= 200 && request.status < 300 && payload.url) resolve(payload.url);
      else reject(new Error(payload.error ?? 'Failed to upload image'));
    });
    request.addEventListener('error', () => reject(new Error('Network error while uploading')));
    request.send(body);
  });
}

/** Queue of in-flight uploads; finished files are handed over through `onUploaded` */
export function useImageUpload({ onUploaded, onError }: UseImageUploadOptions) {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const nextTaskId = useRef(0);

  const upload = useCallback(
    (files: File[]) => {
      for (const file of files.filter((candidate) => candidate.type.startsWith('image/'))) {
        const id = nextTaskId.current++;
        setTasks((prev) => [...prev, { id, fileName: file.name, progress: 0 }]);

        uploadImage(file, (progress) =>
          setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, progress } : task))),
        )
          .then((url) => {
            setTasks((prev) => prev.filter((task) => task.id !== id));
            onUploaded({ url });
          })
          .catch((cause: Error) => {
            setTasks((prev) =>
              prev.map((task) => (task.id === id ? { ...task, error: cause.message } : task)),
            );
            onError?.(cause.message);
          });
      }
    },
    [onUploaded, onError],
  );

  const dismissTask = useCallback(
    (id: number) => setTasks((prev) => prev.filter((task) => task.id !== id)),
    [],
  );

  return { tasks, uploading: tasks.some((task) => !task.error), upload, dismissTask };
}
