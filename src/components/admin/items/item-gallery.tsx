'use client';

import { useState } from 'react';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
      <div className="flex aspect-square w-full items-center justify-center rounded-md border border-line bg-surface-200">
        <ImageIcon className="h-6 w-6 text-fg-subtle" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Open image in full size"
        className="group relative block w-full overflow-hidden rounded-md border border-line"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[activeIndex].url} alt={name} className="aspect-square w-full object-cover" />
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" />
        </span>
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-1.5">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                'overflow-hidden rounded border transition-colors',
                index === activeIndex
                  ? 'border-accent'
                  : 'border-line hover:border-line-strong',
              )}
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
