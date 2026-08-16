'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { ImageLightbox } from './image-lightbox';

type ItemGalleryProps = {
  images: { url: string }[];
  name: string;
};

export function ItemGallery({ images, name }: ItemGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <Icon name="image" className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Open image in full size"
        className="group relative block w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[activeIndex].url} alt={name} className="aspect-square w-full object-cover" />
        <span className="absolute bottom-2 right-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Icon name="expand" className="h-4 w-4" />
        </span>
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <ImageLightbox
          images={images}
          index={activeIndex}
          name={name}
          onClose={() => setZoomed(false)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}
