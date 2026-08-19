'use client';

import { useRef, useState, type DragEvent } from 'react';
import { useImageUpload, type UploadedImage } from '@/hooks/use-image-upload';
import { DriveImportButton } from './drive-import-button';
import { Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-dashed p-6 text-center transition-colors',
          dragging
            ? 'border-accent bg-accent-surface'
            : 'border-line-strong hover:border-accent/60 hover:bg-surface-300',
        )}
      >
        <Upload className="h-4 w-4 text-fg-subtle" />
        <p className="text-xs text-fg-muted">
          <span className="font-medium text-accent-text">Click to upload</span> or drag images here
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
        <ul aria-live="polite" className="space-y-1">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 rounded-md border border-line bg-surface-300 px-2 py-1.5 text-xs"
            >
              <span className="min-w-0 flex-1 truncate text-fg-muted">{task.fileName}</span>
              {task.error ? (
                <>
                  <span className="text-[11px] text-red-400">{task.error}</span>
                  <button type="button" onClick={() => dismissTask(task.id)} aria-label="Dismiss">
                    <X className="h-3.5 w-3.5 text-fg-subtle" />
                  </button>
                </>
              ) : (
                <span className="font-mono text-[11px] text-fg-subtle">{task.progress}%</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {images.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((image, index) => (
            <li
              key={image.url}
              className="group relative overflow-hidden rounded-md border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="aspect-square w-full object-cover" />

              {index === 0 && (
                <span className="absolute left-1 top-1">
                  <Badge tone="success">Primary</Badge>
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/70 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(index)}
                    className="text-[11px] text-white hover:underline"
                  >
                    Make primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove image"
                  className="ml-auto text-white hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
