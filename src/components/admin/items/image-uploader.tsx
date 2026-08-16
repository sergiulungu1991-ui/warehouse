'use client';

import { useRef, useState, type DragEvent } from 'react';
import { useImageUpload, type UploadedImage } from '@/hooks/use-image-upload';
import { DriveImportButton } from './drive-import-button';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

type ImageUploaderProps = {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  onError?: (message: string) => void;
};

/** Drag & drop uploader with previews; the first image is the primary one */
export function ImageUploader({ images, onChange, onError }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const { tasks, upload, dismissTask } = useImageUpload({
    onUploaded: (image) => onChange([...images, image]),
    onError,
  });

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    upload(Array.from(event.dataTransfer.files));
  };

  const remove = (index: number) => onChange(images.filter((_, i) => i !== index));

  const makePrimary = (index: number) =>
    onChange([images[index], ...images.filter((_, i) => i !== index)]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
            : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600'
        }`}
      >
        <Icon name="upload" className="h-6 w-6 text-zinc-400" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or
          drag images here
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            upload(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
        />
      </div>

      <div className="flex justify-center">
        <DriveImportButton
          onUploaded={(url) => onChange([...images, { url }])}
          onError={onError}
        />
      </div>

      {tasks.length > 0 && (
        <ul aria-live="polite" className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
            >
              <span className="min-w-0 flex-1 truncate text-zinc-700 dark:text-zinc-300">
                {task.fileName}
              </span>
              {task.error ? (
                <>
                  <span className="text-xs text-red-600 dark:text-red-400">{task.error}</span>
                  <button type="button" onClick={() => dismissTask(task.id)} aria-label="Dismiss">
                    <Icon name="close" className="h-4 w-4 text-zinc-400" />
                  </button>
                </>
              ) : (
                <span className="text-xs text-zinc-500">{task.progress}%</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.url}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="aspect-square w-full object-cover" />

              {index === 0 && (
                <span className="absolute left-2 top-2">
                  <Badge tone="info">Primary</Badge>
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/60 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(index)}
                    className="text-xs text-white hover:underline"
                  >
                    Make primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove image"
                  className="ml-auto text-white"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
