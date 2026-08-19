'use client';

import { useEffect } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';

type ImageLightboxProps = {
  images: { url: string }[];
  index: number;
  name: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/** Fullscreen image viewer; closes on Escape or backdrop click */
export function ImageLightbox({ images, index, name, onClose, onNavigate }: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate((index + 1) % images.length);
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={`${name} image ${index + 1} of ${images.length}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <>
          <NavButton
            side="left"
            label="Previous image"
            onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          />
          <NavButton
            side="right"
            label="Next image"
            onClick={() => onNavigate((index + 1) % images.length)}
          />
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index].url}
        alt={name}
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain"
      />

      {images.length > 1 && (
        <span className="absolute bottom-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          {index + 1} / {images.length}
        </span>
      )}
    </div>
  );
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`absolute ${side === 'left' ? 'left-4' : 'right-4'} rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20`}
    >
      {side === 'left' ? <ArrowLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
